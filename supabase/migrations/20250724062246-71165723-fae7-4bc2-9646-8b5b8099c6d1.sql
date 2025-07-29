
-- Add color column to forum_categories table
ALTER TABLE public.forum_categories 
ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#3b82f6';

-- Update existing categories with default colors
UPDATE public.forum_categories 
SET color = CASE 
  WHEN name = 'General Discussion' THEN '#3b82f6'
  WHEN name = 'Business & Services' THEN '#10b981' 
  WHEN name = 'Events & Activities' THEN '#f59e0b'
  WHEN name = 'Buy & Sell' THEN '#ef4444'
  ELSE '#3b82f6'
END
WHERE color IS NULL;
