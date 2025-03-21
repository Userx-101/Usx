-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  date_of_birth DATE,
  insurance_provider TEXT,
  insurance_id TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id),
  title TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  procedure TEXT,
  notes TEXT,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create treatments table
CREATE TABLE IF NOT EXISTS treatment_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id),
  name TEXT NOT NULL,
  total_cost DECIMAL(10, 2),
  notes TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create treatment procedures table
CREATE TABLE IF NOT EXISTS treatment_procedures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  treatment_plan_id UUID REFERENCES treatment_plans(id),
  name TEXT NOT NULL,
  code TEXT,
  cost DECIMAL(10, 2) NOT NULL,
  description TEXT,
  duration INTEGER,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  current_stock INTEGER NOT NULL,
  min_stock INTEGER NOT NULL,
  max_stock INTEGER NOT NULL,
  unit TEXT NOT NULL,
  category TEXT,
  supplier TEXT,
  last_ordered DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user settings table
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  time_format TEXT DEFAULT '24h',
  language TEXT DEFAULT 'fr',
  theme TEXT DEFAULT 'light',
  notification_email BOOLEAN DEFAULT true,
  notification_sms BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create procedure templates table
CREATE TABLE IF NOT EXISTS procedure_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  description TEXT,
  duration INTEGER,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedure_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all patients" ON patients FOR SELECT USING (true);
CREATE POLICY "Users can insert patients" ON patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update patients" ON patients FOR UPDATE USING (true);

CREATE POLICY "Users can view all appointments" ON appointments FOR SELECT USING (true);
CREATE POLICY "Users can insert appointments" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update appointments" ON appointments FOR UPDATE USING (true);

CREATE POLICY "Users can view all treatment_plans" ON treatment_plans FOR SELECT USING (true);
CREATE POLICY "Users can insert treatment_plans" ON treatment_plans FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update treatment_plans" ON treatment_plans FOR UPDATE USING (true);

CREATE POLICY "Users can view all treatment_procedures" ON treatment_procedures FOR SELECT USING (true);
CREATE POLICY "Users can insert treatment_procedures" ON treatment_procedures FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update treatment_procedures" ON treatment_procedures FOR UPDATE USING (true);

CREATE POLICY "Users can view all inventory" ON inventory FOR SELECT USING (true);
CREATE POLICY "Users can insert inventory" ON inventory FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update inventory" ON inventory FOR UPDATE USING (true);

CREATE POLICY "Users can view their own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view all procedure_templates" ON procedure_templates FOR SELECT USING (true);
CREATE POLICY "Users can insert procedure_templates" ON procedure_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update procedure_templates" ON procedure_templates FOR UPDATE USING (true);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE patients;
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE treatment_plans;
ALTER PUBLICATION supabase_realtime ADD TABLE treatment_procedures;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE user_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE procedure_templates;