-- 1) Fix signup 500 by ensuring new users get role = 'user' (not 'customer')
-- Update the new-user handler to insert 'user' into public.user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Ensure a default role is set for every new auth user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Optional cleanup: backfill any legacy 'customer' roles to 'user'
UPDATE public.user_roles SET role = 'user' WHERE role = 'customer';

-- 2) Create service provider application system

-- Utility function for updated_at maintenance (idempotent)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Table: service_provider_applications
CREATE TABLE IF NOT EXISTS public.service_provider_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_description TEXT,
  business_address TEXT,
  business_phone TEXT NOT NULL,
  business_email TEXT NOT NULL,
  license_number TEXT,
  experience_years INTEGER,
  specialization TEXT,
  service_areas TEXT[],
  documents JSONB,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  admin_notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger to keep updated_at fresh
DROP TRIGGER IF EXISTS trg_spa_updated_at ON public.service_provider_applications;
CREATE TRIGGER trg_spa_updated_at
BEFORE UPDATE ON public.service_provider_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS policies for service_provider_applications
ALTER TABLE public.service_provider_applications ENABLE ROW LEVEL SECURITY;

-- Users can insert their own application
DROP POLICY IF EXISTS "Users can create their own service provider applications" ON public.service_provider_applications;
CREATE POLICY "Users can create their own service provider applications"
ON public.service_provider_applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own applications
DROP POLICY IF EXISTS "Users can view their own service provider applications" ON public.service_provider_applications;
CREATE POLICY "Users can view their own service provider applications"
ON public.service_provider_applications
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all applications
DROP POLICY IF EXISTS "Admins can view all service provider applications" ON public.service_provider_applications;
CREATE POLICY "Admins can view all service provider applications"
ON public.service_provider_applications
FOR SELECT
USING (has_role(auth.uid(), 'admin'::user_role));

-- Admins can update applications (approve/reject)
DROP POLICY IF EXISTS "Admins can update service provider applications" ON public.service_provider_applications;
CREATE POLICY "Admins can update service provider applications"
ON public.service_provider_applications
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::user_role));

-- Table: service_providers (approved providers directory)
CREATE TABLE IF NOT EXISTS public.service_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  business_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  approved_application_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, category)
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trg_sp_updated_at ON public.service_providers;
CREATE TRIGGER trg_sp_updated_at
BEFORE UPDATE ON public.service_providers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS for service_providers
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;

-- Users can view their own provider records
DROP POLICY IF EXISTS "Users can view their own provider records" ON public.service_providers;
CREATE POLICY "Users can view their own provider records"
ON public.service_providers
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all provider records
DROP POLICY IF EXISTS "Admins can view all provider records" ON public.service_providers;
CREATE POLICY "Admins can view all provider records"
ON public.service_providers
FOR SELECT
USING (has_role(auth.uid(), 'admin'::user_role));

-- Admins can manage provider records
DROP POLICY IF EXISTS "Admins can manage provider records" ON public.service_providers;
CREATE POLICY "Admins can manage provider records"
ON public.service_providers
FOR ALL
USING (has_role(auth.uid(), 'admin'::user_role))
WITH CHECK (has_role(auth.uid(), 'admin'::user_role));

-- RPC: approve_service_provider_application
CREATE OR REPLACE FUNCTION public.approve_service_provider_application(p_application_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_app public.service_provider_applications%ROWTYPE;
BEGIN
  SELECT * INTO v_app FROM public.service_provider_applications WHERE id = p_application_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application % not found', p_application_id;
  END IF;

  -- Mark application approved
  UPDATE public.service_provider_applications
  SET status = 'approved',
      reviewed_at = now(),
      reviewed_by = auth.uid(),
      updated_at = now()
  WHERE id = p_application_id;

  -- Upsert provider profile
  INSERT INTO public.service_providers (user_id, category, business_name, is_active, approved_application_id)
  VALUES (v_app.user_id, v_app.category, v_app.business_name, true, v_app.id)
  ON CONFLICT (user_id, category) DO UPDATE
  SET business_name = EXCLUDED.business_name,
      approved_application_id = EXCLUDED.approved_application_id,
      updated_at = now();

  RETURN true;
END;
$$;

-- RPC: reject_service_provider_application
CREATE OR REPLACE FUNCTION public.reject_service_provider_application(p_application_id UUID, p_admin_notes TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.service_provider_applications
  SET status = 'rejected',
      admin_notes = COALESCE(p_admin_notes, admin_notes),
      reviewed_at = now(),
      reviewed_by = auth.uid(),
      updated_at = now()
  WHERE id = p_application_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application % not found', p_application_id;
  END IF;

  RETURN true;
END;
$$;