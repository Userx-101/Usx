-- First add the created_by columns to tables if they don't exist
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

-- Now enable RLS and create policies
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

-- Create default policies that allow all operations for now
-- These can be replaced with more restrictive policies later
DROP POLICY IF EXISTS "Allow all operations on patients" ON patients;
CREATE POLICY "Allow all operations on patients"
  ON patients
  FOR ALL
  USING (true);

DROP POLICY IF EXISTS "Allow all operations on appointments" ON appointments;
CREATE POLICY "Allow all operations on appointments"
  ON appointments
  FOR ALL
  USING (true);

DROP POLICY IF EXISTS "Allow all operations on treatment_plans" ON treatment_plans;
CREATE POLICY "Allow all operations on treatment_plans"
  ON treatment_plans
  FOR ALL
  USING (true);

DROP POLICY IF EXISTS "Allow all operations on treatment_procedures" ON treatment_procedures;
CREATE POLICY "Allow all operations on treatment_procedures"
  ON treatment_procedures
  FOR ALL
  USING (true);

DROP POLICY IF EXISTS "Allow all operations on procedure_templates" ON procedure_templates;
CREATE POLICY "Allow all operations on procedure_templates"
  ON procedure_templates
  FOR ALL
  USING (true);

DROP POLICY IF EXISTS "Allow all operations on inventory_items" ON inventory_items;
CREATE POLICY "Allow all operations on inventory_items"
  ON inventory_items
  FOR ALL
  USING (true);

DROP POLICY IF EXISTS "Allow all operations on patient_files" ON patient_files;
CREATE POLICY "Allow all operations on patient_files"
  ON patient_files
  FOR ALL
  USING (true);

DROP POLICY IF EXISTS "Allow all operations on user_settings" ON user_settings;
CREATE POLICY "Allow all operations on user_settings"
  ON user_settings
  FOR ALL
  USING (true);

DROP POLICY IF EXISTS "Allow all operations on practice_settings" ON practice_settings;
CREATE POLICY "Allow all operations on practice_settings"
  ON practice_settings
  FOR ALL
  USING (true);

-- Create function to set user_id
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