-- Fix infinite recursion in user_roles policies by creating a security definer function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create service_provider_profiles table with correct structure
CREATE TABLE IF NOT EXISTS public.service_provider_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  business_name TEXT NOT NULL,
  provider_type TEXT NOT NULL,
  location_address TEXT NOT NULL,
  hourly_rate_min NUMERIC NOT NULL DEFAULT 0,
  hourly_rate_max NUMERIC NOT NULL DEFAULT 1000,
  rating NUMERIC DEFAULT 0,
  verification_status TEXT DEFAULT 'pending',
  is_active BOOLEAN DEFAULT true,
  phone TEXT,
  email TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on service_provider_profiles
ALTER TABLE public.service_provider_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for service_provider_profiles
CREATE POLICY "Public can view active service providers" 
ON public.service_provider_profiles 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can manage their own service profile" 
ON public.service_provider_profiles 
FOR ALL 
USING (auth.uid() = user_id);

-- Insert sample service providers
INSERT INTO public.service_provider_profiles (
  user_id, business_name, provider_type, location_address, 
  hourly_rate_min, hourly_rate_max, rating, verification_status, 
  phone, email, description
) VALUES 
(gen_random_uuid(), 'QuickFix Repairs', 'Home Maintenance', 'Nairobi, Kenya', 500, 1500, 4.8, 'verified', '+254123456789', 'info@quickfix.co.ke', 'Professional home repair and maintenance services'),
(gen_random_uuid(), 'CleanPro Services', 'Cleaning', 'Nairobi, Kenya', 300, 800, 4.5, 'verified', '+254123456790', 'contact@cleanpro.co.ke', 'Residential and commercial cleaning services'),
(gen_random_uuid(), 'GreenThumb Gardens', 'Gardening', 'Nairobi, Kenya', 400, 1200, 4.7, 'verified', '+254123456791', 'hello@greenthumb.co.ke', 'Landscaping and garden maintenance services'),
(gen_random_uuid(), 'TechSupport Kenya', 'IT Support', 'Nairobi, Kenya', 800, 2000, 4.9, 'verified', '+254123456792', 'support@techke.co.ke', 'Computer repair and IT support services'),
(gen_random_uuid(), 'SafeGuard Security', 'Security', 'Nairobi, Kenya', 600, 1800, 4.6, 'verified', '+254123456793', 'info@safeguard.co.ke', 'Personal and property security services');

-- Create chat-related tables for Sokko chats
CREATE TABLE IF NOT EXISTS public.sokko_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  provider_id UUID,
  service_type TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on sokko_chats
ALTER TABLE public.sokko_chats ENABLE ROW LEVEL SECURITY;

-- Create policies for sokko_chats
CREATE POLICY "Users can view their own chats" 
ON public.sokko_chats 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = provider_id);

CREATE POLICY "Users can create chats" 
ON public.sokko_chats 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Insert sample drivers
INSERT INTO public.drivers (
  user_id, phone_number, license_number, license_plate, 
  vehicle_make, vehicle_model, vehicle_year, vehicle_type,
  is_verified, is_active, status, rating, current_location
) VALUES 
(gen_random_uuid(), '+254701234567', 'DL001234', 'KBZ 123A', 'Toyota', 'Vitz', 2018, 'taxi', true, true, 'available', 4.8, ST_GeogFromText('POINT(36.8219 -1.2921)')),
(gen_random_uuid(), '+254701234568', 'DL001235', 'KCA 456B', 'Nissan', 'Note', 2019, 'taxi', true, true, 'available', 4.5, ST_GeogFromText('POINT(36.8319 -1.2821)')),
(gen_random_uuid(), '+254701234569', 'DL001236', 'KDA 789C', 'Honda', 'Fit', 2020, 'taxi', true, true, 'available', 4.7, ST_GeogFromText('POINT(36.8119 -1.3021)')),
(gen_random_uuid(), '+254701234570', 'DL001237', 'KBX 012D', 'Toyota', 'Probox', 2017, 'delivery', true, true, 'available', 4.6, ST_GeogFromText('POINT(36.8419 -1.2721)')),
(gen_random_uuid(), '+254701234571', 'DL001238', 'KCY 345E', 'Isuzu', 'D-Max', 2021, 'truck', true, true, 'available', 4.9, ST_GeogFromText('POINT(36.8019 -1.3121)'));

-- Add admin role to the specified email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::user_role 
FROM public.profiles 
WHERE email = 'gmaina424@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;