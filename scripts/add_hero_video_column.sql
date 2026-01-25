-- Add hero_video_url column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS hero_video_url TEXT;
