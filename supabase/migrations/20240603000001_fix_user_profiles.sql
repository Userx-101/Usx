-- Ensure profiles table has proper structure
ALTER TABLE IF EXISTS profiles
ADD COLUMN IF NOT EXISTS role VARCHAR(255);

-- Add missing columns to users table if needed
ALTER TABLE IF EXISTS users
ADD COLUMN IF NOT EXISTS role VARCHAR(255) DEFAULT 'user';

-- Create or update triggers for user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role, created_at, updated_at)
  VALUES (NEW.id, '', '', 'user', NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
