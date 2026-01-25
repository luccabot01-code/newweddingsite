-- Create events table for storing wedding event configurations
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Couple Names',
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  city TEXT NOT NULL DEFAULT 'City',
  rsvp_deadline DATE,
  bride_phone TEXT,
  groom_phone TEXT,
  hero_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create story_milestones table for timeline events
CREATE TABLE IF NOT EXISTS story_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create venues table for ceremony and party locations
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('ceremony', 'party')),
  name TEXT,
  address TEXT,
  time TEXT,
  map_embed_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rsvp_responses table
CREATE TABLE IF NOT EXISTS rsvp_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  guest_count INTEGER DEFAULT 1,
  attending TEXT NOT NULL CHECK (attending IN ('yes', 'no')),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content_settings table for customizable text
CREATE TABLE IF NOT EXISTS content_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
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
CREATE INDEX IF NOT EXISTS idx_story_milestones_event_id ON story_milestones(event_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_event_id ON gallery_images(event_id);
CREATE INDEX IF NOT EXISTS idx_venues_event_id ON venues(event_id);
CREATE INDEX IF NOT EXISTS idx_rsvp_responses_event_id ON rsvp_responses(event_id);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow public read access for wedding pages (guests viewing the site)
CREATE POLICY "Allow public read access to events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public read access to story_milestones" ON story_milestones FOR SELECT USING (true);
CREATE POLICY "Allow public read access to gallery_images" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Allow public read access to venues" ON venues FOR SELECT USING (true);
CREATE POLICY "Allow public read access to content_settings" ON content_settings FOR SELECT USING (true);

-- RLS Policies: Allow public insert for RSVP responses (guests submitting RSVP)
CREATE POLICY "Allow public insert to rsvp_responses" ON rsvp_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to rsvp_responses" ON rsvp_responses FOR SELECT USING (true);

-- RLS Policies: Allow all operations for now (in production, restrict to authenticated admins)
CREATE POLICY "Allow all operations on events" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on story_milestones" ON story_milestones FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on gallery_images" ON gallery_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on venues" ON venues FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on content_settings" ON content_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete on rsvp_responses" ON rsvp_responses FOR DELETE USING (true);
