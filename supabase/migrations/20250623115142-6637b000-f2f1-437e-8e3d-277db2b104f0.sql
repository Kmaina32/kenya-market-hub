-- Fix remaining performance and security warnings - handle existing policies
-- This addresses broken RLS policies, missing constraints, and security issues

-- 1. Fix infinite recursion in user_roles policies by using a security definer function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT role::text FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- 2. Drop all existing problematic policies and recreate them properly
DROP POLICY IF EXISTS "User roles access" ON public.user_roles;
DROP POLICY IF EXISTS "Admin can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Create proper user_roles policies without recursion
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.get_current_user_role() = 'admin')
  WITH CHECK (public.get_current_user_role() = 'admin');

-- 3. Fix products table policies
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
DROP POLICY IF EXISTS "Vendors can manage their products" ON public.products;

CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Vendors can manage their products" ON public.products
  FOR ALL USING (
    vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()) OR
    has_role(auth.uid(), 'admin'::user_role) -- Replaced EXISTS with has_role
  )
  WITH CHECK (
    vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()) OR
    has_role(auth.uid(), 'admin'::user_role) -- Replaced EXISTS with has_role
  );

-- 4. Add missing RLS policies for tables - drop existing first
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view and update own profile" ON public.profiles;
CREATE POLICY "Users can view and update own profile" ON public.profiles
  FOR ALL USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own wishlist" ON public.wishlist;
CREATE POLICY "Users can manage own wishlist" ON public.wishlist
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own recently viewed" ON public.recently_viewed;
CREATE POLICY "Users can manage own recently viewed" ON public.recently_viewed
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Fix reviews policies
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can insert own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;

CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own reviews" ON public.reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reviews" ON public.reviews
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own reviews" ON public.reviews
  FOR DELETE USING (user_id = auth.uid());

-- 5. Fix orders and order_items RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;

CREATE POLICY "Users can manage own orders" ON public.orders
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (has_role(auth.uid(), 'admin'::user_role)); -- Replaced EXISTS with has_role

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can update own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can delete own order items" ON public.order_items;

CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own order items" ON public.order_items
  FOR INSERT WITH CHECK (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own order items" ON public.order_items
  FOR UPDATE USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
  )
  WITH CHECK (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own order items" ON public.order_items
  FOR DELETE USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
  );

-- 6. Fix notification policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 7. Add missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON public.products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_rides_user_id ON public.rides(user_id);
CREATE INDEX IF NOT EXISTS idx_rides_driver_id ON public.rides(driver_id);

-- 8. Fix property-related tables RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view available properties" ON public.properties;
DROP POLICY IF EXISTS "Property owners can manage their properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can manage all properties" ON public.properties;

CREATE POLICY "Anyone can view available properties" ON public.properties
  FOR SELECT USING (status = 'available');

CREATE POLICY "Property owners can manage their properties" ON public.properties
  FOR ALL USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Admins can manage all properties" ON public.properties
  FOR ALL USING (has_role(auth.uid(), 'admin'::user_role)) -- Replaced EXISTS with has_role
  WITH CHECK (has_role(auth.uid(), 'admin'::user_role)); -- Replaced EXISTS with has_role

-- 9. Add constraints to ensure data integrity
DO $$
BEGIN
    -- Add products price constraint
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_price_positive') THEN
        ALTER TABLE public.products ADD CONSTRAINT products_price_positive CHECK (price >= 0);
    END IF;

    -- Add orders total constraint
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_total_positive') THEN
        ALTER TABLE public.orders ADD CONSTRAINT orders_total_positive CHECK (total_amount >= 0);
    END IF;

    -- Add order items quantity constraint
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'order_items_quantity_positive') THEN
        ALTER TABLE public.order_items ADD CONSTRAINT order_items_quantity_positive CHECK (quantity > 0);
    END IF;

    -- Add order items price constraint
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'order_items_price_positive') THEN
        ALTER TABLE public.order_items ADD CONSTRAINT order_items_price_positive CHECK (unit_price >= 0);
    END IF;
END
$$;
