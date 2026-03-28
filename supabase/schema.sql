-- =============================================
-- PixelForge Image Editor - Supabase Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Edit History Table
CREATE TABLE IF NOT EXISTS edit_history (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_url  TEXT NOT NULL,
  edited_url    TEXT NOT NULL,
  edit_type     TEXT NOT NULL CHECK (edit_type IN ('compression', 'crop', 'format', 'combined')),
  format        TEXT NOT NULL CHECK (format IN ('jpg', 'jpeg', 'png', 'gif', 'webp')),
  original_size BIGINT,
  edited_size   BIGINT,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_edit_history_user_id ON edit_history(user_id);
CREATE INDEX IF NOT EXISTS idx_edit_history_created_at ON edit_history(user_id, created_at DESC);

-- Row Level Security
ALTER TABLE edit_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own history
CREATE POLICY "Users can view own history"
  ON edit_history FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own records
CREATE POLICY "Users can insert own history"
  ON edit_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own records
CREATE POLICY "Users can delete own history"
  ON edit_history FOR DELETE
  USING (auth.uid() = user_id);

-- Function to enforce max 10 records per user (auto-delete oldest)
CREATE OR REPLACE FUNCTION enforce_history_limit()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM edit_history
  WHERE id IN (
    SELECT id FROM edit_history
    WHERE user_id = NEW.user_id
    ORDER BY created_at DESC
    OFFSET 10
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to enforce limit after each insert
CREATE TRIGGER enforce_history_limit_trigger
  AFTER INSERT ON edit_history
  FOR EACH ROW
  EXECUTE FUNCTION enforce_history_limit();

-- =============================================
-- STORAGE SETUP (run these or do it via UI)
-- =============================================
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create a bucket named: images
-- 3. Set it to PUBLIC
-- 4. Add the following storage policies:

-- Allow authenticated users to upload to their own folder
-- (Set these via Storage > images bucket > Policies)

-- INSERT policy: authenticated
-- USING: bucket_id = 'images' AND auth.role() = 'authenticated'

-- SELECT policy: public (anyone can view)
-- USING: bucket_id = 'images'

-- DELETE policy: owner only
-- USING: bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]