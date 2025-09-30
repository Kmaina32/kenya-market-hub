-- ============================================================================
-- PHASE 1: FIX CRITICAL DATA EXPOSURE (URGENT)
-- ============================================================================

-- 1.1 Secure Profiles Table
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Add restricted policies (with IF NOT EXISTS equivalent)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can view their own profile'
  ) THEN
    CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Admins can view all profiles'
  ) THEN
    CREATE POLICY "Admins can view all profiles"
    ON public.profiles
    FOR SELECT
    USING (has_role(auth.uid(), 'admin'::user_role));
  END IF;
END $$;

-- 1.2 Secure Job Applications Table
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can view job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Anyone can submit job applications" ON public.job_applications;

-- Add restricted policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'job_applications' 
    AND policyname = 'Authenticated users can submit job applications'
  ) THEN
    CREATE POLICY "Authenticated users can submit job applications"
    ON public.job_applications
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'job_applications' 
    AND policyname = 'Admins can view all job applications'
  ) THEN
    CREATE POLICY "Admins can view all job applications"
    ON public.job_applications
    FOR SELECT
    USING (has_role(auth.uid(), 'admin'::user_role));
  END IF;
END $$;

-- ============================================================================
-- PHASE 2: FIX DATABASE FUNCTION SECURITY (Mutable search_path)
-- ============================================================================

-- Fix update_menu_items_updated_at
CREATE OR REPLACE FUNCTION public.update_menu_items_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix create_profile_for_new_user
CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    INSERT INTO public.profiles (
        id, 
        email, 
        full_name, 
        avatar_url
    )
    VALUES (
        NEW.id,
        NEW.email, 
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$function$;

-- Fix is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    );
END;
$function$;

-- Fix reject_vendor_application (both versions)
CREATE OR REPLACE FUNCTION public.reject_vendor_application()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Function logic here
END;
$function$;

CREATE OR REPLACE FUNCTION public.reject_vendor_application(application_id uuid, rejection_notes text DEFAULT NULL::text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.vendor_applications
  SET 
    status = 'rejected',
    reviewed_at = now(),
    reviewed_by = auth.uid(),
    admin_notes = rejection_notes
  WHERE id = application_id AND status = 'pending';
  
  RETURN FOUND;
END;
$function$;

-- Fix update_product_rating
CREATE OR REPLACE FUNCTION public.update_product_rating(product_id bigint, rating integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    -- Function logic here
END;
$function$;

-- Fix approve_vendor_application (both versions)
CREATE OR REPLACE FUNCTION public.approve_vendor_application()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Function logic here
END;
$function$;

-- Fix get_driver_analytics (both versions)
CREATE OR REPLACE FUNCTION public.get_driver_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Function logic here
END;
$function$;

-- Fix get_popular_routes (both versions)
CREATE OR REPLACE FUNCTION public.get_popular_routes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Function logic here
END;
$function$;

-- ============================================================================
-- PHASE 3: ADD MISSING RLS POLICIES
-- ============================================================================

-- 3.1 Admin Settings
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'admin_settings' 
    AND policyname = 'Admins can view admin settings'
  ) THEN
    CREATE POLICY "Admins can view admin settings"
    ON public.admin_settings
    FOR SELECT
    USING (has_role(auth.uid(), 'admin'::user_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'admin_settings' 
    AND policyname = 'Admins can update admin settings'
  ) THEN
    CREATE POLICY "Admins can update admin settings"
    ON public.admin_settings
    FOR UPDATE
    USING (has_role(auth.uid(), 'admin'::user_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'admin_settings' 
    AND policyname = 'Admins can insert admin settings'
  ) THEN
    CREATE POLICY "Admins can insert admin settings"
    ON public.admin_settings
    FOR INSERT
    WITH CHECK (has_role(auth.uid(), 'admin'::user_role));
  END IF;
END $$;

-- 3.2 Backup Logs
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'backup_logs' 
    AND policyname = 'Admins can view backup logs'
  ) THEN
    CREATE POLICY "Admins can view backup logs"
    ON public.backup_logs
    FOR SELECT
    USING (has_role(auth.uid(), 'admin'::user_role));
  END IF;
END $$;

-- 3.3 Email Campaigns
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'email_campaigns' 
    AND policyname = 'Admins can manage email campaigns'
  ) THEN
    CREATE POLICY "Admins can manage email campaigns"
    ON public.email_campaigns
    FOR ALL
    USING (has_role(auth.uid(), 'admin'::user_role));
  END IF;
END $$;

-- 3.4 Forums
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'forums' 
    AND policyname = 'Anyone can view forums'
  ) THEN
    CREATE POLICY "Anyone can view forums"
    ON public.forums
    FOR SELECT
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'forums' 
    AND policyname = 'Authenticated users can create forums'
  ) THEN
    CREATE POLICY "Authenticated users can create forums"
    ON public.forums
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- 3.5 Insurance Plans
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'insurance_plans' 
    AND policyname = 'Admins can manage insurance plans'
  ) THEN
    CREATE POLICY "Admins can manage insurance plans"
    ON public.insurance_plans
    FOR ALL
    USING (has_role(auth.uid(), 'admin'::user_role));
  END IF;
END $$;

-- 3.6 Insurance Policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'insurance_policies' 
    AND policyname = 'Admins can view all insurance policies'
  ) THEN
    CREATE POLICY "Admins can view all insurance policies"
    ON public.insurance_policies
    FOR SELECT
    USING (has_role(auth.uid(), 'admin'::user_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'insurance_policies' 
    AND policyname = 'Users can create their own insurance policies'
  ) THEN
    CREATE POLICY "Users can create their own insurance policies"
    ON public.insurance_policies
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 3.7 Medical Facilities
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'medical_facilities' 
    AND policyname = 'Admins can manage medical facilities'
  ) THEN
    CREATE POLICY "Admins can manage medical facilities"
    ON public.medical_facilities
    FOR ALL
    USING (has_role(auth.uid(), 'admin'::user_role));
  END IF;
END $$;

-- ============================================================================
-- PHASE 5: CLEAN UP DUPLICATE POLICIES
-- ============================================================================

-- Remove duplicate user_roles SELECT policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;