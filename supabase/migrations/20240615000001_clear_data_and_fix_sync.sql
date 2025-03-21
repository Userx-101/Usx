-- Clear all data from tables but keep the structure

-- First disable triggers to avoid foreign key constraints
ALTER TABLE IF EXISTS patients DISABLE TRIGGER ALL;
ALTER TABLE IF EXISTS appointments DISABLE TRIGGER ALL;
ALTER TABLE IF EXISTS treatment_plans DISABLE TRIGGER ALL;
ALTER TABLE IF EXISTS treatment_procedures DISABLE TRIGGER ALL;
ALTER TABLE IF EXISTS procedure_templates DISABLE TRIGGER ALL;
ALTER TABLE IF EXISTS inventory_items DISABLE TRIGGER ALL;
ALTER TABLE IF EXISTS patient_files DISABLE TRIGGER ALL;
ALTER TABLE IF EXISTS user_settings DISABLE TRIGGER ALL;
ALTER TABLE IF EXISTS practice_settings DISABLE TRIGGER ALL;

-- Clear data from tables
TRUNCATE TABLE patients CASCADE;
TRUNCATE TABLE appointments CASCADE;
TRUNCATE TABLE treatment_plans CASCADE;
TRUNCATE TABLE treatment_procedures CASCADE;
TRUNCATE TABLE procedure_templates CASCADE;
TRUNCATE TABLE inventory_items CASCADE;
TRUNCATE TABLE patient_files CASCADE;
TRUNCATE TABLE user_settings CASCADE;
TRUNCATE TABLE practice_settings CASCADE;

-- Re-enable triggers
ALTER TABLE IF EXISTS patients ENABLE TRIGGER ALL;
ALTER TABLE IF EXISTS appointments ENABLE TRIGGER ALL;
ALTER TABLE IF EXISTS treatment_plans ENABLE TRIGGER ALL;
ALTER TABLE IF EXISTS treatment_procedures ENABLE TRIGGER ALL;
ALTER TABLE IF EXISTS procedure_templates ENABLE TRIGGER ALL;
ALTER TABLE IF EXISTS inventory_items ENABLE TRIGGER ALL;
ALTER TABLE IF EXISTS patient_files ENABLE TRIGGER ALL;
ALTER TABLE IF EXISTS user_settings ENABLE TRIGGER ALL;
ALTER TABLE IF EXISTS practice_settings ENABLE TRIGGER ALL;

-- Ensure all tables have proper RLS policies for user isolation
-- This ensures each user only sees their own data

-- For patients table
DROP POLICY IF EXISTS "Users can only see their own patients" ON patients;
CREATE POLICY "Users can only see their own patients"
  ON patients
  FOR ALL
  USING (created_by = auth.uid());

-- For appointments table
DROP POLICY IF EXISTS "Users can only see their own appointments" ON appointments;
CREATE POLICY "Users can only see their own appointments"
  ON appointments
  FOR ALL
  USING (created_by = auth.uid());

-- For treatment_plans table
DROP POLICY IF EXISTS "Users can only see their own treatment plans" ON treatment_plans;
CREATE POLICY "Users can only see their own treatment plans"
  ON treatment_plans
  FOR ALL
  USING (created_by = auth.uid());

-- For treatment_procedures table
DROP POLICY IF EXISTS "Users can only see their own treatment procedures" ON treatment_procedures;
CREATE POLICY "Users can only see their own treatment procedures"
  ON treatment_procedures
  FOR ALL
  USING (treatment_plan_id IN (SELECT id FROM treatment_plans WHERE created_by = auth.uid()));

-- For procedure_templates table
DROP POLICY IF EXISTS "Users can only see their own procedure templates" ON procedure_templates;
CREATE POLICY "Users can only see their own procedure templates"
  ON procedure_templates
  FOR ALL
  USING (created_by = auth.uid());

-- For inventory_items table
DROP POLICY IF EXISTS "Users can only see their own inventory items" ON inventory_items;
CREATE POLICY "Users can only see their own inventory items"
  ON inventory_items
  FOR ALL
  USING (created_by = auth.uid());

-- For patient_files table
DROP POLICY IF EXISTS "Users can only see their own patient files" ON patient_files;
CREATE POLICY "Users can only see their own patient files"
  ON patient_files
  FOR ALL
  USING (created_by = auth.uid());

-- For user_settings table
DROP POLICY IF EXISTS "Users can only see their own settings" ON user_settings;
CREATE POLICY "Users can only see their own settings"
  ON user_settings
  FOR ALL
  USING (user_id = auth.uid());

