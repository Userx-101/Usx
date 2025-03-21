-- First, clear all data from tables
TRUNCATE TABLE profiles CASCADE;
TRUNCATE TABLE user_settings CASCADE;
TRUNCATE TABLE patients CASCADE;
TRUNCATE TABLE appointments CASCADE;
TRUNCATE TABLE treatment_plans CASCADE;
TRUNCATE TABLE treatment_procedures CASCADE;
TRUNCATE TABLE patient_files CASCADE;
TRUNCATE TABLE inventory_items CASCADE;

-- Add created_by and updated_by columns to all tables if they don't exist
DO $$ 
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid();', t);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) DEFAULT auth.uid();', t);
  END LOOP;
END $$;

-- Create trigger function to automatically set created_by and updated_by
CREATE OR REPLACE FUNCTION public.set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_by = auth.uid();
    NEW.updated_by = auth.uid();
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.updated_by = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for all tables
DO $$ 
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_user_id_trigger ON %I;', t);
    EXECUTE format('CREATE TRIGGER set_user_id_trigger BEFORE INSERT OR UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_user_id();', t);
  END LOOP;
END $$;

-- Enable RLS on all tables
DO $$ 
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
    
    -- Create policy for users to see only their own data
    EXECUTE format('DROP POLICY IF EXISTS user_isolation ON %I;', t);
    EXECUTE format('CREATE POLICY user_isolation ON %I FOR ALL USING (created_by = auth.uid());', t);
  END LOOP;
END $$;

-- Add realtime to all tables
DO $$ 
DECLARE
  t text;
  cmd text;
  result boolean;
BEGIN
  FOR t IN 
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
  LOOP
    -- Check if table is already in the publication
    SELECT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = t
    ) INTO result;
    
    -- Only add if not already in publication
    IF NOT result THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I;', t);
    END IF;
  END LOOP;
END $$;