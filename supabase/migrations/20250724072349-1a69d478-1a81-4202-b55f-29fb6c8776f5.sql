
-- Create emergency_contacts table
CREATE TABLE public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create safety_alerts table
CREATE TABLE public.safety_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('sos', 'panic', 'incident')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'dismissed')),
  location JSONB,
  message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id)
);

-- Create shared_rides table for ride sharing safety
CREATE TABLE public.shared_rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  shared_with_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_level TEXT NOT NULL DEFAULT 'view' CHECK (permission_level IN ('view', 'track', 'emergency')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Create safety_reports table
CREATE TABLE public.safety_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES auth.users(id),
  ride_id UUID REFERENCES rides(id),
  report_type TEXT NOT NULL CHECK (report_type IN ('safety_concern', 'harassment', 'reckless_driving', 'other')),
  description TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  location JSONB,
  evidence JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for emergency_contacts
CREATE POLICY "Users can manage their own emergency contacts"
  ON public.emergency_contacts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for safety_alerts
CREATE POLICY "Users can manage their own safety alerts"
  ON public.safety_alerts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Emergency contacts can view user alerts"
  ON public.safety_alerts FOR SELECT
  USING (user_id IN (
    SELECT ec.user_id FROM emergency_contacts ec 
    WHERE ec.user_id = auth.uid()
  ));

-- RLS Policies for shared_rides
CREATE POLICY "Users can view rides shared with them"
  ON public.shared_rides FOR SELECT
  USING (auth.uid() = shared_with_user_id OR auth.uid() = shared_by_user_id);

CREATE POLICY "Users can share their own rides"
  ON public.shared_rides FOR INSERT
  WITH CHECK (auth.uid() = shared_by_user_id);

CREATE POLICY "Users can manage their shared rides"
  ON public.shared_rides FOR ALL
  USING (auth.uid() = shared_by_user_id);

-- RLS Policies for safety_reports
CREATE POLICY "Users can create safety reports"
  ON public.safety_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports"
  ON public.safety_reports FOR SELECT
  USING (auth.uid() = reporter_id);

CREATE POLICY "Admins can manage all safety reports"
  ON public.safety_reports FOR ALL
  USING (has_role(auth.uid(), 'admin'::user_role));

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_emergency_contacts_updated_at
  BEFORE UPDATE ON public.emergency_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_safety_reports_updated_at
  BEFORE UPDATE ON public.safety_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
