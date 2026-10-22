-- Migration: 20261011180000_study_materials_rls_published_access.sql
-- Description: Restrict public and student SELECT queries on public.study_materials
--              to published materials only, while preserving full administrator access
--              across all statuses (draft, in_review, approved, rejected, archived).

-- 1. Ensure Row Level Security remains enabled on study_materials
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

-- 2. Drop the overly permissive legacy SELECT policy
DROP POLICY IF EXISTS "Anyone can view material info" ON public.study_materials;

-- 3. Drop existing target policy if it already exists (idempotent re-run safety)
DROP POLICY IF EXISTS "Anyone can view published materials" ON public.study_materials;

-- 4. Create the narrow published-or-admin SELECT policy
-- Non-admin clients (anonymous visitors and logged-in students) can only view published materials.
-- Administrators (having the 'admin' app_role in public.user_roles) retain visibility into all materials.
CREATE POLICY "Anyone can view published materials" ON public.study_materials
  FOR SELECT
  USING (
    status = 'published' OR public.has_role(auth.uid(), 'admin'::public.app_role)
  );

-- 5. Explicitly document policy purpose
COMMENT ON POLICY "Anyone can view published materials" ON public.study_materials IS
  'Restricts SELECT access to published study materials for general users, while allowing administrators full visibility across all material statuses.';

