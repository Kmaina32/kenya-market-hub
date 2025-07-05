
-- Create forum categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.forum_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on forum categories
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to forum categories
CREATE POLICY "Anyone can view forum categories" 
  ON public.forum_categories 
  FOR SELECT 
  USING (true);

-- Insert some default categories if they don't exist
INSERT INTO public.forum_categories (name, description, color) 
VALUES 
  ('General Discussion', 'General community discussions', '#3b82f6'),
  ('Technical Support', 'Get help with technical issues', '#ef4444'),
  ('Product Reviews', 'Share your product reviews and experiences', '#10b981'),
  ('Marketplace', 'Buy, sell, and trade items', '#f59e0b')
ON CONFLICT DO NOTHING;

-- Add foreign key constraint to forum_posts if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'forum_posts_category_id_fkey'
    ) THEN
        ALTER TABLE public.forum_posts 
        ADD CONSTRAINT forum_posts_category_id_fkey 
        FOREIGN KEY (category_id) REFERENCES public.forum_categories(id);
    END IF;
END $$;

-- Add foreign key constraint for author_id to profiles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'forum_posts_author_id_fkey'
    ) THEN
        ALTER TABLE public.forum_posts 
        ADD CONSTRAINT forum_posts_author_id_fkey 
        FOREIGN KEY (author_id) REFERENCES public.profiles(id);
    END IF;
END $$;
