-- ==============================================================================
-- Rays Academy — Study Material Marketplace Foundation (Additive Migration)
-- Date: 2026-10-11
--
-- This migration adds catalog metadata, durable bundle entitlements, versions,
-- products, orders, download logging, and teacher approval states WITHOUT
-- dropping or altering legacy purchase tables, coupons, or existing RPCs.
-- ==============================================================================

-- 1. Extend study_materials with catalog, hierarchy, pricing, and review columns
ALTER TABLE public.study_materials
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS catalog_key text,
  ADD COLUMN IF NOT EXISTS course_slug text,
  ADD COLUMN IF NOT EXISTS subject_slug text,
  ADD COLUMN IF NOT EXISTS section_name text,
  ADD COLUMN IF NOT EXISTS resource_type text NOT NULL DEFAULT 'chapter',
  ADD COLUMN IF NOT EXISTS chapter_number integer,
  ADD COLUMN IF NOT EXISTS subject_sequence_number integer,
  ADD COLUMN IF NOT EXISTS topic_title text,
  ADD COLUMN IF NOT EXISTS board_exam text,
  ADD COLUMN IF NOT EXISTS academic_year text,
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS price_minor integer DEFAULT 4900,
  ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS review_notes text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz;

-- Set default material_type to 'pdf' if not already set
ALTER TABLE public.study_materials
  ALTER COLUMN material_type SET DEFAULT 'pdf';

-- Add check constraints safely
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'study_materials_resource_type_check') THEN
    ALTER TABLE public.study_materials
      ADD CONSTRAINT study_materials_resource_type_check
      CHECK (resource_type IN ('chapter', 'pyq', 'sample_paper', 'formula_sheet', 'revision_notes', 'important_questions', 'ncert', 'other'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'study_materials_review_status_check') THEN
    ALTER TABLE public.study_materials
      ADD CONSTRAINT study_materials_review_status_check
      CHECK (review_status IN ('draft', 'in_review', 'approved', 'rejected'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'study_materials_status_check') THEN
    ALTER TABLE public.study_materials
      ADD CONSTRAINT study_materials_status_check
      CHECK (status IN ('draft', 'in_review', 'approved', 'published', 'archived'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'study_materials_currency_check') THEN
    ALTER TABLE public.study_materials
      ADD CONSTRAINT study_materials_currency_check
      CHECK (currency ~ '^[A-Z]{3}$');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'study_materials_price_minor_nonnegative_check') THEN
    ALTER TABLE public.study_materials
      ADD CONSTRAINT study_materials_price_minor_nonnegative_check
      CHECK (price_minor IS NULL OR price_minor >= 0);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'study_materials_chapter_number_positive_check') THEN
    ALTER TABLE public.study_materials
      ADD CONSTRAINT study_materials_chapter_number_positive_check
      CHECK (chapter_number IS NULL OR chapter_number > 0);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'study_materials_subject_sequence_positive_check') THEN
    ALTER TABLE public.study_materials
      ADD CONSTRAINT study_materials_subject_sequence_positive_check
      CHECK (subject_sequence_number IS NULL OR subject_sequence_number > 0);
  END IF;
END $$;

-- Indexes for performance and uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS study_materials_slug_unique
  ON public.study_materials (slug) WHERE slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS study_materials_catalog_idx
  ON public.study_materials (catalog_key, status, subject_slug);

CREATE INDEX IF NOT EXISTS study_materials_course_subject_idx
  ON public.study_materials (course_slug, subject_slug, resource_type, subject_sequence_number);

-- Enforce unique subject-level sequence across the overall subject (regardless of subsection)
CREATE UNIQUE INDEX IF NOT EXISTS study_materials_subject_sequence_unique
  ON public.study_materials (course_slug, subject_slug, subject_sequence_number)
  WHERE resource_type = 'chapter' AND subject_sequence_number IS NOT NULL AND course_slug IS NOT NULL AND subject_slug IS NOT NULL;

