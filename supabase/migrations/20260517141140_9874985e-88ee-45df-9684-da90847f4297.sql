
-- 1. enrollment_codes: remove public SELECT (validation happens via use_enrollment_code RPC)
DROP POLICY IF EXISTS "Anyone can validate unused codes" ON public.enrollment_codes;

-- 2. material_coupons: remove public SELECT (validation happens via redeem_coupon RPC)
DROP POLICY IF EXISTS "Anyone can validate active coupons" ON public.material_coupons;

-- 3. profiles: add INSERT policy restricted to own id
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- 4. scholarship_tests: require authenticated user
DROP POLICY IF EXISTS "Students can view active tests for their class" ON public.scholarship_tests;
CREATE POLICY "Students can view active tests for their class"
ON public.scholarship_tests
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL
  AND (
    ((class_id = get_student_class_id(auth.uid())) AND (is_active = true))
    OR (class_id IS NULL)
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);