-- For practice_settings table
DROP POLICY IF EXISTS "Users can only see their own practice settings" ON practice_settings;
CREATE POLICY "Users can only see their own practice settings"
  ON practice_settings
  FOR ALL
  USING (created_by = auth.uid());

-- Enable Row Level Security on all tables
ALTER TABLE IF EXISTS patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS treatment_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS procedure_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS patient_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS practice_settings ENABLE ROW LEVEL SECURITY;

-- Ensure all tables have created_by and updated_by columns for tracking
-- Only add if they don't exist

DO $$
BEGIN
  -- Add created_by to tables if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'created_by') THEN
    ALTER TABLE patients ADD COLUMN created_by UUID REFERENCES auth.users(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'created_by') THEN
    ALTER TABLE appointments ADD COLUMN created_by UUID REFERENCES auth.users(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'treatment_plans' AND column_name = 'created_by') THEN
    ALTER TABLE treatment_plans ADD COLUMN created_by UUID REFERENCES auth.users(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'procedure_templates' AND column_name = 'created_by') THEN
    ALTER TABLE procedure_templates ADD COLUMN created_by UUID REFERENCES auth.users(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory_items' AND column_name = 'created_by') THEN
    ALTER TABLE inventory_items ADD COLUMN created_by UUID REFERENCES auth.users(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_files' AND column_name = 'created_by') THEN
    ALTER TABLE patient_files ADD COLUMN created_by UUID REFERENCES auth.users(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'practice_settings' AND column_name = 'created_by') THEN
    ALTER TABLE practice_settings ADD COLUMN created_by UUID REFERENCES auth.users(id);
  END IF;
  
  -- Add updated_by to tables if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'updated_by') THEN
    ALTER TABLE patients ADD COLUMN updated_by UUID REFERENCES auth.users(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'updated_by') THEN
    ALTER TABLE appointments ADD COLUMN updated_by UUID REFERENCES auth.users(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'treatment_plans' AND column_name = 'updated_by') THEN
    ALTER TABLE treatment_plans ADD COLUMN updated_by UUID REFERENCES auth.users(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'procedure_templates' AND column_name = 'updated_by') THEN
    ALTER TABLE procedure_templates ADD COLUMN updated_by UUID REFERENCES auth.users(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory_items' AND column_name = 'updated_by') THEN
    ALTER TABLE inventory_items ADD COLUMN updated_by UUID REFERENCES auth.users(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patient_files' AND column_name = 'updated_by') THEN
    ALTER TABLE patient_files ADD COLUMN updated_by UUID REFERENCES auth.users(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'practice_settings' AND column_name = 'updated_by') THEN
    ALTER TABLE practice_settings ADD COLUMN updated_by UUID REFERENCES auth.users(id);
  END IF;
END
$$;

-- Create triggers to automatically set created_by and updated_by

-- Function to set created_by and updated_by
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    NEW.created_by = auth.uid();
    NEW.updated_by = auth.uid();
  ELSIF (TG_OP = 'UPDATE') THEN
    NEW.updated_by = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS set_user_id_patients ON patients;
DROP TRIGGER IF EXISTS set_user_id_appointments ON appointments;
DROP TRIGGER IF EXISTS set_user_id_treatment_plans ON treatment_plans;
DROP TRIGGER IF EXISTS set_user_id_procedure_templates ON procedure_templates;
DROP TRIGGER IF EXISTS set_user_id_inventory_items ON inventory_items;
DROP TRIGGER IF EXISTS set_user_id_patient_files ON patient_files;
DROP TRIGGER IF EXISTS set_user_id_practice_settings ON practice_settings;

-- Create triggers
CREATE TRIGGER set_user_id_patients
  BEFORE INSERT OR UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION set_user_id();

CREATE TRIGGER set_user_id_appointments
  BEFORE INSERT OR UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION set_user_id();

CREATE TRIGGER set_user_id_treatment_plans
  BEFORE INSERT OR UPDATE ON treatment_plans
  FOR EACH ROW
  EXECUTE FUNCTION set_user_id();

CREATE TRIGGER set_user_id_procedure_templates
  BEFORE INSERT OR UPDATE ON procedure_templates
  FOR EACH ROW
  EXECUTE FUNCTION set_user_id();

CREATE TRIGGER set_user_id_inventory_items
  BEFORE INSERT OR UPDATE ON inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION set_user_id();

CREATE TRIGGER set_user_id_patient_files
  BEFORE INSERT OR UPDATE ON patient_files
  FOR EACH ROW
  EXECUTE FUNCTION set_user_id();

CREATE TRIGGER set_user_id_practice_settings
  BEFORE INSERT OR UPDATE ON practice_settings
  FOR EACH ROW
  EXECUTE FUNCTION set_user_id();