-- 2. Trigger: Server-side Free-Chapter Rule
-- Enforces: First 2 topics of each subject (based on subject_sequence_number) are permanently free.
-- Subsequent topics are ₹49 (4900 paise).
-- Chapters cannot bypass pricing rules by omitting sequence numbers.
CREATE OR REPLACE FUNCTION public.apply_free_chapter_rule()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.resource_type = 'chapter' THEN
    -- If subject_sequence_number is null but chapter_number is provided, default sequence to chapter_number
    IF NEW.subject_sequence_number IS NULL AND NEW.chapter_number IS NOT NULL THEN
      NEW.subject_sequence_number := NEW.chapter_number;
    END IF;

    IF NEW.subject_sequence_number IS NOT NULL THEN
      IF NEW.subject_sequence_number <= 2 THEN
        NEW.is_free := true;
        NEW.price_minor := 0;
        NEW.price := 0.00;
      ELSE
        NEW.is_free := false;
        IF NEW.price_minor IS NULL OR NEW.price_minor <= 0 THEN
          NEW.price_minor := 4900; -- Standard ₹49
        END IF;
        NEW.price := ROUND((NEW.price_minor::decimal / 100.0), 2);
      END IF;
    ELSE
      -- Chapter without sequence number CANNOT be free under any circumstances
      NEW.is_free := false;
      IF NEW.price_minor IS NULL OR NEW.price_minor <= 0 THEN
        NEW.price_minor := 4900;
      END IF;
      NEW.price := ROUND((NEW.price_minor::decimal / 100.0), 2);
    END IF;
  ELSE
    -- Non-chapter resources (PYQs, formula sheets, sample papers) retain their own price/free settings
    IF NEW.is_free = true THEN
      NEW.price_minor := 0;
      NEW.price := 0.00;
    ELSIF NEW.price_minor IS NOT NULL THEN
      NEW.price := ROUND((NEW.price_minor::decimal / 100.0), 2);
    ELSIF NEW.price IS NOT NULL THEN
      NEW.price_minor := ROUND(NEW.price * 100)::integer;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS study_materials_apply_free_chapter_rule ON public.study_materials;
CREATE TRIGGER study_materials_apply_free_chapter_rule
  BEFORE INSERT OR UPDATE OF resource_type, chapter_number, subject_sequence_number, is_free, price_minor, price
  ON public.study_materials
  FOR EACH ROW EXECUTE FUNCTION public.apply_free_chapter_rule();

-- 3. File Revisions with SHA-256 Checksums and Approval State
CREATE TABLE IF NOT EXISTS public.study_material_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id uuid NOT NULL REFERENCES public.study_materials(id) ON DELETE CASCADE,
  version_number integer NOT NULL CHECK (version_number > 0),
  storage_path text NOT NULL UNIQUE,
  original_filename text NOT NULL,
  mime_type text NOT NULL CHECK (mime_type = 'application/pdf'),
  file_size_bytes bigint NOT NULL CHECK (file_size_bytes > 0),
  checksum_sha256 text NOT NULL,
  is_current boolean NOT NULL DEFAULT false,
  approval_status text NOT NULL DEFAULT 'draft' CHECK (approval_status IN ('draft', 'in_review', 'approved', 'rejected')),
  approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (material_id, version_number)
);

CREATE UNIQUE INDEX IF NOT EXISTS study_material_one_current_version
  ON public.study_material_versions (material_id) WHERE is_current;

CREATE INDEX IF NOT EXISTS study_material_versions_material_idx
  ON public.study_material_versions (material_id, version_number DESC);

