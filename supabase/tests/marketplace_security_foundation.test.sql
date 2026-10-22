-- ==============================================================================
-- Rays Academy — Study Material Marketplace Foundation Security Tests (pgTAP)
-- File: supabase/tests/marketplace_security_foundation.test.sql
-- ==============================================================================

BEGIN;
SELECT plan(55);

-- ------------------------------------------------------------------------------
-- 1. Schema Objects Existence
-- ------------------------------------------------------------------------------
SELECT has_table('public', 'study_material_versions', 'study_material_versions table exists');
SELECT has_table('public', 'products', 'products table exists');
SELECT has_table('public', 'product_materials', 'product_materials table exists');
SELECT has_table('public', 'orders', 'orders table exists');
SELECT has_table('public', 'order_items', 'order_items table exists');
SELECT has_table('public', 'payment_attempts', 'payment_attempts table exists');
SELECT has_table('public', 'payment_webhook_events', 'payment_webhook_events table exists');
SELECT has_table('public', 'material_entitlements', 'material_entitlements table exists');
SELECT has_table('public', 'material_download_events', 'material_download_events table exists');

SELECT has_view('public', 'study_material_catalog', 'safe public study_material_catalog view exists');

-- ------------------------------------------------------------------------------
-- 2. Public Catalog Privacy Guarantees (Invariant 7)
-- ------------------------------------------------------------------------------
SELECT hasnt_column(
  'public', 'study_material_catalog', 'file_url',
  'public catalog view does not expose legacy file_url'
);

SELECT hasnt_column(
  'public', 'study_material_catalog', 'storage_path',
  'public catalog view does not expose private storage_path'
);

SELECT hasnt_column(
  'public', 'study_material_catalog', 'checksum_sha256',
  'public catalog view does not expose internal checksum_sha256'
);

SELECT has_column(
  'public', 'study_material_catalog', 'subject_sequence_number',
  'public catalog view exposes canonical subject_sequence_number'
);

-- ------------------------------------------------------------------------------
-- 3. Core Functions & Triggers
-- ------------------------------------------------------------------------------
SELECT has_function(
  'public', 'has_material_access', ARRAY['uuid', 'uuid'],
  'durable entitlement resolution function has_material_access exists'
);

SELECT has_function(
  'public', 'apply_free_chapter_rule',
  'free chapter business rule function exists'
);

SELECT has_function(
  'public', 'check_material_publication',
  'publication gate check function exists'
);

SELECT has_function(
  'public', 'check_version_mutation_on_published_material',
  'version mutation gate on published material exists'
);

-- ------------------------------------------------------------------------------
-- 4. Table Privileges & Client Lockdown (Invariant 8)
-- ------------------------------------------------------------------------------
SELECT ok(
  NOT has_table_privilege('anon', 'public.material_entitlements', 'INSERT'),
  'anonymous users cannot insert into material_entitlements'
);

SELECT ok(
  NOT has_table_privilege('authenticated', 'public.material_entitlements', 'INSERT'),
  'authenticated users cannot insert into material_entitlements'
);

SELECT ok(
  NOT has_table_privilege('anon', 'public.study_material_versions', 'INSERT'),
  'anonymous users cannot insert into study_material_versions'
);

SELECT ok(
  NOT has_table_privilege('authenticated', 'public.study_material_versions', 'INSERT'),
  'authenticated users cannot insert into study_material_versions'
);

-- ------------------------------------------------------------------------------
-- 5. Business Rule Verification: Free Chapter Sequential Pricing Across Subsections
-- ------------------------------------------------------------------------------
-- Setup test class
INSERT INTO public.classes (id, name, description)
VALUES ('11111111-1111-1111-1111-111111111111', 'Test Class NDA', 'Class for automated tests')
ON CONFLICT (id) DO NOTHING;

