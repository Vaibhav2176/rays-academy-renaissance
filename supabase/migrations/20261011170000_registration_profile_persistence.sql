-- Migration: 20261011170000_registration_profile_persistence.sql
-- Description: Populate full profile fields on signup and provide safe authenticated recovery

-- 1. Update public.handle_new_user() trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_meta JSONB := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  v_class_id UUID := NULL;
  v_class_input TEXT;
  v_dob DATE := NULL;
  v_dob_input TEXT;
  v_full_name TEXT;
  v_phone TEXT;
  v_gender TEXT;
  v_parent_name TEXT;
  v_parent_phone TEXT;
  v_school_name TEXT;
  v_board TEXT;
  v_address TEXT;
  v_city TEXT;
  v_state TEXT;
  v_pincode TEXT;
BEGIN
  -- Extract full_name safely, falling back to 'Student' if missing or blank
  v_full_name := COALESCE(
    NULLIF(TRIM(COALESCE(v_meta->>'full_name', v_meta->>'fullName')), ''),
    'Student'
  );

  -- Extract text fields safely, trimming and mapping empty strings to NULL
  v_phone := NULLIF(TRIM(COALESCE(v_meta->>'phone', v_meta->>'phoneNumber')), '');
  v_gender := NULLIF(TRIM(v_meta->>'gender'), '');
  v_parent_name := NULLIF(TRIM(COALESCE(v_meta->>'parent_name', v_meta->>'parentName')), '');
  v_parent_phone := NULLIF(TRIM(COALESCE(v_meta->>'parent_phone', v_meta->>'parentPhone')), '');
  v_school_name := NULLIF(TRIM(COALESCE(v_meta->>'school_name', v_meta->>'schoolName')), '');
  v_board := COALESCE(NULLIF(TRIM(v_meta->>'board'), ''), 'CBSE');
  v_address := NULLIF(TRIM(v_meta->>'address'), '');
  v_city := NULLIF(TRIM(v_meta->>'city'), '');
  v_state := COALESCE(NULLIF(TRIM(v_meta->>'state'), ''), 'Madhya Pradesh');
  v_pincode := NULLIF(TRIM(v_meta->>'pincode'), '');

  -- Safely extract and validate class_id
  v_class_input := NULLIF(TRIM(COALESCE(v_meta->>'class_id', v_meta->>'classId')), '');
  IF v_class_input IS NOT NULL THEN
    BEGIN
      IF pg_input_is_valid(v_class_input, 'uuid') THEN
        IF EXISTS (SELECT 1 FROM public.classes WHERE id = v_class_input::uuid) THEN
          v_class_id := v_class_input::uuid;
        END IF;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      v_class_id := NULL;
    END;
  END IF;

  -- Safely extract and validate date_of_birth
  v_dob_input := NULLIF(TRIM(COALESCE(v_meta->>'date_of_birth', v_meta->>'dateOfBirth')), '');
  IF v_dob_input IS NOT NULL THEN
    BEGIN
      IF pg_input_is_valid(v_dob_input, 'date') THEN
        v_dob := v_dob_input::date;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      v_dob := NULL;
    END;
  END IF;

  -- Insert profile row with full registration data
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    phone,
    class_id,
    date_of_birth,
    gender,
    parent_name,
    parent_phone,
    school_name,
    board,
    address,
    city,
    state,
    pincode
  ) VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    v_full_name,
    v_phone,
    v_class_id,
    v_dob,
    v_gender,
    v_parent_name,
    v_parent_phone,
    v_school_name,
    v_board,
    v_address,
    v_city,
    v_state,
    v_pincode
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    class_id = COALESCE(EXCLUDED.class_id, public.profiles.class_id),
    date_of_birth = COALESCE(EXCLUDED.date_of_birth, public.profiles.date_of_birth),
    gender = COALESCE(EXCLUDED.gender, public.profiles.gender),
    parent_name = COALESCE(EXCLUDED.parent_name, public.profiles.parent_name),
    parent_phone = COALESCE(EXCLUDED.parent_phone, public.profiles.parent_phone),
    school_name = COALESCE(EXCLUDED.school_name, public.profiles.school_name),
    board = COALESCE(EXCLUDED.board, public.profiles.board),
    address = COALESCE(EXCLUDED.address, public.profiles.address),
    city = COALESCE(EXCLUDED.city, public.profiles.city),
    state = COALESCE(EXCLUDED.state, public.profiles.state),
    pincode = COALESCE(EXCLUDED.pincode, public.profiles.pincode),
    updated_at = now();

  -- Assign default student role (never trust metadata for role assignment)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Ensure trigger is active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Authenticated recovery RPC function for missing profiles