-- 4. Publication Gate Trigger (Requires approved teacher review, approved active PDF, course/subject metadata)
CREATE OR REPLACE FUNCTION public.check_material_publication()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_has_approved_pdf boolean;
BEGIN
  IF NEW.status = 'published' THEN
    -- Check that course and subject are specified
    IF NEW.course_slug IS NULL OR NEW.subject_slug IS NULL THEN
      RAISE EXCEPTION 'Cannot publish material %: requires course_slug and subject_slug',
        NEW.id;
    END IF;

    -- Check that chapter material has explicit subject sequence
    IF NEW.resource_type = 'chapter' AND NEW.subject_sequence_number IS NULL THEN
      RAISE EXCEPTION 'Cannot publish chapter material %: requires subject_sequence_number',
        NEW.id;
    END IF;

    -- Check that faculty review status is approved
    IF NEW.review_status != 'approved' THEN
      RAISE EXCEPTION 'Cannot publish material %: faculty review status must be approved (current: %)',
        NEW.id, NEW.review_status;
    END IF;

    -- Check that at least one current version exists and is approved
    SELECT EXISTS (
      SELECT 1 FROM public.study_material_versions
      WHERE material_id = NEW.id
        AND is_current = true
        AND approval_status = 'approved'
    ) INTO v_has_approved_pdf;

    IF NOT v_has_approved_pdf THEN
      RAISE EXCEPTION 'Cannot publish material %: requires an approved current PDF version',
        NEW.id;
    END IF;

    IF NEW.published_at IS NULL THEN
      NEW.published_at := now();
    END IF;
  ELSIF NEW.status = 'archived' AND NEW.archived_at IS NULL THEN
    NEW.archived_at := now();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS study_materials_check_publication ON public.study_materials;
CREATE TRIGGER study_materials_check_publication
  BEFORE INSERT OR UPDATE OF status, review_status, course_slug, subject_slug, subject_sequence_number
  ON public.study_materials
  FOR EACH ROW EXECUTE FUNCTION public.check_material_publication();

-- Version Mutation Gate: Prevent removing current approved version from a published material
-- and prevent reassigning version across materials
CREATE OR REPLACE FUNCTION public.check_version_mutation_on_published_material()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_material_status text;
  v_other_approved_exists boolean;
BEGIN
  -- Reassigning versions across materials is strictly prohibited
  IF TG_OP = 'UPDATE' AND NEW.material_id != OLD.material_id THEN
    RAISE EXCEPTION 'Cannot reassign version % to a different material %',
      OLD.id, NEW.material_id;
  END IF;

  SELECT status INTO v_material_status
  FROM public.study_materials
  WHERE id = COALESCE(OLD.material_id, NEW.material_id);

  IF v_material_status = 'published' THEN
    IF TG_OP = 'DELETE' THEN
      IF OLD.is_current = true AND OLD.approval_status = 'approved' THEN
        RAISE EXCEPTION 'Cannot delete the current approved version of published material %. Unpublish the material first.',
          OLD.material_id;
      END IF;
    ELSIF TG_OP = 'UPDATE' THEN
      -- Cannot set an unapproved version as current on a published material
      IF NEW.is_current = true AND NEW.approval_status != 'approved' THEN
        RAISE EXCEPTION 'Cannot set unapproved version % as current on published material %',
          NEW.id, NEW.material_id;
      END IF;

      -- If demoting is_current or removing approved status from the currently active version
      IF OLD.is_current = true AND OLD.approval_status = 'approved' AND
         (NEW.is_current = false OR NEW.approval_status != 'approved') THEN
        SELECT EXISTS (
          SELECT 1 FROM public.study_material_versions
          WHERE material_id = NEW.material_id
            AND id != NEW.id
            AND approval_status = 'approved'
        ) INTO v_other_approved_exists;

        IF NOT v_other_approved_exists THEN
          RAISE EXCEPTION 'Cannot remove current approved status from published material % without an active approved replacement.',
            NEW.material_id;
        END IF;
      END IF;
    ELSIF TG_OP = 'INSERT' THEN
      -- If inserting a version directly as current on a published material, it must be approved
      IF NEW.is_current = true AND NEW.approval_status != 'approved' THEN
        RAISE EXCEPTION 'Cannot insert unapproved version % as current on published material %',
          NEW.id, NEW.material_id;
      END IF;
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS study_material_versions_check_mutation ON public.study_material_versions;
CREATE TRIGGER study_material_versions_check_mutation
  BEFORE INSERT OR UPDATE OR DELETE ON public.study_material_versions
  FOR EACH ROW EXECUTE FUNCTION public.check_version_mutation_on_published_material();

