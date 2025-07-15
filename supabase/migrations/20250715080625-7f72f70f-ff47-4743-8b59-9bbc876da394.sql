-- Insert sample service providers (already done above, but let's ensure they exist)
-- This step was successful in the previous migration

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

-- Insert sample drivers (without current_location to avoid type issues)
INSERT INTO public.drivers (
  user_id, phone_number, license_number, license_plate, 
  vehicle_make, vehicle_model, vehicle_year, vehicle_type,
  is_verified, is_active, status, rating
) VALUES 
(gen_random_uuid(), '+254701234567', 'DL001234', 'KBZ 123A', 'Toyota', 'Vitz', 2018, 'taxi', true, true, 'available', 4.8),
(gen_random_uuid(), '+254701234568', 'DL001235', 'KCA 456B', 'Nissan', 'Note', 2019, 'taxi', true, true, 'available', 4.5),
(gen_random_uuid(), '+254701234569', 'DL001236', 'KDA 789C', 'Honda', 'Fit', 2020, 'taxi', true, true, 'available', 4.7),
(gen_random_uuid(), '+254701234570', 'DL001237', 'KBX 012D', 'Toyota', 'Probox', 2017, 'delivery', true, true, 'available', 4.6),
(gen_random_uuid(), '+254701234571', 'DL001238', 'KCY 345E', 'Isuzu', 'D-Max', 2021, 'truck', true, true, 'available', 4.9),
(gen_random_uuid(), '+254701234572', 'DL001239', 'KCZ 678F', 'Toyota', 'Hiace', 2020, 'matatu', true, true, 'available', 4.7),
(gen_random_uuid(), '+254701234573', 'DL001240', 'KDZ 901G', 'Subaru', 'Forester', 2019, 'taxi', true, true, 'available', 4.8);

-- Add admin role to the specified email (if profile exists)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::user_role 
FROM public.profiles 
WHERE email = 'gmaina424@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;