-- Topic 1 (Section Algebra, Sequence 1) -> must be free
INSERT INTO public.study_materials (
  id, class_id, title, course_slug, subject_slug, section_name, resource_type,
  chapter_number, subject_sequence_number, status, review_status
) VALUES (
  '22222222-2222-2222-2222-222222222221',
  '11111111-1111-1111-1111-111111111111',
  'NDA Maths - Topic 1 (Algebra Sets)',
  'nda', 'maths', 'Algebra', 'chapter',
  1, 1, 'draft', 'draft'
);

SELECT results_eq(
  $$ SELECT is_free, price_minor FROM public.study_materials WHERE id = '22222222-2222-2222-2222-222222222221' $$,
  $$ VALUES (true, 0) $$,
  'subject sequence 1 is automatically free (price_minor = 0)'
);

-- Topic 2 (Section Algebra, Sequence 2) -> must be free
INSERT INTO public.study_materials (
  id, class_id, title, course_slug, subject_slug, section_name, resource_type,
  chapter_number, subject_sequence_number, status, review_status
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'NDA Maths - Topic 2 (Venn Diagrams)',
  'nda', 'maths', 'Algebra', 'chapter',
  2, 2, 'draft', 'draft'
);

SELECT results_eq(
  $$ SELECT is_free, price_minor FROM public.study_materials WHERE id = '22222222-2222-2222-2222-222222222222' $$,
  $$ VALUES (true, 0) $$,
  'subject sequence 2 is automatically free (price_minor = 0)'
);

-- Topic 3 (Section Trigonometry, Sequence 3) -> overall sequence 3 -> MUST BE PAID ₹49
INSERT INTO public.study_materials (
  id, class_id, title, course_slug, subject_slug, section_name, resource_type,
  chapter_number, subject_sequence_number, status, review_status
) VALUES (
  '22222222-2222-2222-2222-222222222223',
  '11111111-1111-1111-1111-111111111111',
  'NDA Maths - Topic 3 (Trigonometry Angles)',
  'nda', 'maths', 'Trigonometry', 'chapter',
  1, 3, 'draft', 'draft'
);

SELECT results_eq(
  $$ SELECT is_free, price_minor FROM public.study_materials WHERE id = '22222222-2222-2222-2222-222222222223' $$,
  $$ VALUES (false, 4900) $$,
  'subject sequence 3 in Trigonometry is NOT free, priced at ₹49 (4900 paise)'
);

-- Invariant 1: Chapter omitting sequence number CANNOT bypass pricing to become free
INSERT INTO public.study_materials (
  id, class_id, title, course_slug, subject_slug, section_name, resource_type,
  chapter_number, subject_sequence_number, is_free, status, review_status
) VALUES (
  '22222222-2222-2222-2222-222222222226',
  '11111111-1111-1111-1111-111111111111',
  'NDA Maths - Unnumbered Chapter',
  'nda', 'maths', 'Calculus', 'chapter',
  NULL, NULL, true, 'draft', 'draft'
);

SELECT results_eq(
  $$ SELECT is_free, price_minor FROM public.study_materials WHERE id = '22222222-2222-2222-2222-222222222226' $$,
  $$ VALUES (false, 4900) $$,
  'chapter omitting sequence number cannot be free, defaulted to paid ₹49'
);

-- Invariant 2: Uniqueness of subject_sequence_number within (course_slug, subject_slug)
SELECT throws_ok(
  $$ INSERT INTO public.study_materials (
       id, class_id, title, course_slug, subject_slug, resource_type, subject_sequence_number, status
     ) VALUES (
       '22222222-2222-2222-2222-222222222227',
       '11111111-1111-1111-1111-111111111111',
       'Duplicate Sequence Topic',
       'nda', 'maths', 'chapter', 1, 'draft'
     ) $$,
  '23505', -- unique_violation SQLSTATE
  NULL,
  'duplicate subject sequence number in same course and subject throws unique violation'
);