-- 5. Commerce Entities: Products (Individual, Subject Bundles, Course Collections)
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  product_type text NOT NULL CHECK (product_type IN ('material', 'subject_bundle', 'course_bundle')),
  course_slug text,
  subject_slug text,
  price_minor integer NOT NULL CHECK (price_minor >= 0),
  currency text NOT NULL DEFAULT 'INR' CHECK (currency ~ '^[A-Z]{3}$'),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_materials (
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  material_id uuid NOT NULL REFERENCES public.study_materials(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (product_id, material_id)
);

CREATE INDEX IF NOT EXISTS product_materials_material_idx
  ON public.product_materials (material_id);

-- 6. Orders and Payment Attempts
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'failed', 'cancelled', 'refunded', 'partially_refunded', 'disputed')),
  currency text NOT NULL DEFAULT 'INR' CHECK (currency ~ '^[A-Z]{3}$'),
  subtotal_minor integer NOT NULL CHECK (subtotal_minor >= 0),
  discount_minor integer NOT NULL DEFAULT 0 CHECK (discount_minor >= 0),
  total_minor integer NOT NULL CHECK (total_minor >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_slug text NOT NULL,
  product_title text NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_minor integer NOT NULL CHECK (unit_price_minor >= 0),
  currency text NOT NULL DEFAULT 'INR' CHECK (currency ~ '^[A-Z]{3}$'),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payment_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  provider text NOT NULL CHECK (provider IN ('razorpay')),
  provider_order_id text UNIQUE,
  provider_payment_id text UNIQUE,
  status text NOT NULL DEFAULT 'created'
    CHECK (status IN ('created', 'authorized', 'captured', 'failed', 'refunded')),
  amount_minor integer NOT NULL CHECK (amount_minor >= 0),
  currency text NOT NULL DEFAULT 'INR' CHECK (currency ~ '^[A-Z]{3}$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payment_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL CHECK (provider IN ('razorpay')),
  provider_event_id text NOT NULL,
  event_type text NOT NULL,
  processing_status text NOT NULL DEFAULT 'received'
    CHECK (processing_status IN ('received', 'processed', 'failed')),
  payload jsonb,
  error_message text,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  UNIQUE (provider, provider_event_id)
);

-- 7. Durable Entitlements (Supports Single Materials, Subject Bundles, and Course Bundles)
CREATE TABLE IF NOT EXISTS public.material_entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entitlement_scope text NOT NULL
    CHECK (entitlement_scope IN ('single_material', 'subject_bundle', 'course_bundle')),
  material_id uuid REFERENCES public.study_materials(id) ON DELETE CASCADE,
  course_slug text,
  subject_slug text,
  order_item_id uuid REFERENCES public.order_items(id) ON DELETE SET NULL,
  source text NOT NULL CHECK (source IN ('payment', 'admin_grant', 'legacy_migration')),
  granted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  grant_reason text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  granted_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  CONSTRAINT entitlement_scope_consistency CHECK (
    (entitlement_scope = 'single_material' AND material_id IS NOT NULL) OR
    (entitlement_scope = 'subject_bundle' AND course_slug IS NOT NULL AND subject_slug IS NOT NULL) OR
    (entitlement_scope = 'course_bundle' AND course_slug IS NOT NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS entitlement_user_material_unique
  ON public.material_entitlements (user_id, material_id)
  WHERE entitlement_scope = 'single_material' AND status = 'active';

CREATE UNIQUE INDEX IF NOT EXISTS entitlement_user_subject_bundle_unique
  ON public.material_entitlements (user_id, course_slug, subject_slug)
  WHERE entitlement_scope = 'subject_bundle' AND status = 'active';

CREATE UNIQUE INDEX IF NOT EXISTS entitlement_user_course_bundle_unique
  ON public.material_entitlements (user_id, course_slug)
  WHERE entitlement_scope = 'course_bundle' AND status = 'active';

CREATE INDEX IF NOT EXISTS material_entitlements_lookup_idx
  ON public.material_entitlements (user_id, status, entitlement_scope);

-- 8. Durable Entitlement Resolution Function
CREATE OR REPLACE FUNCTION public.has_material_access(_user_id uuid, _material_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
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

  -- 4. Check subject bundle entitlement (durable for current + future materials in subject)
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

  -- 5. Check course bundle entitlement (durable for current + future materials in course)
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

-- Secure function privileges
REVOKE ALL ON FUNCTION public.has_material_access(uuid, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.has_material_access(uuid, uuid) TO anon, authenticated;

-- 9. Download Event Logging
CREATE TABLE IF NOT EXISTS public.material_download_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id uuid NOT NULL REFERENCES public.study_materials(id) ON DELETE CASCADE,
  version_id uuid REFERENCES public.study_material_versions(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  is_free_download boolean NOT NULL DEFAULT false,
  download_id uuid NOT NULL DEFAULT gen_random_uuid(),
  referrer_host text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS material_download_events_material_idx
  ON public.material_download_events (material_id, created_at DESC);

CREATE INDEX IF NOT EXISTS material_download_events_user_idx
  ON public.material_download_events (user_id, created_at DESC);

-- 10. Safe Published-Only Catalog View
CREATE OR REPLACE VIEW public.study_material_catalog
WITH (security_barrier = true)
AS
SELECT
  id,
  class_id,
  title,
  slug,
  catalog_key,
  course_slug,
  subject_slug,
  section_name,
  resource_type,
  chapter_number,
  subject_sequence_number,
  topic_title,
  description,
  material_type,
  subject,
  board_exam,
  academic_year,
  price_minor,
  currency,
  is_free,
  status,
  published_at,
  created_at,
  updated_at
FROM public.study_materials
WHERE status = 'published';

GRANT SELECT ON public.study_material_catalog TO anon, authenticated;

-- 11. Storage Configuration: Private Bucket for Study Material PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('study-materials', 'study-materials', false, 52428800, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['application/pdf'];

-- 12. Row Level Security Policies
ALTER TABLE public.study_material_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_download_events ENABLE ROW LEVEL SECURITY;

-- Products
CREATE POLICY "Anyone can view published products" ON public.products
  FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Product Materials
CREATE POLICY "Anyone can view product materials for published products" ON public.product_materials
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id AND (p.status = 'published' OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Admins can manage product materials" ON public.product_materials
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Orders
CREATE POLICY "Users can read own orders" ON public.orders
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Order Items
CREATE POLICY "Users can read own order items" ON public.order_items
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
  );

CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Payment Attempts
CREATE POLICY "Users can read own payment attempts" ON public.payment_attempts
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
  );

CREATE POLICY "Admins can view all payment attempts" ON public.payment_attempts
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Material Entitlements
CREATE POLICY "Users can read own entitlements" ON public.material_entitlements
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all entitlements" ON public.material_entitlements
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Study Material Versions
CREATE POLICY "Admins can manage study material versions" ON public.study_material_versions
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Webhook Events
CREATE POLICY "Admins can view webhook events" ON public.payment_webhook_events
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Download Events
CREATE POLICY "Users can read own download events" ON public.material_download_events
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Admins can view all download events" ON public.material_download_events
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Lockdown write privileges for non-admins
REVOKE INSERT, UPDATE, DELETE ON public.material_entitlements FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.study_material_versions FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.orders FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.order_items FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.payment_attempts FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.payment_webhook_events FROM anon, authenticated;
