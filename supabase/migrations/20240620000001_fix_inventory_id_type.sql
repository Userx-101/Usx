-- Fix inventory table ID type issue
ALTER TABLE IF EXISTS inventory
ALTER COLUMN id TYPE uuid USING id::uuid;

-- Ensure inventory table has proper timestamps
ALTER TABLE IF EXISTS inventory
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add realtime support for inventory
alter publication supabase_realtime add table inventory;
