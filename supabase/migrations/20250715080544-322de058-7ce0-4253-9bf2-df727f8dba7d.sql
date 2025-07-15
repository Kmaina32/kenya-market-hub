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
(gen_random_uuid(), 'SafeGuard Security', 'Security', 'Nairobi, Kenya', 600, 1800, 4.6, 'verified', '+254123456793', 'info@safeguard.co.ke', 'Personal and property security services'),
(gen_random_uuid(), 'ElectroFix Pro', 'Electrical', 'Nairobi, Kenya', 700, 2200, 4.8, 'verified', '+254123456794', 'info@electrofix.co.ke', 'Electrical installations and repairs'),
(gen_random_uuid(), 'PlumbMaster', 'Plumbing', 'Nairobi, Kenya', 600, 1800, 4.6, 'verified', '+254123456795', 'contact@plumbmaster.co.ke', 'Professional plumbing services'),
(gen_random_uuid(), 'CarWash Express', 'Car Wash', 'Nairobi, Kenya', 200, 600, 4.4, 'verified', '+254123456796', 'hello@carwash.co.ke', 'Mobile car washing and detailing'),
(gen_random_uuid(), 'PetCare Kenya', 'Pet Care', 'Nairobi, Kenya', 400, 1000, 4.7, 'verified', '+254123456797', 'info@petcare.co.ke', 'Pet grooming and care services'),
(gen_random_uuid(), 'MoveMasters', 'Moving & Logistics', 'Nairobi, Kenya', 800, 2500, 4.5, 'verified', '+254123456798', 'bookings@movemasters.co.ke', 'Professional moving and logistics services');

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
(gen_random_uuid(), '+254701234571', 'DL001238', 'KCY 345E', 'Isuzu', 'D-Max', 2021, 'truck', true, true, 'available', 4.9, ST_GeogFromText('POINT(36.8019 -1.3121)')),
(gen_random_uuid(), '+254701234572', 'DL001239', 'KCZ 678F', 'Toyota', 'Hiace', 2020, 'matatu', true, true, 'available', 4.7, ST_GeogFromText('POINT(36.8519 -1.2621)')),
(gen_random_uuid(), '+254701234573', 'DL001240', 'KDZ 901G', 'Subaru', 'Forester', 2019, 'taxi', true, true, 'available', 4.8, ST_GeogFromText('POINT(36.7919 -1.3221)'));

-- Add admin role to the specified email (if profile exists)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::user_role 
FROM public.profiles 
WHERE email = 'gmaina424@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;