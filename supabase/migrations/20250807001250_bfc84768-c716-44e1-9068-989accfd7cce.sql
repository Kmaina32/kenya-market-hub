
-- 1) Replace the trigger function to insert 'user' instead of 'customer'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Insert profile with error handling
  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.created_at,
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert default user role (must comply with user_roles_role_check)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

-- 2) Ensure the trigger exists and points to the updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3) Optional backfill: normalize any legacy 'customer' roles to 'user'
UPDATE public.user_roles
SET role = 'user'
WHERE role = 'customer';

-- 4) Quick sanity checks (optional)
-- SELECT conname, pg_get_constraintdef(c.oid) AS def
-- FROM pg_constraint c
-- JOIN pg_class t ON c.conrelid=t.oid
-- JOIN pg_namespace n ON n.oid=t.relnamespace
-- WHERE t.relname='user_roles' AND n.nspname='public' AND c.contype='c';
--
-- SELECT role, count(*) FROM public.user_roles GROUP BY role ORDER BY count DESC;
