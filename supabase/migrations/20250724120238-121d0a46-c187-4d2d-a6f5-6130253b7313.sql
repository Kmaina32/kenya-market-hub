
-- Fix critical database security issues

-- 1. Enable RLS on products table (currently disabled)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products table
CREATE POLICY "Anyone can view active products" ON public.products
FOR SELECT USING (is_active = true);

CREATE POLICY "Vendors can manage their own products" ON public.products
FOR ALL USING (
  vendor_id IN (
    SELECT id FROM vendors WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all products" ON public.products
FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- 2. Add missing RLS policies for admin_settings
CREATE POLICY "Admins can manage admin settings" ON public.admin_settings
FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- 3. Add missing RLS policies for backup_logs
CREATE POLICY "Admins can manage backup logs" ON public.backup_logs
FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- 4. Add missing RLS policies for forums
CREATE POLICY "Anyone can view forums" ON public.forums
FOR SELECT USING (true);

CREATE POLICY "Admins can manage forums" ON public.forums
FOR INSERT, UPDATE, DELETE USING (has_role(auth.uid(), 'admin'::user_role));

-- 5. Fix database functions to include proper search_path
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

-- 6. Create proper foreign key relationship for forum_posts -> profiles
ALTER TABLE public.forum_posts 
ADD CONSTRAINT forum_posts_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 7. Add security audit logging for failed authentication attempts
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view security audit logs" ON public.security_audit_log
FOR SELECT USING (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "System can insert security audit logs" ON public.security_audit_log
FOR INSERT WITH CHECK (true);
