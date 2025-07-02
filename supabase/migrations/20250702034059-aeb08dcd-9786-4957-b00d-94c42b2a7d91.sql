
-- Add views_count column to products table if it doesn't exist
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
