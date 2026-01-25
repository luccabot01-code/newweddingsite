-- Create wedding_sites table for storing wedding event configurations
CREATE TABLE IF NOT EXISTS wedding_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Couple Names',
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  city TEXT NOT NULL DEFAULT 'City',
  rsvp_deadline DATE,
  bride_phone TEXT,
  groom_phone TEXT,
  hero_image_url TEXT,
  hero_video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create wedding_story_milestones table for timeline events
CREATE TABLE IF NOT EXISTS wedding_story_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES wedding_sites(id) ON DELETE CASCADE,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create wedding_gallery_images table
CREATE TABLE IF NOT EXISTS wedding_gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES wedding_sites(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create wedding_venues table for ceremony and party locations
CREATE TABLE IF NOT EXISTS wedding_venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES wedding_sites(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('ceremony', 'party')),
  name TEXT,
  address TEXT,
  time TEXT,
  map_embed_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create wedding_rsvp_submissions table
CREATE TABLE IF NOT EXISTS wedding_rsvp_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES wedding_sites(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  guest_count INTEGER DEFAULT 1,
  attending TEXT NOT NULL CHECK (attending IN ('yes', 'no')),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create wedding_content_settings table for customizable text
CREATE TABLE IF NOT EXISTS wedding_content_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES wedding_sites(id) ON DELETE CASCADE,
  story_title TEXT DEFAULT 'How it began',
  story_subtitle TEXT DEFAULT 'Our Journey',
  gallery_title TEXT DEFAULT 'Gallery',
  gallery_subtitle TEXT DEFAULT 'Captured Moments',
  rsvp_title TEXT DEFAULT 'RSVP',
  rsvp_subtitle TEXT DEFAULT 'Join Us',
  rsvp_button_text TEXT DEFAULT 'Confirm Attendance',
  thank_you_message TEXT DEFAULT 'Thank you!',
  thank_you_submessage TEXT DEFAULT 'We can''t wait to celebrate with you.',
  scroll_indicator TEXT DEFAULT 'Scroll to Explore',
  ceremony_title TEXT DEFAULT 'Ceremony',
  party_title TEXT DEFAULT 'Party',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_wedding_story_milestones_event_id ON wedding_story_milestones(event_id);
CREATE INDEX IF NOT EXISTS idx_wedding_gallery_images_event_id ON wedding_gallery_images(event_id);
CREATE INDEX IF NOT EXISTS idx_wedding_venues_event_id ON wedding_venues(event_id);
CREATE INDEX IF NOT EXISTS idx_wedding_rsvp_submissions_event_id ON wedding_rsvp_submissions(event_id);
CREATE INDEX IF NOT EXISTS idx_wedding_sites_slug ON wedding_sites(slug);

-- Enable Row Level Security
ALTER TABLE wedding_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_story_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_rsvp_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_content_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow public read access for wedding pages (guests viewing the site)
CREATE POLICY "Allow public read wedding_sites" ON wedding_sites FOR SELECT USING (true);
CREATE POLICY "Allow public read wedding_story_milestones" ON wedding_story_milestones FOR SELECT USING (true);
CREATE POLICY "Allow public read wedding_gallery_images" ON wedding_gallery_images FOR SELECT USING (true);
CREATE POLICY "Allow public read wedding_venues" ON wedding_venues FOR SELECT USING (true);
CREATE POLICY "Allow public read wedding_content_settings" ON wedding_content_settings FOR SELECT USING (true);

-- RLS Policies: Allow public insert for RSVP responses (guests submitting RSVP)
CREATE POLICY "Allow public insert wedding_rsvp_submissions" ON wedding_rsvp_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read wedding_rsvp_submissions" ON wedding_rsvp_submissions FOR SELECT USING (true);

-- RLS Policies: Allow all operations for now (in production, restrict to authenticated admins)
CREATE POLICY "Allow all operations wedding_sites" ON wedding_sites FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations wedding_story_milestones" ON wedding_story_milestones FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations wedding_gallery_images" ON wedding_gallery_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations wedding_venues" ON wedding_venues FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations wedding_content_settings" ON wedding_content_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete wedding_rsvp_submissions" ON wedding_rsvp_submissions FOR DELETE USING (true);
