-- Add pricing fields to study_materials
ALTER TABLE public.study_materials 
ADD COLUMN price DECIMAL(10,2) DEFAULT 0,
ADD COLUMN is_free BOOLEAN DEFAULT false;

-- Create material_coupons table for discount codes
CREATE TABLE public.material_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  material_id UUID REFERENCES public.study_materials(id) ON DELETE CASCADE,
  discount_percent INTEGER DEFAULT 100, -- 100 = free
  max_uses INTEGER DEFAULT NULL, -- NULL = unlimited
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_material_purchases to track access
CREATE TABLE public.user_material_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  material_id UUID REFERENCES public.study_materials(id) ON DELETE CASCADE NOT NULL,
  coupon_id UUID REFERENCES public.material_coupons(id) ON DELETE SET NULL,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, material_id)
);

-- Enable RLS
ALTER TABLE public.material_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_material_purchases ENABLE ROW LEVEL SECURITY;

-- RLS policies for material_coupons
CREATE POLICY "Admins can manage coupons" ON public.material_coupons
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can validate active coupons" ON public.material_coupons
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- RLS policies for user_material_purchases
CREATE POLICY "Admins can manage purchases" ON public.user_material_purchases
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own purchases" ON public.user_material_purchases
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own purchases" ON public.user_material_purchases
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Function to redeem a coupon
CREATE OR REPLACE FUNCTION public.redeem_coupon(_code TEXT, _material_id UUID, _user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _coupon material_coupons%ROWTYPE;
  _material study_materials%ROWTYPE;
  _existing_purchase user_material_purchases%ROWTYPE;
  _final_price DECIMAL(10,2);
BEGIN
  -- Check if user already has this material
  SELECT * INTO _existing_purchase
  FROM user_material_purchases
  WHERE user_id = _user_id AND material_id = _material_id;
  
  IF FOUND THEN
    RETURN json_build_object('success', false, 'error', 'You already have access to this material');
  END IF;
  
  -- Get material
  SELECT * INTO _material
  FROM study_materials
  WHERE id = _material_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Material not found');
  END IF;
  
  -- Get and validate coupon
  SELECT * INTO _coupon
  FROM material_coupons
  WHERE code = _code 
    AND is_active = true 
    AND (expires_at IS NULL OR expires_at > now())
    AND (material_id IS NULL OR material_id = _material_id)
    AND (max_uses IS NULL OR used_count < max_uses)
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid or expired coupon code');
  END IF;
  
  -- Calculate final price
  _final_price := _material.price * (100 - _coupon.discount_percent) / 100;
  
  -- Create purchase record
  INSERT INTO user_material_purchases (user_id, material_id, coupon_id, amount_paid)
  VALUES (_user_id, _material_id, _coupon.id, _final_price);
  
  -- Update coupon usage
  UPDATE material_coupons
  SET used_count = used_count + 1
  WHERE id = _coupon.id;
  
  RETURN json_build_object('success', true, 'discount', _coupon.discount_percent, 'amount_paid', _final_price);
END;
$$;

-- Update study_materials RLS to allow viewing all materials (but not content unless purchased)
DROP POLICY IF EXISTS "Students can view materials for their class" ON public.study_materials;

CREATE POLICY "Anyone can view material info" ON public.study_materials
  FOR SELECT USING (true);

-- Insert sample coupons for testing
INSERT INTO public.material_coupons (code, material_id, discount_percent, is_active)
VALUES 
  ('RAYS2024', NULL, 100, true),  -- Universal free coupon
  ('STUDENT50', NULL, 50, true),  -- 50% off any material
  ('FREEMATHS', NULL, 100, true); -- Free for maths

-- Update existing materials to have prices
UPDATE public.study_materials SET price = 299, is_free = false WHERE price IS NULL OR price = 0;