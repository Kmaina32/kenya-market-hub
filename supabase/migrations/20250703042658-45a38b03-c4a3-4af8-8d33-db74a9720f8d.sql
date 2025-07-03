-- Create driver_applications table
CREATE TABLE public.driver_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  license_number text NOT NULL,
  license_plate text NOT NULL,
  vehicle_make text,
  vehicle_model text,
  vehicle_year integer,
  vehicle_type vehicle_type NOT NULL,
  documents jsonb DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid,
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.driver_applications ENABLE ROW LEVEL SECURITY;

-- Policies for driver applications
CREATE POLICY "Users can create their own driver applications" 
ON public.driver_applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own driver applications" 
ON public.driver_applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all driver applications" 
ON public.driver_applications 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Create functions to approve/reject driver applications
CREATE OR REPLACE FUNCTION public.approve_driver_application(p_application_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  app_record public.driver_applications%ROWTYPE;
  new_driver_id UUID;
BEGIN
  -- Get the application record
  SELECT * INTO app_record
  FROM public.driver_applications
  WHERE id = p_application_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pending application not found for ID: %', p_application_id;
  END IF;

  -- Create a new record in drivers
  INSERT INTO public.drivers (
    user_id,
    phone_number,
    license_number,
    license_plate,
    vehicle_make,
    vehicle_model,
    vehicle_year,
    vehicle_type,
    documents,
    is_verified,
    is_active
  ) VALUES (
    app_record.user_id,
    app_record.phone,
    app_record.license_number,
    app_record.license_plate,
    app_record.vehicle_make,
    app_record.vehicle_model,
    app_record.vehicle_year,
    app_record.vehicle_type,
    app_record.documents,
    true,
    true
  ) RETURNING id INTO new_driver_id;

  -- Update the application status
  UPDATE public.driver_applications
  SET
    status = 'approved',
    reviewed_at = now(),
    reviewed_by = auth.uid()
  WHERE id = p_application_id;

  RETURN new_driver_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_driver_application(p_application_id uuid, p_admin_notes text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.driver_applications
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