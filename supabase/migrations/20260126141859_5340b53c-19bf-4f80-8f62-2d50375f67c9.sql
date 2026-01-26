-- Create contact inquiries table
CREATE TABLE public.contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  responded_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an inquiry (public form)
CREATE POLICY "Anyone can submit inquiries"
ON public.contact_inquiries
FOR INSERT
WITH CHECK (true);

-- Only admins can view and manage inquiries
CREATE POLICY "Admins can manage inquiries"
ON public.contact_inquiries
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create announcements table
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  priority integer NOT NULL DEFAULT 0,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Anyone can view active announcements
CREATE POLICY "Anyone can view active announcements"
ON public.announcements
FOR SELECT
USING (is_active = true AND (start_date IS NULL OR start_date <= now()) AND (end_date IS NULL OR end_date >= now()));

-- Admins can manage announcements
CREATE POLICY "Admins can manage announcements"
ON public.announcements
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_announcements_updated_at
BEFORE UPDATE ON public.announcements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create gallery images table
CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  image_url text NOT NULL,
  category text NOT NULL DEFAULT 'academy',
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Anyone can view active gallery images
CREATE POLICY "Anyone can view active gallery images"
ON public.gallery_images
FOR SELECT
USING (is_active = true);

-- Admins can manage gallery
CREATE POLICY "Admins can manage gallery"
ON public.gallery_images
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create toppers/results table
CREATE TABLE public.toppers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  exam text NOT NULL,
  rank text NOT NULL,
  score text NOT NULL,
  year integer NOT NULL,
  image_url text,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.toppers ENABLE ROW LEVEL SECURITY;

-- Anyone can view toppers
CREATE POLICY "Anyone can view toppers"
ON public.toppers
FOR SELECT
USING (true);

-- Admins can manage toppers
CREATE POLICY "Admins can manage toppers"
ON public.toppers
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create yearly results summary table
CREATE TABLE public.yearly_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL UNIQUE,
  total_students integer NOT NULL DEFAULT 0,
  above_90_percent integer NOT NULL DEFAULT 0,
  above_95_percent integer NOT NULL DEFAULT 0,
  district_toppers integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.yearly_results ENABLE ROW LEVEL SECURITY;

-- Anyone can view yearly results
CREATE POLICY "Anyone can view yearly results"
ON public.yearly_results
FOR SELECT
USING (true);

-- Admins can manage yearly results
CREATE POLICY "Admins can manage yearly results"
ON public.yearly_results
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Insert sample announcements
INSERT INTO public.announcements (title, content, priority) VALUES
('Admissions Open 2024-25', 'Enroll now for Class 6-12. Limited seats available!', 10),
('Scholarship Test', 'Register for our annual scholarship test. Top performers get up to 100% fee waiver.', 5);

-- Insert sample gallery images
INSERT INTO public.gallery_images (title, image_url, category, display_order) VALUES
('Academy Building', 'https://github.com/Vaibhav2176/Rays-Academy/blob/main/images/academy1.jpg?raw=true', 'academy', 1),
('Classroom', 'https://github.com/Vaibhav2176/Rays-Academy/blob/main/images/academy2.jpg?raw=true', 'academy', 2),
('Library', 'https://github.com/Vaibhav2176/Rays-Academy/blob/main/images/academy3.jpg?raw=true', 'academy', 3),
('Annual Event', 'https://github.com/Vaibhav2176/Rays-Academy/blob/main/images/event1.jpg?raw=true', 'events', 1),
('Prize Distribution', 'https://github.com/Vaibhav2176/Rays-Academy/blob/main/images/event2.jpg?raw=true', 'events', 2),
('Topper Felicitation', 'https://github.com/Vaibhav2176/Rays-Academy/blob/main/images/achievement1.jpg?raw=true', 'achievements', 1);

-- Insert sample toppers
INSERT INTO public.toppers (name, exam, rank, score, year, is_featured, image_url) VALUES
('Aditya Sharma', 'JEE Advanced 2024', 'AIR 156', '98.5%', 2024, true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'),
('Priya Patel', 'NEET 2024', 'AIR 234', '99.2%', 2024, true, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face'),
('Rahul Verma', 'NDA 2024', 'AIR 89', '97.8%', 2024, true, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'),
('Sneha Gupta', 'CBSE 12th 2024', 'City Topper', '99.4%', 2024, true, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face');

-- Insert yearly results
INSERT INTO public.yearly_results (year, total_students, above_90_percent, above_95_percent, district_toppers) VALUES
(2024, 250, 180, 95, 12),
(2023, 230, 165, 82, 10),
(2022, 210, 150, 70, 8),
(2021, 195, 140, 65, 7);