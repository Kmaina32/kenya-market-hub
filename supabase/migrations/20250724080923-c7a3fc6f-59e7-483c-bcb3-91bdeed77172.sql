
-- Update RLS policies for forum_post_reactions table
DROP POLICY IF EXISTS "Anyone can view post reactions" ON forum_post_reactions;
DROP POLICY IF EXISTS "Users can manage their own reactions" ON forum_post_reactions;

-- Create new policies that allow proper access
CREATE POLICY "Users can view all post reactions" 
ON forum_post_reactions FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can insert their own reactions" 
ON forum_post_reactions FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reactions" 
ON forum_post_reactions FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions" 
ON forum_post_reactions FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);
