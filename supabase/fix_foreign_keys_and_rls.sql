-- Check if foreign key constraint exists for forum_posts.author_id
SELECT
    conname AS constraint_name,
    conrelid::regclass AS table_name,
    a.attname AS column_name,
    confrelid::regclass AS foreign_table_name,
    af.attname AS foreign_column_name
FROM
    pg_constraint AS c
JOIN
    pg_attribute AS a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
JOIN
    pg_attribute AS af ON af.attnum = ANY(c.confkey) AND af.attrelid = c.confrelid
WHERE
    c.contype = 'f'
    AND conrelid = 'public.forum_posts'::regclass
    AND a.attname = 'author_id';

-- Add foreign key constraint for forum_posts.author_id if missing
ALTER TABLE public.forum_posts
    ADD CONSTRAINT forum_posts_author_id_fkey
    FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Check if foreign key constraint exists for user_roles.user_id
SELECT
    conname AS constraint_name,
    conrelid::regclass AS table_name,
    a.attname AS column_name,
    confrelid::regclass AS foreign_table_name,
    af.attname AS foreign_column_name
FROM
    pg_constraint AS c
JOIN
    pg_attribute AS a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
JOIN
    pg_attribute AS af ON af.attnum = ANY(c.confkey) AND af.attrelid = c.confrelid
WHERE
    c.contype = 'f'
    AND conrelid = 'public.user_roles'::regclass
    AND a.attname = 'user_id';

-- Add foreign key constraint for user_roles.user_id if missing
ALTER TABLE public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Enable Row Level Security on forum_posts and user_roles
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create or replace RLS policies for forum_posts
DROP POLICY IF EXISTS "Anyone can view forum posts" ON public.forum_posts;
CREATE POLICY "Anyone can view forum posts" ON public.forum_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create forum posts" ON public.forum_posts;
CREATE POLICY "Users can create forum posts" ON public.forum_posts FOR INSERT WITH CHECK (author_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own forum posts" ON public.forum_posts;
CREATE POLICY "Users can update their own forum posts" ON public.forum_posts FOR UPDATE USING (author_id = auth.uid());

-- Create or replace RLS policies for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- Function to check user role (if not exists)
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, role_name user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles WHERE user_id = user_id AND role = role_name
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
