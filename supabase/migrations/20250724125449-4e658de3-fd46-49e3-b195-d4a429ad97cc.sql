
-- Create the recently_viewed table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.recently_viewed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Add Row Level Security
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;

-- Create policies for recently_viewed
CREATE POLICY "Users can view their own recently viewed items" 
  ON public.recently_viewed 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recently viewed items" 
  ON public.recently_viewed 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recently viewed items" 
  ON public.recently_viewed 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recently viewed items" 
  ON public.recently_viewed 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Check if products table has all required columns, add missing ones
DO $$ 
BEGIN
  -- Add rating column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'rating') THEN
    ALTER TABLE public.products ADD COLUMN rating NUMERIC DEFAULT 0;
  END IF;
  
  -- Add reviews_count column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'reviews_count') THEN
    ALTER TABLE public.products ADD COLUMN reviews_count INTEGER DEFAULT 0;
  END IF;
  
  -- Add views_count column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'views_count') THEN
    ALTER TABLE public.products ADD COLUMN views_count INTEGER DEFAULT 0;
  END IF;
END $$;
