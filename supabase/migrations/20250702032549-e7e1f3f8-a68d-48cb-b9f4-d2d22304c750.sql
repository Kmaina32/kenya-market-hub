
-- Create transactions table for payment tracking
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  transaction_id TEXT,
  payment_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
FOR SELECT USING (
  order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
);

CREATE POLICY "Service role can manage transactions" ON public.transactions
FOR ALL USING (true);

-- Create service_providers table
CREATE TABLE IF NOT EXISTS public.service_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_name TEXT NOT NULL,
  business_description TEXT,
  service_category TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  business_address TEXT,
  verification_status TEXT DEFAULT 'pending',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on service_providers
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;

-- Create policies for service_providers
CREATE POLICY "Users can view their own service provider profile" ON public.service_providers
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create service provider applications" ON public.service_providers
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all service providers" ON public.service_providers
FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Add views_count column to products if it doesn't exist
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

-- Create rides table if not exists
CREATE TABLE IF NOT EXISTS public.rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  driver_id UUID,
  pickup_address TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  pickup_coordinates POINT,
  destination_coordinates POINT,
  vehicle_type vehicle_type NOT NULL,
  status ride_status DEFAULT 'pending',
  fare NUMERIC,
  actual_fare NUMERIC,
  distance_km NUMERIC,
  duration_minutes INTEGER,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on rides
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;

-- Create policies for rides
CREATE POLICY "Users can view their own rides" ON public.rides
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create rides" ON public.rides
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own rides" ON public.rides
FOR UPDATE USING (user_id = auth.uid());

-- Create job_postings table if not exists
CREATE TABLE IF NOT EXISTS public.job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company TEXT,
  location TEXT,
  category TEXT NOT NULL,
  job_type TEXT DEFAULT 'full-time',
  salary_min NUMERIC,
  salary_max NUMERIC,
  requirements TEXT[],
  benefits TEXT[],
  status TEXT DEFAULT 'active',
  application_deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on job_postings
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

-- Create policies for job_postings
CREATE POLICY "Anyone can view active job postings" ON public.job_postings
FOR SELECT USING (status = 'active');

CREATE POLICY "Employers can manage their own job postings" ON public.job_postings
FOR ALL USING (employer_id = auth.uid());

-- Update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers if they don't exist
DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_service_providers_updated_at ON public.service_providers;
CREATE TRIGGER update_service_providers_updated_at BEFORE UPDATE ON public.service_providers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rides_updated_at ON public.rides;
CREATE TRIGGER update_rides_updated_at BEFORE UPDATE ON public.rides
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_job_postings_updated_at ON public.job_postings;
CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON public.job_postings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
