-- Create storage bucket for wedding media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'wedding-media', 
  'wedding-media', 
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to wedding-media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update wedding-media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete from wedding-media" ON storage.objects;

-- Set up storage policies to allow public access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'wedding-media');

CREATE POLICY "Anyone can upload to wedding-media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'wedding-media');

CREATE POLICY "Anyone can update wedding-media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'wedding-media');

CREATE POLICY "Anyone can delete from wedding-media"
ON storage.objects FOR DELETE
USING (bucket_id = 'wedding-media');
