-- Create storage bucket for wedding media
INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-media', 'wedding-media', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies to allow public access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'wedding-media');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'wedding-media');

CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'wedding-media');

CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'wedding-media');
