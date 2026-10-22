-- Migration: 20261011150000_payment_and_entitlement_finalization.sql
-- Purpose: Add atomic transaction-safe payment finalization, idempotent entitlement granting,
--          and bundle product resolution functions.

-- 1. Atomic Payment Finalization & Entitlement Grant Function
CREATE OR REPLACE FUNCTION public.finalize_payment_and_grant_entitlement(
  _order_id uuid,
  _provider_order_id text,
  _provider_payment_id text,
  _amount_minor integer,
  _currency text DEFAULT 'INR'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order record;
  v_item record;
  v_product record;
  v_material_id uuid;
  v_entitlements_created integer := 0;
BEGIN
  -- 1. Lock and validate order row
  SELECT * INTO v_order
  FROM public.orders
  WHERE id = _order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order % not found', _order_id;
  END IF;

  -- 2. Idempotency: If order is already paid, safely return without duplicate grants
  IF v_order.status = 'paid' THEN
    -- Ensure payment attempt is recorded
    UPDATE public.payment_attempts
    SET status = 'captured',
        provider_payment_id = COALESCE(provider_payment_id, _provider_payment_id),
        updated_at = now()
    WHERE order_id = _order_id
      AND provider_order_id = _provider_order_id;

    RETURN jsonb_build_object(
      'success', true,
      'already_processed', true,
      'order_id', _order_id,
      'user_id', v_order.user_id,
      'entitlements_created', 0
    );
  END IF;

  -- 3. Only pending orders can be transitioned to paid
  IF v_order.status != 'pending' THEN
    RAISE EXCEPTION 'Order % cannot be paid from status %', _order_id, v_order.status;
  END IF;

  -- 4. Amount and currency validation against database authoritative order
  IF v_order.total_minor != _amount_minor THEN
    RAISE EXCEPTION 'Order amount mismatch: expected %, got %', v_order.total_minor, _amount_minor;
  END IF;

  IF v_order.currency != _currency THEN
    RAISE EXCEPTION 'Order currency mismatch: expected %, got %', v_order.currency, _currency;
  END IF;

  -- 5. Record/update payment attempt
  UPDATE public.payment_attempts
  SET status = 'captured',
      provider_payment_id = _provider_payment_id,
      updated_at = now()
  WHERE order_id = _order_id
    AND provider_order_id = _provider_order_id;

  IF NOT FOUND THEN
    INSERT INTO public.payment_attempts (
      order_id, provider, provider_order_id, provider_payment_id,
      status, amount_minor, currency
    ) VALUES (
      _order_id, 'razorpay', _provider_order_id, _provider_payment_id,
      'captured', _amount_minor, _currency
    );
  END IF;

  -- 6. Update order status to paid
  UPDATE public.orders
  SET status = 'paid',
      paid_at = now(),
      updated_at = now()
  WHERE id = _order_id;

  -- 7. Grant Entitlements for all items in the order
  FOR v_item IN
    SELECT * FROM public.order_items WHERE order_id = _order_id
  LOOP
    SELECT * INTO v_product
    FROM public.products
    WHERE id = v_item.product_id;

    IF FOUND THEN
      IF v_product.product_type = 'material' THEN
        SELECT material_id INTO v_material_id
        FROM public.product_materials
        WHERE product_id = v_product.id
        LIMIT 1;

        IF v_material_id IS NOT NULL THEN
          INSERT INTO public.material_entitlements (
            user_id, entitlement_scope, material_id, order_item_id, source, status
          ) VALUES (
            v_order.user_id, 'single_material', v_material_id, v_item.id, 'payment', 'active'
          )
          ON CONFLICT (user_id, material_id)
            WHERE entitlement_scope = 'single_material' AND status = 'active'
            DO NOTHING;
          v_entitlements_created := v_entitlements_created + 1;
        END IF;
      ELSIF v_product.product_type = 'subject_bundle' THEN
        INSERT INTO public.material_entitlements (
          user_id, entitlement_scope, course_slug, subject_slug, order_item_id, source, status
        ) VALUES (
          v_order.user_id, 'subject_bundle', v_product.course_slug, v_product.subject_slug, v_item.id, 'payment', 'active'
        )
        ON CONFLICT (user_id, course_slug, subject_slug)
          WHERE entitlement_scope = 'subject_bundle' AND status = 'active'
          DO NOTHING;
        v_entitlements_created := v_entitlements_created + 1;
      ELSIF v_product.product_type = 'course_bundle' THEN
        INSERT INTO public.material_entitlements (
          user_id, entitlement_scope, course_slug, order_item_id, source, status
        ) VALUES (
          v_order.user_id, 'course_bundle', v_product.course_slug, v_item.id, 'payment', 'active'
        )
        ON CONFLICT (user_id, course_slug)
          WHERE entitlement_scope = 'course_bundle' AND status = 'active'
          DO NOTHING;
        v_entitlements_created := v_entitlements_created + 1;
      END IF;
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'already_processed', false,
    'order_id', _order_id,
    'user_id', v_order.user_id,
    'entitlements_created', v_entitlements_created
  );
