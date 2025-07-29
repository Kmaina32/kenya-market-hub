
-- Add missing image_url column to forum_posts
ALTER TABLE public.forum_posts ADD COLUMN image_url text;

-- Add missing delete policy for forum_posts so users can delete their own posts
CREATE POLICY "Users can delete their own forum posts" 
ON public.forum_posts 
FOR DELETE 
USING (author_id = auth.uid());
