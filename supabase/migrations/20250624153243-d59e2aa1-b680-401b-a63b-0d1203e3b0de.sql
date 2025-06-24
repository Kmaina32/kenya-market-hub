
-- Create tables for Shop categories and featured products
CREATE TABLE IF NOT EXISTS public.shop_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for featured products
CREATE TABLE IF NOT EXISTS public.featured_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  featured_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tables for Food Delivery
CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cuisine_type TEXT NOT NULL,
  image_url TEXT,
  rating NUMERIC(3,2) DEFAULT 0,
  delivery_time_minutes INTEGER DEFAULT 30,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  minimum_order NUMERIC(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  phone TEXT,
  address TEXT,
  latitude NUMERIC(10,8),
  longitude NUMERIC(11,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tables for Events
CREATE TABLE IF NOT EXISTS public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT NOT NULL,
  image_url TEXT,
  price NUMERIC(10,2) DEFAULT 0,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  organizer_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for Jobs
CREATE TABLE IF NOT EXISTS public.jobs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company TEXT,
  location TEXT,
  category TEXT NOT NULL,
  salary TEXT,
  job_type TEXT DEFAULT 'full-time',
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  posted_by UUID
);

-- Create tables for Insurance
CREATE TABLE IF NOT EXISTS public.insurance_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  plan_type TEXT NOT NULL,
  coverage_amount NUMERIC(15,2),
  monthly_premium NUMERIC(10,2) NOT NULL,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.insurance_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_id UUID REFERENCES public.insurance_plans(id),
  policy_number TEXT UNIQUE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'active',
  premium_paid NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.shop_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_policies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Anyone can read shop categories" ON public.shop_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can read featured products" ON public.featured_products FOR SELECT USING (true);
CREATE POLICY "Anyone can read restaurants" ON public.restaurants FOR SELECT USING (true);
CREATE POLICY "Anyone can read menu items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Anyone can read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Anyone can read jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Anyone can read insurance plans" ON public.insurance_plans FOR SELECT USING (true);
CREATE POLICY "Users can read own policies" ON public.insurance_policies FOR SELECT USING (auth.uid() = user_id);

-- Seed data for Shop Categories
INSERT INTO public.shop_categories (name, description, icon, display_order) VALUES 
('Electronics', 'Phones, laptops, and gadgets', 'Smartphone', 1),
('Fashion', 'Clothing and accessories', 'Shirt', 2),
('Home & Garden', 'Furniture and home decor', 'Home', 3),
('Sports & Fitness', 'Exercise equipment and sportswear', 'Dumbbell', 4),
('Books & Media', 'Books, music, and movies', 'BookOpen', 5),
('Beauty & Health', 'Cosmetics and health products', 'Heart', 6),
('Automotive', 'Car parts and accessories', 'Car', 7),
('Toys & Games', 'Children toys and board games', 'Gamepad2', 8);

-- Seed data for Restaurants
INSERT INTO public.restaurants (name, description, cuisine_type, rating, delivery_time_minutes, delivery_fee, minimum_order, phone, address) VALUES 
('Nairobi Grill', 'Authentic Kenyan BBQ and grilled meats', 'Kenyan', 4.5, 25, 150.00, 500.00, '+254712345678', 'Westlands, Nairobi'),
('Pizza Palace', 'Fresh Italian pizzas and pasta', 'Italian', 4.2, 30, 100.00, 800.00, '+254723456789', 'CBD, Nairobi'),
('Spice Route', 'Traditional Indian and Pakistani cuisine', 'Indian', 4.7, 35, 120.00, 600.00, '+254734567890', 'Kilimani, Nairobi'),
('Mama Oliech', 'Famous for fish and traditional meals', 'Kenyan', 4.8, 20, 80.00, 400.00, '+254745678901', 'South B, Nairobi'),
('Burger Station', 'Juicy burgers and fast food', 'American', 4.1, 15, 50.00, 300.00, '+254756789012', 'Westgate Mall, Nairobi'),
('Green Garden', 'Healthy salads and vegetarian options', 'Vegetarian', 4.4, 20, 100.00, 450.00, '+254767890123', 'Karen, Nairobi');

-- Seed data for Menu Items
INSERT INTO public.menu_items (restaurant_id, name, description, price, category) VALUES 
((SELECT id FROM public.restaurants WHERE name = 'Nairobi Grill' LIMIT 1), 'Nyama Choma', 'Grilled goat meat with ugali', 1200.00, 'Main Course'),
((SELECT id FROM public.restaurants WHERE name = 'Nairobi Grill' LIMIT 1), 'Chicken Wings', 'Spicy grilled chicken wings', 800.00, 'Appetizer'),
((SELECT id FROM public.restaurants WHERE name = 'Pizza Palace' LIMIT 1), 'Margherita Pizza', 'Classic tomato and mozzarella pizza', 1500.00, 'Pizza'),
((SELECT id FROM public.restaurants WHERE name = 'Pizza Palace' LIMIT 1), 'Chicken Alfredo', 'Creamy pasta with grilled chicken', 1200.00, 'Pasta'),
((SELECT id FROM public.restaurants WHERE name = 'Spice Route' LIMIT 1), 'Chicken Biryani', 'Aromatic basmati rice with spiced chicken', 1000.00, 'Main Course'),
((SELECT id FROM public.restaurants WHERE name = 'Spice Route' LIMIT 1), 'Samosas', 'Crispy pastries with spiced filling', 300.00, 'Appetizer'),
((SELECT id FROM public.restaurants WHERE name = 'Mama Oliech' LIMIT 1), 'Tilapia Fish', 'Fresh tilapia with ugali and sukuma', 900.00, 'Main Course'),
((SELECT id FROM public.restaurants WHERE name = 'Burger Station' LIMIT 1), 'Classic Burger', 'Beef patty with lettuce and tomato', 650.00, 'Burger'),
((SELECT id FROM public.restaurants WHERE name = 'Green Garden' LIMIT 1), 'Caesar Salad', 'Fresh lettuce with parmesan and croutons', 550.00, 'Salad');

-- Seed data for Events
INSERT INTO public.events (title, description, event_type, date, location, price, max_attendees) VALUES 
('Nairobi Tech Conference 2024', 'Annual technology conference featuring latest innovations', 'Conference', '2024-03-15 09:00:00+03', 'KICC, Nairobi', 2500.00, 500),
('Kenyan Music Festival', 'Celebrating local and international artists', 'Music', '2024-02-20 18:00:00+03', 'Uhuru Gardens, Nairobi', 1500.00, 2000),
('Business Networking Night', 'Connect with entrepreneurs and investors', 'Networking', '2024-02-10 19:00:00+03', 'Villa Rosa Kempinski, Nairobi', 3000.00, 100),
('Marathon for Health', 'Annual charity marathon supporting health initiatives', 'Sports', '2024-04-01 06:00:00+03', 'Karura Forest, Nairobi', 500.00, 1000),
('Art & Culture Exhibition', 'Showcasing contemporary Kenyan art', 'Exhibition', '2024-02-25 10:00:00+03', 'National Museums, Nairobi', 200.00, 300),
('Food & Wine Tasting', 'Experience the best of Kenyan cuisine', 'Food', '2024-03-05 16:00:00+03', 'Two Rivers Mall, Nairobi', 2000.00, 150);

-- Seed data for Jobs
INSERT INTO public.jobs (title, description, company, location, category, salary, job_type) VALUES 
('Software Developer', 'Full-stack developer with React and Node.js experience', 'TechCorp Kenya', 'Nairobi', 'Technology', 'KSh 80,000 - 120,000', 'full-time'),
('Marketing Manager', 'Lead marketing campaigns and brand strategy', 'Brand Solutions Ltd', 'Nairobi', 'Marketing', 'KSh 60,000 - 90,000', 'full-time'),
('Sales Representative', 'B2B sales for FMCG products', 'Consumer Goods Co', 'Mombasa', 'Sales', 'KSh 40,000 - 60,000', 'full-time'),
('Graphic Designer', 'Create visual content for digital and print media', 'Creative Agency', 'Nairobi', 'Design', 'KSh 35,000 - 55,000', 'contract'),
('Accountant', 'Manage financial records and reporting', 'Finance Solutions', 'Kisumu', 'Finance', 'KSh 50,000 - 70,000', 'full-time'),
('Customer Service Rep', 'Handle customer inquiries and support', 'Call Center Pro', 'Nairobi', 'Customer Service', 'KSh 25,000 - 35,000', 'part-time'),
('Project Manager', 'Oversee construction projects from start to finish', 'BuildRight Construction', 'Nakuru', 'Construction', 'KSh 70,000 - 100,000', 'full-time'),
('Teacher - Mathematics', 'Secondary school mathematics teacher', 'Bright Future School', 'Eldoret', 'Education', 'KSh 30,000 - 45,000', 'full-time');

-- Seed data for Insurance Plans
INSERT INTO public.insurance_plans (name, description, plan_type, coverage_amount, monthly_premium, features) VALUES 
('Basic Health Cover', 'Essential health insurance for individuals', 'health', 500000.00, 2500.00, '["Outpatient care", "Inpatient treatment", "Emergency services"]'),
('Comprehensive Health', 'Complete health coverage for families', 'health', 2000000.00, 8500.00, '["Outpatient care", "Inpatient treatment", "Emergency services", "Dental care", "Optical care", "Maternity cover"]'),
('Motor Vehicle Insurance', 'Comprehensive car insurance coverage', 'motor', 3000000.00, 12000.00, '["Third party liability", "Own damage cover", "Theft protection", "Fire damage"]'),
('Life Insurance Basic', 'Term life insurance for financial security', 'life', 1000000.00, 3500.00, '["Death benefit", "Terminal illness cover", "Funeral expenses"]'),
('Business Insurance', 'Protect your business assets and operations', 'business', 5000000.00, 25000.00, '["Property damage", "Business interruption", "Public liability", "Professional indemnity"]'),
('Travel Insurance', 'Coverage for domestic and international travel', 'travel', 100000.00, 1500.00, '["Medical emergencies", "Trip cancellation", "Lost luggage", "Flight delays"]');