-- Invariant 2: Independent course sequence (JEE Maths Sequence 1 is free independently)
INSERT INTO public.study_materials (
  id, class_id, title, course_slug, subject_slug, section_name, resource_type,
  chapter_number, subject_sequence_number, status, review_status
) VALUES (
  '22222222-2222-2222-2222-222222222224',
  '11111111-1111-1111-1111-111111111111',
  'JEE Maths - Topic 1 (Calculus Limits)',
  'jee', 'maths', 'Calculus', 'chapter',
  1, 1, 'draft', 'draft'
);

SELECT results_eq(
  $$ SELECT is_free, price_minor FROM public.study_materials WHERE id = '22222222-2222-2222-2222-222222222224' $$,
  $$ VALUES (true, 0) $$,
  'JEE course Maths topic sequence 1 is free independently of NDA Maths sequence'
);

-- ------------------------------------------------------------------------------
-- 6. Publication Gate Verification (Invariant 9)
-- ------------------------------------------------------------------------------
-- Attempting to publish without teacher approval and valid PDF must fail
SELECT throws_ok(
  $$ UPDATE public.study_materials SET status = 'published' WHERE id = '22222222-2222-2222-2222-222222222223' $$,
  NULL,
  'publishing unapproved draft without PDF version raises exception'
);

-- ------------------------------------------------------------------------------
-- 7. Entitlements & Revocation Verification (Invariant 6)
-- ------------------------------------------------------------------------------
-- Setup test users
INSERT INTO auth.users (id, email) VALUES
  ('99999999-9999-9999-9999-999999999991', 'student1@example.com'),
  ('99999999-9999-9999-9999-999999999992', 'student2@example.com')
ON CONFLICT (id) DO NOTHING;

-- Grant active entitlement for Topic 3 to Student 1
INSERT INTO public.material_entitlements (
  user_id, entitlement_scope, material_id, source, status
) VALUES (
  '99999999-9999-9999-9999-999999999991',
  'single_material',
  '22222222-2222-2222-2222-222222222223',
  'payment',
  'active'
);

-- Grant revoked entitlement for Topic 3 to Student 2
INSERT INTO public.material_entitlements (
  user_id, entitlement_scope, material_id, source, status
) VALUES (
  '99999999-9999-9999-9999-999999999992',
  'single_material',
  '22222222-2222-2222-2222-222222222223',
  'payment',
  'revoked'
);

-- Grant active subject bundle entitlement for NDA Maths to Student 3
INSERT INTO auth.users (id, email) VALUES
  ('99999999-9999-9999-9999-999999999993', 'student3@example.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.material_entitlements (
  user_id, entitlement_scope, course_slug, subject_slug, source, status
) VALUES (
  '99999999-9999-9999-9999-999999999993',
  'subject_bundle',
  'nda',
  'maths',
  'payment',
  'active'
);

-- Create approved current PDF version and publish Topic 3 for access testing
INSERT INTO public.study_material_versions (
  material_id, version_number, storage_path, original_filename,
  mime_type, file_size_bytes, checksum_sha256, is_current, approval_status
) VALUES (
  '22222222-2222-2222-2222-222222222223',
  1,
  'materials/nda/maths/t3/v1/t3.pdf',
  't3.pdf',
  'application/pdf',
  10240,
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  true,
  'approved'
);

UPDATE public.study_materials
SET review_status = 'approved', status = 'published'
WHERE id = '22222222-2222-2222-2222-222222222223';

-- Invariant 6: Active entitlement grants access
SELECT is(
  public.has_material_access('99999999-9999-9999-9999-999999999991', '22222222-2222-2222-2222-222222222223'),
  true,
  'active single-material entitlement grants access to Student 1'
);

-- Invariant 6: Revoked entitlement NEVER grants access
SELECT is(
  public.has_material_access('99999999-9999-9999-9999-999999999992', '22222222-2222-2222-2222-222222222223'),
  false,
  'revoked entitlement NEVER grants access to Student 2'
);

-- Invariant 6: Subject bundle entitlement grants access to all materials in that subject
SELECT is(
  public.has_material_access('99999999-9999-9999-9999-999999999993', '22222222-2222-2222-2222-222222222223'),
  true,
  'active subject-bundle entitlement grants access to Student 3 for Topic 3'
);

