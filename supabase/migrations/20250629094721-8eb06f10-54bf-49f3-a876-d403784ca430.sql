
-- Insert admin role for specific email address
-- Replace 'your-email@example.com' with the actual admin email address
INSERT INTO public.user_roles (user_id, role)
SELECT auth.users.id, 'admin'::user_role
FROM auth.users 
WHERE auth.users.email = 'gmaina424@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.users.id AND role = 'admin'
);
