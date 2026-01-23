-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'admin');

-- Create classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  class_id UUID REFERENCES public.classes(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  UNIQUE (user_id, role)
);

-- Create study_materials table
CREATE TABLE public.study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  material_type TEXT NOT NULL CHECK (material_type IN ('pdf', 'video')),
  subject TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create scholarship_tests table
CREATE TABLE public.scholarship_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  test_type TEXT NOT NULL CHECK (test_type IN ('online', 'offline')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  test_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create test_questions table for MCQ
CREATE TABLE public.test_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES public.scholarship_tests(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create test_options table
CREATE TABLE public.test_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES public.test_questions(id) ON DELETE CASCADE NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  option_order INTEGER NOT NULL DEFAULT 0
);

-- Create test_registrations table
CREATE TABLE public.test_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  test_id UUID REFERENCES public.scholarship_tests(id) ON DELETE CASCADE NOT NULL,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, test_id)
);

-- Create test_attempts table
CREATE TABLE public.test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  test_id UUID REFERENCES public.scholarship_tests(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_time TIMESTAMPTZ,
  score INTEGER,
  total_questions INTEGER,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create test_answers table
CREATE TABLE public.test_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES public.test_attempts(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.test_questions(id) ON DELETE CASCADE NOT NULL,
  selected_option_id UUID REFERENCES public.test_options(id),
  answered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (attempt_id, question_id)
);

-- Enable RLS on all tables
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_answers ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if user has a role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Security definer function to check if student is enrolled in a class
CREATE OR REPLACE FUNCTION public.is_enrolled_in_class(_user_id UUID, _class_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND class_id = _class_id
  )
$$;

-- Security definer function to get student's class_id
CREATE OR REPLACE FUNCTION public.get_student_class_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT class_id FROM public.profiles WHERE id = _user_id
$$;

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Timestamp triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_study_materials_updated_at
  BEFORE UPDATE ON public.study_materials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for classes (everyone can view)
CREATE POLICY "Anyone can view classes" ON public.classes
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage classes" ON public.classes
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles (read-only for users)
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for study_materials
CREATE POLICY "Students can view materials for their class" ON public.study_materials
  FOR SELECT USING (
    class_id = public.get_student_class_id(auth.uid()) OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can manage materials" ON public.study_materials
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for scholarship_tests
CREATE POLICY "Students can view active tests for their class" ON public.scholarship_tests
  FOR SELECT USING (
    (class_id = public.get_student_class_id(auth.uid()) AND is_active = true) OR
    class_id IS NULL OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can manage tests" ON public.scholarship_tests
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for test_questions
CREATE POLICY "Students can view questions for registered tests" ON public.test_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.test_registrations tr
      WHERE tr.test_id = test_questions.test_id AND tr.student_id = auth.uid()
    ) OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can manage questions" ON public.test_questions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for test_options
CREATE POLICY "Students can view options for registered tests" ON public.test_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.test_questions tq
      JOIN public.test_registrations tr ON tr.test_id = tq.test_id
      WHERE tq.id = test_options.question_id AND tr.student_id = auth.uid()
    ) OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can manage options" ON public.test_options
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for test_registrations
CREATE POLICY "Students can view own registrations" ON public.test_registrations
  FOR SELECT USING (student_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can register for tests" ON public.test_registrations
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins can manage registrations" ON public.test_registrations
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for test_attempts
CREATE POLICY "Students can view own attempts" ON public.test_attempts
  FOR SELECT USING (student_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can create attempts" ON public.test_attempts
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own incomplete attempts" ON public.test_attempts
  FOR UPDATE USING (student_id = auth.uid() AND completed_at IS NULL);

CREATE POLICY "Admins can manage attempts" ON public.test_attempts
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for test_answers
CREATE POLICY "Students can view own answers" ON public.test_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.test_attempts ta
      WHERE ta.id = test_answers.attempt_id AND ta.student_id = auth.uid()
    ) OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Students can submit answers" ON public.test_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.test_attempts ta
      WHERE ta.id = test_answers.attempt_id 
      AND ta.student_id = auth.uid() 
      AND ta.completed_at IS NULL
    )
  );

CREATE POLICY "Students can update own answers during test" ON public.test_answers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.test_attempts ta
      WHERE ta.id = test_answers.attempt_id 
      AND ta.student_id = auth.uid() 
      AND ta.completed_at IS NULL
    )
  );

CREATE POLICY "Admins can manage answers" ON public.test_answers
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Insert default classes
INSERT INTO public.classes (name, description) VALUES
  ('Class 6', 'Foundation batch for 6th standard students'),
  ('Class 7', 'Foundation batch for 7th standard students'),
  ('Class 8', 'Foundation batch for 8th standard students'),
  ('Class 9', 'Concept clarity classes for 9th standard'),
  ('Class 10', 'Board preparation for 10th standard'),
  ('Class 11', 'Scholar batch for 11th standard'),
  ('Class 12', 'Board and competitive exam prep for 12th standard'),
  ('IIT-JEE', 'JEE Mains & Advanced preparation'),
  ('NEET', 'Medical entrance preparation'),
  ('NDA', 'National Defence Academy preparation'),
  ('CUET', 'Common University Entrance Test preparation');