CREATE OR REPLACE FUNCTION public.ensure_profile()
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_user RECORD;
  v_profile public.profiles;
  v_meta JSONB;
  v_class_id UUID := NULL;
  v_class_input TEXT;
  v_dob DATE := NULL;
  v_dob_input TEXT;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Return existing profile if already present
  SELECT * INTO v_profile FROM public.profiles WHERE id = v_user_id;
  IF FOUND THEN
    RETURN v_profile;
  END IF;

  -- Fetch user record from auth.users
  SELECT id, email, raw_user_meta_data INTO v_user
  FROM auth.users
  WHERE id = v_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  v_meta := COALESCE(v_user.raw_user_meta_data, '{}'::jsonb);

  -- Safely extract and validate class_id
  v_class_input := NULLIF(TRIM(COALESCE(v_meta->>'class_id', v_meta->>'classId')), '');
  IF v_class_input IS NOT NULL THEN
    BEGIN
      IF pg_input_is_valid(v_class_input, 'uuid') THEN
        IF EXISTS (SELECT 1 FROM public.classes WHERE id = v_class_input::uuid) THEN
          v_class_id := v_class_input::uuid;
        END IF;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      v_class_id := NULL;
    END;
  END IF;

  -- Safely extract and validate date_of_birth
  v_dob_input := NULLIF(TRIM(COALESCE(v_meta->>'date_of_birth', v_meta->>'dateOfBirth')), '');
  IF v_dob_input IS NOT NULL THEN
    BEGIN
      IF pg_input_is_valid(v_dob_input, 'date') THEN
        v_dob := v_dob_input::date;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      v_dob := NULL;
    END;
  END IF;

  -- Insert profile row from auth user metadata
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    phone,
    class_id,
    date_of_birth,
    gender,
    parent_name,
    parent_phone,
    school_name,
    board,
    address,
    city,
    state,
    pincode
  ) VALUES (
    v_user.id,
    COALESCE(v_user.email, ''),
    COALESCE(NULLIF(TRIM(COALESCE(v_meta->>'full_name', v_meta->>'fullName')), ''), 'Student'),
    NULLIF(TRIM(COALESCE(v_meta->>'phone', v_meta->>'phoneNumber')), ''),
    v_class_id,
    v_dob,
    NULLIF(TRIM(v_meta->>'gender'), ''),
    NULLIF(TRIM(COALESCE(v_meta->>'parent_name', v_meta->>'parentName')), ''),
    NULLIF(TRIM(COALESCE(v_meta->>'parent_phone', v_meta->>'parentPhone')), ''),
    NULLIF(TRIM(COALESCE(v_meta->>'school_name', v_meta->>'schoolName')), ''),
    COALESCE(NULLIF(TRIM(v_meta->>'board'), ''), 'CBSE'),
    NULLIF(TRIM(v_meta->>'address'), ''),
    NULLIF(TRIM(v_meta->>'city'), ''),
    COALESCE(NULLIF(TRIM(v_meta->>'state'), ''), 'Madhya Pradesh'),
    NULLIF(TRIM(v_meta->>'pincode'), '')
  )
  ON CONFLICT (id) DO UPDATE SET
    updated_at = now()
  RETURNING * INTO v_profile;

  -- Ensure student role exists
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user.id, 'student')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN v_profile;
END;
$$;

-- Grant execution to authenticated users only
GRANT EXECUTE ON FUNCTION public.ensure_profile() TO authenticated;

-- 3. Idempotently backfill existing auth users who have no profile row
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  phone,
  class_id,
  date_of_birth,
  gender,
  parent_name,
  parent_phone,
  school_name,
  board,
  address,
  city,
  state,
  pincode
)
SELECT
  u.id,
  COALESCE(u.email, ''),
  COALESCE(NULLIF(TRIM(COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'fullName')), ''), 'Student'),
  NULLIF(TRIM(COALESCE(u.raw_user_meta_data->>'phone', u.raw_user_meta_data->>'phoneNumber')), ''),
  CASE
    WHEN u.raw_user_meta_data->>'class_id' IS NOT NULL 
         AND pg_input_is_valid(u.raw_user_meta_data->>'class_id', 'uuid')
         AND EXISTS (SELECT 1 FROM public.classes c WHERE c.id = (u.raw_user_meta_data->>'class_id')::uuid)
    THEN (u.raw_user_meta_data->>'class_id')::uuid
    ELSE NULL
  END,
  CASE
    WHEN u.raw_user_meta_data->>'date_of_birth' IS NOT NULL 
         AND pg_input_is_valid(u.raw_user_meta_data->>'date_of_birth', 'date')
    THEN (u.raw_user_meta_data->>'date_of_birth')::date
    ELSE NULL
  END,
  NULLIF(TRIM(u.raw_user_meta_data->>'gender'), ''),
  NULLIF(TRIM(COALESCE(u.raw_user_meta_data->>'parent_name', u.raw_user_meta_data->>'parentName')), ''),
  NULLIF(TRIM(COALESCE(u.raw_user_meta_data->>'parent_phone', u.raw_user_meta_data->>'parentPhone')), ''),
  NULLIF(TRIM(COALESCE(u.raw_user_meta_data->>'school_name', u.raw_user_meta_data->>'schoolName')), ''),
  COALESCE(NULLIF(TRIM(u.raw_user_meta_data->>'board'), ''), 'CBSE'),
  NULLIF(TRIM(u.raw_user_meta_data->>'address'), ''),
  NULLIF(TRIM(u.raw_user_meta_data->>'city'), ''),
  COALESCE(NULLIF(TRIM(u.raw_user_meta_data->>'state'), ''), 'Madhya Pradesh'),
  NULLIF(TRIM(u.raw_user_meta_data->>'pincode'), '')
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- 4. Idempotently backfill any auth users who have no role
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'student'::public.app_role
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles r WHERE r.user_id = u.id
)
ON CONFLICT (user_id, role) DO NOTHING;

