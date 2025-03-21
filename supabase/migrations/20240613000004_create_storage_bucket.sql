-- Create storage bucket for patient files if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('patient-files', 'patient-files', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy to allow authenticated users to upload files
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'patient-files');

-- Set up storage policy to allow authenticated users to select their own files
DROP POLICY IF EXISTS "Allow authenticated users to select files" ON storage.objects;
CREATE POLICY "Allow authenticated users to select files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'patient-files');

-- Set up storage policy to allow authenticated users to update their own files
DROP POLICY IF EXISTS "Allow authenticated users to update files" ON storage.objects;
CREATE POLICY "Allow authenticated users to update files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'patient-files');

-- Set up storage policy to allow authenticated users to delete their own files
DROP POLICY IF EXISTS "Allow authenticated users to delete files" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'patient-files');

-- Set up storage policy to allow public access to files
DROP POLICY IF EXISTS "Allow public access to files" ON storage.objects;
CREATE POLICY "Allow public access to files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'patient-files');