END;
$$;

-- Secure function privileges: ONLY service_role can execute
REVOKE ALL ON FUNCTION public.finalize_payment_and_grant_entitlement(uuid, text, text, integer, text) FROM public, anon, authenticated;

-- 2. Record Failed Payment Attempt Helper Function
CREATE OR REPLACE FUNCTION public.record_failed_payment_attempt(
  _order_id uuid,
  _provider_order_id text,
  _provider_payment_id text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- A delayed failure event must NEVER downgrade a successfully captured payment
  IF NOT EXISTS (SELECT 1 FROM public.orders WHERE id = _order_id AND status = 'paid') THEN
    UPDATE public.payment_attempts
    SET status = 'failed',
        provider_payment_id = COALESCE(_provider_payment_id, provider_payment_id),
        updated_at = now()
    WHERE order_id = _order_id
      AND provider_order_id = _provider_order_id;

    UPDATE public.orders
    SET status = 'failed',
        updated_at = now()
    WHERE id = _order_id
      AND status = 'pending';
  END IF;
END;
$$;

-- Secure function privileges
REVOKE ALL ON FUNCTION public.record_failed_payment_attempt(uuid, text, text) FROM public, anon, authenticated;

-- 3. Bundle Product Resolution Helper Function
CREATE OR REPLACE FUNCTION public.get_or_create_bundle_product(
  _product_type text,
  _course_slug text,
  _subject_slug text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_product_id uuid;
  v_slug text;
  v_title text;
  v_price_minor integer;
BEGIN
  IF _product_type = 'subject_bundle' THEN
    IF _course_slug IS NULL OR _subject_slug IS NULL THEN
      RAISE EXCEPTION 'subject_bundle requires course_slug and subject_slug';
    END IF;
    v_slug := 'subject-bundle-' || _course_slug || '-' || _subject_slug;
    v_title := initcap(replace(_course_slug, '-', ' ')) || ' ' || initcap(replace(_subject_slug, '-', ' ')) || ' Complete Subject Bundle';
    v_price_minor := 49900; -- ₹499 (49,900 paise)
  ELSIF _product_type = 'course_bundle' THEN
    IF _course_slug IS NULL THEN
      RAISE EXCEPTION 'course_bundle requires course_slug';
    END IF;
    v_slug := 'course-bundle-' || _course_slug;
    v_title := initcap(replace(_course_slug, '-', ' ')) || ' Complete Course Bundle';
    v_price_minor := 99900; -- ₹999 (99,900 paise)
  ELSE
    RAISE EXCEPTION 'Unsupported bundle product type %', _product_type;
  END IF;

  SELECT id INTO v_product_id
  FROM public.products
  WHERE slug = v_slug;

  IF NOT FOUND THEN
    INSERT INTO public.products (
      slug, title, description, product_type, course_slug, subject_slug, price_minor, currency, status
    ) VALUES (
      v_slug, v_title, 'Complete access to all chapters and future additions',
      _product_type, _course_slug, _subject_slug, v_price_minor, 'INR', 'published'
    )
    RETURNING id INTO v_product_id;
  END IF;

  RETURN v_product_id;
END;
$$;

-- Secure function privileges
REVOKE ALL ON FUNCTION public.get_or_create_bundle_product(text, text, text) FROM public, anon, authenticated;