-- Invariant 5: Cannot reassign version to another material
SELECT throws_ok(
  $$ UPDATE public.study_material_versions
     SET material_id = '22222222-2222-2222-2222-222222222221'
     WHERE material_id = '22222222-2222-2222-2222-222222222223' $$,
  NULL,
  'reassigning version to another material is rejected'
);

-- Invariant 4: Cannot delete current approved version of published material
SELECT throws_ok(
  $$ DELETE FROM public.study_material_versions
     WHERE material_id = '22222222-2222-2222-2222-222222222223' $$,
  NULL,
  'deleting current approved version of published material is rejected'
);

-- ------------------------------------------------------------------------------
-- 8. Storage Privacy Verification
-- ------------------------------------------------------------------------------
SELECT is(
  (SELECT public FROM storage.buckets WHERE id = 'study-materials'),
  false,
  'storage bucket study-materials is strictly private'
);

-- ------------------------------------------------------------------------------
-- 9. Milestone 1B.1 Security Hardening: Version Demotion & Approval Downgrades
-- ------------------------------------------------------------------------------
-- Test 36: Cannot demote is_current on the only approved current version of published material
SELECT throws_ok(
  $$ UPDATE public.study_material_versions
     SET is_current = false
     WHERE material_id = '22222222-2222-2222-2222-222222222223'
       AND is_current = true $$,
  NULL,
  'demoting is_current on current approved version of published material is rejected'
);

-- Test 37: Cannot downgrade approval_status on current version of published material
SELECT throws_ok(
  $$ UPDATE public.study_material_versions
     SET approval_status = 'draft'
     WHERE material_id = '22222222-2222-2222-2222-222222222223'
       AND is_current = true $$,
  NULL,
  'downgrading approval_status on current version of published material is rejected'
);

-- Test 38: Cannot inject unapproved version directly as current on published material
SELECT throws_ok(
  $$ INSERT INTO public.study_material_versions (
       material_id, version_number, storage_path, original_filename,
       mime_type, file_size_bytes, checksum_sha256, is_current, approval_status
     ) VALUES (
       '22222222-2222-2222-2222-222222222223',
       2,
       'materials/nda/maths/t3/v2/unapproved.pdf',
       'unapproved.pdf',
       'application/pdf',
       10240,
       'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
       true,
       'draft'
     ) $$,
  NULL,
  'inserting an unapproved version as current on published material is rejected'
);

