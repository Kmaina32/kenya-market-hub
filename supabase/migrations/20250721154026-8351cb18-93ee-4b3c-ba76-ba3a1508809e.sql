
-- Critical Security Fixes for Sokko Sasa Platform

-- 1. Enable RLS and create proper policies for products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing conflicting policies first
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Vendors can manage their products" ON public.products;

-- Create comprehensive products policies
CREATE POLICY "Public read access to products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Vendors can manage their own products" ON public.products
  FOR ALL USING (
    vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()) OR
    has_role(auth.uid(), 'admin'::user_role)
  )
  WITH CHECK (
    vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()) OR
    has_role(auth.uid(), 'admin'::user_role)
  );

-- 2. Fix user_roles table security issues
-- Drop all existing conflicting policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admin can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "User roles access" ON public.user_roles;

-- Create secure user_roles policies
CREATE POLICY "Users can view their own roles only" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Only admins can manage all roles" ON public.user_roles
  FOR ALL USING (has_role(auth.uid(), 'admin'::user_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::user_role));

-- Prevent users from self-elevating privileges
CREATE POLICY "Prevent self-privilege escalation" ON public.user_roles
  FOR INSERT WITH CHECK (
    user_id != auth.uid() OR 
    has_role(auth.uid(), 'admin'::user_role)
  );

-- 3. Secure functions with proper search paths
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT role::text FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- 4. Fix other functions with security issues
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- 5. Add security audit logging table
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON public.security_audit_log
  FOR SELECT USING (has_role(auth.uid(), 'admin'::user_role));

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" ON public.security_audit_log
  FOR INSERT WITH CHECK (true);

-- 6. Create secure admin user creation function
CREATE OR REPLACE FUNCTION public.create_admin_user(
  admin_email TEXT,
  admin_password TEXT,
  admin_full_name TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- This function should only be called by existing admins or during initial setup
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    IF NOT has_role(auth.uid(), 'admin'::user_role) THEN
      RAISE EXCEPTION 'Only admins can create new admin users';
    END IF;
  END IF;

  -- Note: User creation via SQL is limited in Supabase
  -- This is a placeholder for proper admin creation workflow
  RAISE EXCEPTION 'Admin user creation must be done through Supabase Auth API or dashboard';
  
  RETURN new_user_id;
END;
$$;

-- 7. Add constraint to prevent duplicate admin roles per user
ALTER TABLE public.user_roles 
ADD CONSTRAINT unique_user_role UNIQUE (user_id, role);

-- 8. Add indexes for security and performance
CREATE INDEX IF NOT EXISTS idx_security_audit_user_id ON public.security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_action ON public.security_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_security_audit_created_at ON public.security_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_user_roles_composite ON public.user_roles(user_id, role);

-- 9. Create function to safely check admin status
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = check_user_id AND role = 'admin'
  );
$$;
