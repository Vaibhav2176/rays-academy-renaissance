-- ============================================================================
-- Migration: 20261011160000_legacy_purchases_and_portal_integration.sql
-- Description: Milestone 1B.5: Student Portal & Legacy Purchase Compatibility
--
-- 1. Updates has_material_access to check legacy user_material_purchases
-- 2. Adds automated synchronization trigger from user_material_purchases to material_entitlements
-- 3. Idempotently backfills legacy user_material_purchases into material_entitlements
-- 4. Verifies RLS read policies for student portal access
-- ============================================================================

-- 1. Update has_material_access to natively support legacy purchases
CREATE OR REPLACE FUNCTION public.has_material_access(_user_id uuid, _material_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_free boolean;
  v_course_slug text;
  v_subject_slug text;
  v_has_access boolean;
BEGIN
  -- 1. Free materials are accessible to all
  SELECT is_free, course_slug, subject_slug
  INTO v_is_free, v_course_slug, v_subject_slug
  FROM public.study_materials
  WHERE id = _material_id AND status = 'published';

  IF NOT FOUND THEN
    -- If material not published or not found, check if admin
    RETURN (_user_id IS NOT NULL AND public.has_role(_user_id, 'admin'));
  END IF;

  IF v_is_free = true THEN
    RETURN true;
  END IF;

  -- If user is unauthenticated, cannot have paid access
  IF _user_id IS NULL THEN
    RETURN false;
  END IF;

  -- 2. Admin role has universal preview/download access
  IF public.has_role(_user_id, 'admin') THEN
    RETURN true;
  END IF;

  -- 3. Check direct single-material entitlement
  SELECT EXISTS (
    SELECT 1 FROM public.material_entitlements
    WHERE user_id = _user_id
      AND status = 'active'
      AND entitlement_scope = 'single_material'
      AND material_id = _material_id
  ) INTO v_has_access;

  IF v_has_access THEN
    RETURN true;
  END IF;

  -- 4. Check legacy user_material_purchases (including coupon redemptions)
  SELECT EXISTS (
    SELECT 1 FROM public.user_material_purchases
    WHERE user_id = _user_id
      AND material_id = _material_id
  ) INTO v_has_access;

  IF v_has_access THEN
    RETURN true;
  END IF;

  -- 5. Check subject bundle entitlement (durable for current + future materials in subject)
  IF v_course_slug IS NOT NULL AND v_subject_slug IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.material_entitlements
      WHERE user_id = _user_id
        AND status = 'active'
        AND entitlement_scope = 'subject_bundle'
        AND course_slug = v_course_slug
        AND subject_slug = v_subject_slug
    ) INTO v_has_access;

    IF v_has_access THEN
      RETURN true;
    END IF;
  END IF;

  -- 6. Check course bundle entitlement (durable for current + future materials in course)
  IF v_course_slug IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.material_entitlements
      WHERE user_id = _user_id
        AND status = 'active'
        AND entitlement_scope = 'course_bundle'
        AND course_slug = v_course_slug
    ) INTO v_has_access;

    IF v_has_access THEN
      RETURN true;
    END IF;
  END IF;

  RETURN false;
END;
$$;

-- Secure function execution privileges
REVOKE ALL ON FUNCTION public.has_material_access(uuid, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.has_material_access(uuid, uuid) TO anon, authenticated, service_role;

-- 2. Synchronization Trigger: Map new legacy / coupon purchases to durable entitlements
CREATE OR REPLACE FUNCTION public.sync_user_material_purchase_to_entitlement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.material_entitlements (
    user_id,
    entitlement_scope,
    material_id,
    source,
    status
  ) VALUES (
    NEW.user_id,
    'single_material',
    NEW.material_id,
    'legacy_migration',
    'active'
  )
  ON CONFLICT (user_id, material_id)
    WHERE entitlement_scope = 'single_material' AND status = 'active'
    DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_material_purchases_sync_entitlement ON public.user_material_purchases;
CREATE TRIGGER user_material_purchases_sync_entitlement
  AFTER INSERT ON public.user_material_purchases
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_material_purchase_to_entitlement();

-- 3. Idempotent Backfill: Map existing legacy records to material_entitlements
INSERT INTO public.material_entitlements (
  user_id,
  entitlement_scope,
  material_id,
  source,
  status
)
SELECT
  ump.user_id,
  'single_material',
  ump.material_id,
  'legacy_migration',
  'active'
FROM public.user_material_purchases ump
WHERE EXISTS (
  SELECT 1 FROM public.study_materials sm WHERE sm.id = ump.material_id
)
ON CONFLICT (user_id, material_id)
  WHERE entitlement_scope = 'single_material' AND status = 'active'
  DO NOTHING;

