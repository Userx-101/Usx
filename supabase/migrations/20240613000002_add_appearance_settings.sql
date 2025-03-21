-- Add appearance settings columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'accent_color') THEN
    ALTER TABLE user_settings ADD COLUMN accent_color TEXT DEFAULT 'blue';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'font_size') THEN
    ALTER TABLE user_settings ADD COLUMN font_size TEXT DEFAULT 'medium';
  END IF;
END $$;
