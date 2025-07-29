
-- Phase 1: Critical RLS Policy Fixes
-- Fix missing RLS policies for unprotected tables

-- 1. Admin Settings - Only admins can manage
CREATE POLICY "Only admins can manage admin settings" ON public.admin_settings
FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- 2. Backup Logs - Only admins can view
CREATE POLICY "Only admins can view backup logs" ON public.backup_logs
FOR SELECT USING (has_role(auth.uid(), 'admin'::user_role));

-- 3. Email Campaigns - Users can manage their own, admins can manage all
CREATE POLICY "Users can manage their own email campaigns" ON public.email_campaigns
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all email campaigns" ON public.email_campaigns
FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- 4. Forums - Public read, authenticated users can create
CREATE POLICY "Anyone can read forums" ON public.forums
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create forums" ON public.forums
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all forums" ON public.forums
FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- 5. Service Bookings - Users can manage their own bookings
CREATE POLICY "Users can view their own service bookings" ON public.service_bookings
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own service bookings" ON public.service_bookings
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own service bookings" ON public.service_bookings
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Service providers can view bookings for their services" ON public.service_bookings
FOR SELECT USING (service_id IN (
  SELECT id FROM public.services WHERE provider_id IN (
    SELECT id FROM public.service_providers WHERE user_id = auth.uid()
  )
));

CREATE POLICY "Admins can manage all service bookings" ON public.service_bookings
FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- 6. Ride Requests - Users can manage their own requests, drivers can view assigned requests
CREATE POLICY "Users can manage their own ride requests" ON public.ride_requests
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Drivers can view their assigned ride requests" ON public.ride_requests
FOR SELECT USING (driver_id IN (
  SELECT id FROM public.drivers WHERE user_id = auth.uid()
));

CREATE POLICY "Admins can manage all ride requests" ON public.ride_requests
FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- 7. Order Status History - Users can view their own order history
CREATE POLICY "Users can view their own order status history" ON public.order_status_history
FOR SELECT USING (order_id IN (
  SELECT id FROM public.orders WHERE user_id = auth.uid()
));

CREATE POLICY "Admins can view all order status history" ON public.order_status_history
FOR SELECT USING (has_role(auth.uid(), 'admin'::user_role));

-- 8. Surge Pricing - Public read for fare calculations, admin manage
CREATE POLICY "Anyone can view active surge pricing" ON public.surge_pricing
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage surge pricing" ON public.surge_pricing
FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- 9. Vendors - Public read for approved vendors, vendors can manage own profile
CREATE POLICY "Anyone can view approved vendors" ON public.vendors
FOR SELECT USING (verification_status = 'approved' AND is_active = true);

CREATE POLICY "Vendors can manage their own profile" ON public.vendors
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all vendors" ON public.vendors
FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- Phase 2: Enable RLS on Products table with proper policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public read access for products
CREATE POLICY "Anyone can view active products" ON public.products
FOR SELECT USING (is_active = true);

-- Vendors can manage their own products
CREATE POLICY "Vendors can manage their own products" ON public.products
FOR ALL USING (vendor_id IN (
  SELECT id FROM public.vendors WHERE user_id = auth.uid()
));

-- Admins can manage all products
CREATE POLICY "Admins can manage all products" ON public.products
FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- Phase 3: Fix database function security - Add secure search_path
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role::text FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = check_user_id AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.check_user_role(check_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE 
    user_role text;
BEGIN
    SELECT role INTO user_role 
    FROM public.user_roles 
    WHERE user_id = auth.uid()
    LIMIT 1;

    RETURN user_role = check_role;
EXCEPTION 
    WHEN OTHERS THEN 
        RETURN false;
END;
$$;

CREATE OR REPLACE FUNCTION public.can_view_product()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE 
    user_role text;
BEGIN
    SELECT role INTO user_role 
    FROM public.user_roles 
    WHERE user_id = auth.uid()
    LIMIT 1;

    RETURN user_role IN ('admin', 'manager', 'sales');
EXCEPTION 
    WHEN OTHERS THEN 
        RETURN false;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.update_profile(input_full_name text DEFAULT NULL::text, input_avatar_url text DEFAULT NULL::text, input_phone text DEFAULT NULL::text)
RETURNS profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    current_user_id UUID;
    updated_profile public.profiles;
BEGIN
    current_user_id := auth.uid();
    
    UPDATE public.profiles
    SET 
        full_name = COALESCE(input_full_name, full_name),
        avatar_url = COALESCE(input_avatar_url, avatar_url),
        phone = COALESCE(input_phone, phone),
        updated_at = NOW()
    WHERE user_id = current_user_id
    RETURNING * INTO updated_profile;
    
    RETURN updated_profile;
END;
$$;

CREATE OR REPLACE FUNCTION public.upsert_profile(p_user_id uuid, p_email text, p_full_name text DEFAULT NULL::text, p_avatar_url text DEFAULT NULL::text)
RETURNS SETOF profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN QUERY 
    INSERT INTO public.profiles (
        id, 
        email, 
        full_name, 
        avatar_url
    )
    VALUES (
        p_user_id, 
        p_email, 
        p_full_name, 
        p_avatar_url
    )
    ON CONFLICT (id) DO UPDATE 
    SET 
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
        updated_at = NOW()
    RETURNING *;
END;
$$;
