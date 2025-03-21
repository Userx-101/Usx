-- Ensure patients table has all required fields
ALTER TABLE IF EXISTS patients
ADD COLUMN IF NOT EXISTS national_id TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add realtime support for patients
alter publication supabase_realtime add table patients;
