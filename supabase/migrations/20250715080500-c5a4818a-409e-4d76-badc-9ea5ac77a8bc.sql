-- Fix infinite recursion in user_roles policies by creating a security definer function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop existing service_provider_profiles table if it exists (to recreate properly)
DROP TABLE IF EXISTS public.service_provider_profiles CASCADE;

-- Create service_provider_profiles table with correct structure
CREATE TABLE public.service_provider_profiles (
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