-- ------------------------------------------------------------------------------
-- 10. Direct Storage RLS Lockdown Tests
-- ------------------------------------------------------------------------------
-- Insert test object as superuser
INSERT INTO storage.objects (
  id, bucket_id, name, owner, created_at, updated_at
) VALUES (
  '88888888-8888-8888-8888-888888888888',
  'study-materials',
  'materials/nda/maths/t3/v1/t3.pdf',
  '99999999-9999-9999-9999-999999999991',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Test 39 & 40: Anonymous client direct access lockdown
SET LOCAL ROLE anon;
SELECT is_empty(
  $$ SELECT name FROM storage.objects WHERE bucket_id = 'study-materials' $$,
  'anonymous clients cannot read objects in private study-materials bucket via storage RLS'
);

SELECT throws_ok(
  $$ INSERT INTO storage.objects (id, bucket_id, name) VALUES (gen_random_uuid(), 'study-materials', 'malicious_anon.pdf') $$,
  '42501',
  NULL,
  'anonymous clients cannot insert objects into study-materials bucket via storage RLS'
);
RESET ROLE;

-- Test 41 & 42: Authenticated client direct access lockdown
SET LOCAL ROLE authenticated;
SELECT is_empty(
  $$ SELECT name FROM storage.objects WHERE bucket_id = 'study-materials' $$,
  'authenticated clients cannot directly read objects in study-materials bucket via storage RLS'
);

SELECT throws_ok(
  $$ INSERT INTO storage.objects (id, bucket_id, name) VALUES (gen_random_uuid(), 'study-materials', 'malicious_auth.pdf') $$,
  '42501',
  NULL,
  'authenticated clients cannot insert objects into study-materials bucket via storage RLS'
);
RESET ROLE;

-- ------------------------------------------------------------------------------
-- 11. Payment Finalization & Entitlement Functions (Milestone 1B.4)
-- ------------------------------------------------------------------------------
SELECT has_function(
  'public', 'finalize_payment_and_grant_entitlement',
  ARRAY['uuid', 'text', 'text', 'integer', 'text'],
  'atomic payment finalization function exists'
);

SELECT has_function(
  'public', 'record_failed_payment_attempt',
  ARRAY['uuid', 'text', 'text'],
  'record_failed_payment_attempt function exists'
);

SELECT has_function(
  'public', 'get_or_create_bundle_product',
  ARRAY['text', 'text', 'text'],
  'get_or_create_bundle_product function exists'
);

SELECT ok(
  NOT has_function_privilege('anon', 'public.finalize_payment_and_grant_entitlement(uuid, text, text, integer, text)', 'EXECUTE'),
  'anonymous clients cannot execute finalize_payment_and_grant_entitlement'
);

SELECT ok(
  NOT has_function_privilege('authenticated', 'public.finalize_payment_and_grant_entitlement(uuid, text, text, integer, text)', 'EXECUTE'),
  'authenticated students cannot execute finalize_payment_and_grant_entitlement'
);

SELECT ok(
  NOT has_function_privilege('anon', 'public.record_failed_payment_attempt(uuid, text, text)', 'EXECUTE'),
  'anonymous clients cannot execute record_failed_payment_attempt'
);

SELECT ok(
  NOT has_function_privilege('authenticated', 'public.record_failed_payment_attempt(uuid, text, text)', 'EXECUTE'),
  'authenticated students cannot execute record_failed_payment_attempt'
);

SELECT ok(
  NOT has_function_privilege('anon', 'public.get_or_create_bundle_product(text, text, text)', 'EXECUTE'),
  'anonymous clients cannot execute get_or_create_bundle_product'
);

SELECT ok(
  NOT has_function_privilege('authenticated', 'public.get_or_create_bundle_product(text, text, text)', 'EXECUTE'),
  'authenticated students cannot execute get_or_create_bundle_product'
);

-- ------------------------------------------------------------------------------
-- 12. Milestone 1B.5: Legacy Purchase Compatibility & Portal Security
-- ------------------------------------------------------------------------------
SELECT has_trigger(
  'public', 'user_material_purchases', 'user_material_purchases_sync_entitlement',
  'user_material_purchases has automated sync trigger to material_entitlements'
);

-- Test 53: Inserting legacy purchase automatically syncs active entitlement
INSERT INTO public.user_material_purchases (
  user_id, material_id, amount_paid
) VALUES (
  '99999999-9999-9999-9999-999999999992',
  '22222222-2222-2222-2222-222222222223',
  0
) ON CONFLICT (user_id, material_id) DO NOTHING;

SELECT is(
  (SELECT status FROM public.material_entitlements
   WHERE user_id = '99999999-9999-9999-9999-999999999992'
     AND material_id = '22222222-2222-2222-2222-222222222223'
     AND source = 'legacy_migration'),
  'active',
  'legacy user_material_purchases insertion automatically creates active entitlement with source legacy_migration'
);

-- Test 54: has_material_access returns true for legacy purchase
SELECT is(
  public.has_material_access(
    '99999999-9999-9999-9999-999999999992',
    '22222222-2222-2222-2222-222222222223'
  ),
  true,
  'has_material_access returns true for user with legacy purchase'
);

-- Test 55: Anonymous client cannot read orders via RLS
SET LOCAL ROLE anon;
SELECT is_empty(
  $$ SELECT id FROM public.orders $$,
  'anonymous clients cannot read orders via RLS'
);
RESET ROLE;

SELECT * FROM finish();
ROLLBACK;
