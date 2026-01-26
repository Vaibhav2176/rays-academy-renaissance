-- Create table for student enrollment codes
CREATE TABLE public.enrollment_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  student_name text, -- Optional: pre-assign to specific student
  is_used boolean NOT NULL DEFAULT false,
  used_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.enrollment_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can check if a code is valid (for registration)
CREATE POLICY "Anyone can validate unused codes"
ON public.enrollment_codes
FOR SELECT
USING (is_used = false);

-- Policy: Admins can manage all codes
CREATE POLICY "Admins can manage codes"
ON public.enrollment_codes
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create function to validate and use enrollment code
CREATE OR REPLACE FUNCTION public.use_enrollment_code(
  _code text,
  _user_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _enrollment_record enrollment_codes%ROWTYPE;
BEGIN
  -- Find and lock the code
  SELECT * INTO _enrollment_record
  FROM enrollment_codes
  WHERE code = _code AND is_used = false
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or already used enrollment code';
  END IF;
  
  -- Mark code as used
  UPDATE enrollment_codes
  SET is_used = true, used_by = _user_id, used_at = now()
  WHERE id = _enrollment_record.id;
  
  -- Update user profile with class_id from the code
  UPDATE profiles
  SET class_id = _enrollment_record.class_id
  WHERE id = _user_id;
  
  RETURN _enrollment_record.class_id;
END;
$$;

-- Insert some sample enrollment codes for testing
INSERT INTO public.enrollment_codes (code, class_id, student_name) VALUES
('RAYS-6TH-001', (SELECT id FROM classes WHERE name = 'Class 6'), 'Test Student 1'),
('RAYS-6TH-002', (SELECT id FROM classes WHERE name = 'Class 6'), 'Test Student 2'),
('RAYS-7TH-001', (SELECT id FROM classes WHERE name = 'Class 7'), NULL),
('RAYS-8TH-001', (SELECT id FROM classes WHERE name = 'Class 8'), NULL),
('RAYS-9TH-001', (SELECT id FROM classes WHERE name = 'Class 9'), NULL),
('RAYS-10TH-001', (SELECT id FROM classes WHERE name = 'Class 10'), NULL),
('RAYS-11TH-001', (SELECT id FROM classes WHERE name = 'Class 11'), NULL),
('RAYS-12TH-001', (SELECT id FROM classes WHERE name = 'Class 12'), NULL);