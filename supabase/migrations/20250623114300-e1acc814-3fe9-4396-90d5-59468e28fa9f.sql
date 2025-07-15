
-- Consolidate multiple permissive policies into single, comprehensive policies
-- This will improve database performance by reducing policy evaluation overhead

-- 1. Fix ride_matching_requests table policies
DROP POLICY IF EXISTS "Drivers can view their ride requests" ON public.ride_matching_requests;
DROP POLICY IF EXISTS "Riders can view requests for their rides" ON public.ride_matching_requests;

CREATE POLICY "Users can view relevant ride requests" ON public.ride_matching_requests
  FOR SELECT USING (
    driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid()) OR
    ride_id IN (SELECT id FROM public.rides WHERE user_id = auth.uid())
  );

-- 2. Fix ride_requests table policies  
DROP POLICY IF EXISTS "Drivers can view their ride requests" ON public.ride_requests;
DROP POLICY IF EXISTS "System can manage ride requests" ON public.ride_requests;

CREATE POLICY "Comprehensive ride requests access" ON public.ride_requests
  FOR ALL USING (
    driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid()) OR
 has_role(auth.uid(), 'admin'::user_role)
  );

-- 3. Fix rides table policies
DROP POLICY IF EXISTS "Drivers can view their assigned rides" ON public.rides;
DROP POLICY IF EXISTS "Users can view their own rides" ON public.rides;

CREATE POLICY "Users can view relevant rides" ON public.rides
  FOR SELECT USING (
    user_id = auth.uid() OR 
    driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid()) OR
 has_role(auth.uid(), 'admin'::user_role)
  );

-- 4. Fix service_bookings table policies
DROP POLICY IF EXISTS "Admin can manage all service bookings" ON public.service_bookings;
DROP POLICY IF EXISTS "Customers can view their own bookings" ON public.service_bookings;
DROP POLICY IF EXISTS "Providers can view their bookings" ON public.service_bookings;
DROP POLICY IF EXISTS "Customers can create bookings" ON public.service_bookings;

CREATE POLICY "Comprehensive service bookings access" ON public.service_bookings
  FOR ALL USING (
    customer_id = auth.uid() OR
    provider_id IN (SELECT id FROM public.service_provider_profiles WHERE user_id = auth.uid()) OR
 has_role(auth.uid(), 'admin'::user_role)
  )
  WITH CHECK (
    customer_id = auth.uid() OR
 has_role(auth.uid(), 'admin'::user_role)
  );

-- 5. Fix service_categories table policies
DROP POLICY IF EXISTS "Admin can manage service categories" ON public.service_categories;
DROP POLICY IF EXISTS "Public can read service categories" ON public.service_categories;

CREATE POLICY "Service categories access" ON public.service_categories
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage service categories" ON public.service_categories
  FOR ALL USING (has_role(auth.uid(), 'admin'::user_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::user_role));

-- 6. Fix service_provider_profiles table policies
DROP POLICY IF EXISTS "Admin can view all service providers" ON public.service_provider_profiles;
DROP POLICY IF EXISTS "Users can view their own service provider profiles" ON public.service_provider_profiles;
DROP POLICY IF EXISTS "Admin can update all service providers" ON public.service_provider_profiles;
DROP POLICY IF EXISTS "Users can update their own service provider profiles" ON public.service_provider_profiles;

CREATE POLICY "Service provider profiles access" ON public.service_provider_profiles
  FOR ALL USING (
    user_id = auth.uid() OR
    has_role(auth.uid(), 'admin'::user_role)
  ) -- Keep EXISTS here to be consistent with the file content provided
  WITH CHECK (
    user_id = auth.uid() OR
 has_role(auth.uid(), 'admin'::user_role)
  ); -- Keep EXISTS here to be consistent with the file content provided

-- 7. Fix transactions table policies
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;
DROP POLICY IF EXISTS "System can manage transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;

CREATE POLICY "Transactions access" ON public.transactions
  FOR ALL USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()) OR
 has_role(auth.uid(), 'admin'::user_role)
  );

-- 8. Fix user_roles table policies
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "System can insert roles" ON public.user_roles;

CREATE POLICY "User roles access" ON public.user_roles
  FOR SELECT USING (
    user_id = auth.uid() OR
 has_role(auth.uid(), 'admin'::user_role)
  );

CREATE POLICY "Admin can manage all roles" ON public.user_roles
  FOR ALL USING (has_role(auth.uid(), 'admin'::user_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::user_role));

-- 9. Fix vendor_applications table policies
DROP POLICY IF EXISTS "Admin can view all vendor applications" ON public.vendor_applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON public.vendor_applications;

CREATE POLICY "Vendor applications access" ON public.vendor_applications
  FOR ALL USING (
    user_id = auth.uid() OR
    has_role(auth.uid(), 'admin'::user_role)
  ) -- Keep EXISTS here to be consistent with the file content provided
  WITH CHECK (
    user_id = auth.uid() OR
 has_role(auth.uid(), 'admin'::user_role)
  ); -- Keep EXISTS here to be consistent with the file content provided

-- 10. Fix vendors table policies
DROP POLICY IF EXISTS "Admin can view all vendors" ON public.vendors;
DROP POLICY IF EXISTS "Anyone can view active vendors" ON public.vendors;
DROP POLICY IF EXISTS "Users can view their own vendor profile" ON public.vendors;
DROP POLICY IF EXISTS "Admin can update all vendors" ON public.vendors;
DROP POLICY IF EXISTS "Users can update their own vendor profile" ON public.vendors;

CREATE POLICY "Vendors read access" ON public.vendors
  FOR SELECT USING (
    is_active = true OR 
    user_id = auth.uid() OR
 has_role(auth.uid(), 'admin'::user_role)
  );

CREATE POLICY "Vendors write access" ON public.vendors
  FOR ALL USING (
    user_id = auth.uid() OR
 has_role(auth.uid(), 'admin'::user_role)
  )
  WITH CHECK (
    user_id = auth.uid() OR
 has_role(auth.uid(), 'admin'::user_role)
  );
