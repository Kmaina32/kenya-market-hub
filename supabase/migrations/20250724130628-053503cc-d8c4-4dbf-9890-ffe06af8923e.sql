
-- Phase 1: Enable RLS for products table and create proper access policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for products table
CREATE POLICY "Anyone can view active products" 
  ON public.products 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Vendors can manage their own products" 
  ON public.products 
  FOR ALL 
  USING (vendor_id IN (
    SELECT id FROM vendors WHERE user_id = auth.uid()
  ))
  WITH CHECK (vendor_id IN (
    SELECT id FROM vendors WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all products" 
  ON public.products 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::user_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::user_role));

-- Enable RLS and create policies for unprotected tables
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can manage admin settings" 
  ON public.admin_settings 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::user_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::user_role));

ALTER TABLE public.backup_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view backup logs" 
  ON public.backup_logs 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::user_role));

ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can manage email campaigns" 
  ON public.email_campaigns 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::user_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::user_role));

ALTER TABLE public.forums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read forums" 
  ON public.forums 
  FOR SELECT 
  USING (true);
CREATE POLICY "Only admins can manage forums" 
  ON public.forums 
  FOR INSERT, UPDATE, DELETE 
  USING (has_role(auth.uid(), 'admin'::user_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::user_role));

-- Create order_status_history table with RLS if it doesn't exist
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  status TEXT NOT NULL,
  changed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT
);

ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their order status history" 
  ON public.order_status_history 
  FOR SELECT 
  USING (order_id IN (
    SELECT id FROM orders WHERE user_id = auth.uid()
  ));
CREATE POLICY "Admins can manage all order status history" 
  ON public.order_status_history 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::user_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::user_role));

-- Create ride_requests table with RLS if it doesn't exist
CREATE TABLE IF NOT EXISTS public.ride_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  pickup_location TEXT NOT NULL,
  destination TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.ride_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own ride requests" 
  ON public.ride_requests 
  FOR ALL 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Drivers can view active ride requests" 
  ON public.ride_requests 
  FOR SELECT 
  USING (
    status = 'pending' AND 
    EXISTS (SELECT 1 FROM drivers WHERE user_id = auth.uid() AND is_active = true)
  );

-- Create service_bookings table with RLS if it doesn't exist
CREATE TABLE IF NOT EXISTS public.service_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  service_provider_id UUID NOT NULL,
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own service bookings" 
  ON public.service_bookings 
  FOR ALL 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Service providers can view their bookings" 
  ON public.service_bookings 
  FOR SELECT 
  USING (service_provider_id IN (
    SELECT id FROM service_providers WHERE user_id = auth.uid()
  ));

-- Create surge_pricing table with RLS if it doesn't exist
CREATE TABLE IF NOT EXISTS public.surge_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area TEXT NOT NULL,
  multiplier NUMERIC NOT NULL DEFAULT 1.0,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.surge_pricing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active surge pricing" 
  ON public.surge_pricing 
  FOR SELECT 
  USING (is_active = true AND start_time <= now() AND end_time >= now());
CREATE POLICY "Only admins can manage surge pricing" 
  ON public.surge_pricing 
  FOR INSERT, UPDATE, DELETE 
  USING (has_role(auth.uid(), 'admin'::user_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::user_role));

-- Enable RLS for vendors table and update policies
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Anyone can view active vendors" ON public.vendors;
DROP POLICY IF EXISTS "Vendors can manage their own profile" ON public.vendors;
DROP POLICY IF EXISTS "Admins can manage all vendors" ON public.vendors;

CREATE POLICY "Anyone can view active verified vendors" 
  ON public.vendors 
  FOR SELECT 
  USING (is_active = true AND verification_status = 'approved');

CREATE POLICY "Vendors can manage their own profile" 
  ON public.vendors 
  FOR ALL 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all vendors" 
  ON public.vendors 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::user_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::user_role));

-- Fix search_path in database functions for security
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

-- Create improved admin check function
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;
