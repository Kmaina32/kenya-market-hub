
-- Create missing service_provider_applications table to standardize the system
CREATE TABLE IF NOT EXISTS public.service_provider_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_description TEXT NOT NULL,
  business_address TEXT NOT NULL,
  business_phone TEXT NOT NULL,
  business_email TEXT NOT NULL,
  license_number TEXT,
  experience_years INTEGER,
  service_areas TEXT[],
  documents JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on service_provider_applications
ALTER TABLE public.service_provider_applications ENABLE ROW LEVEL SECURITY;

-- RLS policies for service_provider_applications
CREATE POLICY "Users can create their own service provider applications" 
  ON public.service_provider_applications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own service provider applications" 
  ON public.service_provider_applications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all service provider applications" 
  ON public.service_provider_applications 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "Admins can update service provider applications" 
  ON public.service_provider_applications 
  FOR UPDATE 
  USING (has_role(auth.uid(), 'admin'::user_role));

-- Create approve_service_provider_application function
CREATE OR REPLACE FUNCTION public.approve_service_provider_application(p_application_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  app_record public.service_provider_applications%ROWTYPE;
  new_provider_id UUID;
BEGIN
  -- Get the application record
  SELECT * INTO app_record
  FROM public.service_provider_applications
  WHERE id = p_application_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pending application not found for ID: %', p_application_id;
  END IF;

  -- Create a new record in service_provider_profiles
  INSERT INTO public.service_provider_profiles (
    user_id,
    provider_type,
    business_name,
    business_description,
    business_address,
    business_phone,
    business_email,
    license_number,
    experience_years,
    service_areas,
    verification_status,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    app_record.user_id,
    app_record.service_type,
    app_record.business_name,
    app_record.business_description,
    app_record.business_address,
    app_record.business_phone,
    app_record.business_email,
    app_record.license_number,
    app_record.experience_years,
    app_record.service_areas,
    'approved',
    true,
    now(),
    now()
  ) RETURNING id INTO new_provider_id;

  -- Update the application status
  UPDATE public.service_provider_applications
  SET
    status = 'approved',
    reviewed_at = now(),
    reviewed_by = auth.uid()
  WHERE id = p_application_id;

  RETURN new_provider_id;
END;
$$;

-- Create reject_service_provider_application function
CREATE OR REPLACE FUNCTION public.reject_service_provider_application(p_application_id UUID, p_admin_notes TEXT DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.service_provider_applications
  SET
    status = 'rejected',
    reviewed_at = now(),
    reviewed_by = auth.uid(),
    admin_notes = p_admin_notes
  WHERE id = p_application_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pending application not found for ID: %', p_application_id;
  END IF;
END;
$$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_provider_applications_user_id ON public.service_provider_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_service_provider_applications_status ON public.service_provider_applications(status);
CREATE INDEX IF NOT EXISTS idx_service_provider_applications_service_type ON public.service_provider_applications(service_type);

-- Standardize status values across all application tables (add constraints if missing)
DO $$ 
BEGIN
  -- Check if constraint exists for vendor_applications
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'vendor_applications_status_check'
  ) THEN
    ALTER TABLE public.vendor_applications 
    ADD CONSTRAINT vendor_applications_status_check 
    CHECK (status IN ('pending', 'approved', 'rejected', 'suspended'));
  END IF;

  -- Check if constraint exists for driver_applications
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'driver_applications_status_check'
  ) THEN
    ALTER TABLE public.driver_applications 
    ADD CONSTRAINT driver_applications_status_check 
    CHECK (status IN ('pending', 'approved', 'rejected', 'suspended'));
  END IF;

  -- Check if constraint exists for medical_provider_applications
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'medical_provider_applications_status_check'
  ) THEN
    ALTER TABLE public.medical_provider_applications 
    ADD CONSTRAINT medical_provider_applications_status_check 
    CHECK (status IN ('pending', 'approved', 'rejected', 'suspended'));
  END IF;
END $$;

-- Update trigger for service_provider_applications
CREATE TRIGGER update_service_provider_applications_updated_at
  BEFORE UPDATE ON public.service_provider_applications
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
