-- Insert storage schema (required for storage buckets)
-- Note: This requires the storage schema to be enabled in your Supabase project

-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create city-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'city-images',
  'city-images',
  true,
  5242880, -- 5MB
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create post-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-images',
  'post-images',
  true,
  5242880, -- 5MB
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Enable RLS on storage.objects (already enabled by default, but we add policies)
-- Avatar policies
CREATE POLICY "Public avatar images are viewable by everyone"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- City images policies (public read/write for authenticated users)
CREATE POLICY "Public city images are viewable by everyone"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'city-images');

CREATE POLICY "Authenticated users can upload city images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'city-images');

CREATE POLICY "Authenticated users can update city images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'city-images')
  WITH CHECK (bucket_id = 'city-images');

CREATE POLICY "Authenticated users can delete city images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'city-images');

-- Post images policies
CREATE POLICY "Public post images are viewable by everyone"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'post-images');

CREATE POLICY "Authenticated users can upload post images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'post-images');

CREATE POLICY "Authenticated users can update post images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'post-images')
  WITH CHECK (bucket_id = 'post-images');

CREATE POLICY "Authenticated users can delete post images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'post-images');
