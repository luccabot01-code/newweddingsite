-- Create Mary & John wedding event with realistic pre-wedding data

-- Insert event
INSERT INTO wedding_sites (slug, name, date, city, rsvp_deadline, hero_image_url)
VALUES (
  'maryjohn',
  'Mary & John',
  '2026-08-15 16:00:00',
  'Santorini, Greece',
  '2026-07-15',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  date = EXCLUDED.date,
  city = EXCLUDED.city,
  rsvp_deadline = EXCLUDED.rsvp_deadline,
  hero_image_url = EXCLUDED.hero_image_url;

-- Get event ID
DO $$
DECLARE
  event_uuid UUID;
BEGIN
  SELECT id INTO event_uuid FROM wedding_sites WHERE slug = 'maryjohn';

  -- Delete existing data to refresh
  DELETE FROM wedding_gallery_images WHERE event_id = event_uuid;
  DELETE FROM wedding_story_milestones WHERE event_id = event_uuid;
  DELETE FROM wedding_venues WHERE event_id = event_uuid;
  DELETE FROM wedding_content_settings WHERE event_id = event_uuid;

  -- Insert venues
  INSERT INTO wedding_venues (event_id, type, name, address, time, map_embed_url)
  VALUES
    (event_uuid, 'ceremony', 'Santo Winery', 'Pyrgos Kallistis, Santorini 847 00, Greece', '4:00 PM', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3200.123456789!2d25.431!3d36.391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDIzJzI3LjYiTiAyNcKwMjUnNTEuNiJF!5e0!3m2!1sen!2sus!4v1234567890'),
    (event_uuid, 'party', 'Andronis Luxury Suites', 'Oia, Santorini 847 02, Greece', '7:00 PM', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3199.987654321!2d25.375!3d36.461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDI3JzM5LjYiTiAyNcKwMjInMzAuMCJF!5e0!3m2!1sen!2sus!4v0987654321');

  -- Insert content settings
  INSERT INTO wedding_content_settings (event_id, story_title, story_subtitle, gallery_subtitle, ceremony_title, party_title)
  VALUES (
    event_uuid,
    'Our Love Story',
    'From strangers to soulmates',
    'Captured moments of our journey together',
    'Ceremony',
    'Reception'
  );

  -- Adding 12 realistic story milestones
  INSERT INTO wedding_story_milestones (event_id, year, title, description, sort_order)
  VALUES
    (event_uuid, '2018', 'The Coffee Shop', 'It was a rainy Tuesday morning in October. Mary was reading "Pride and Prejudice" at Corner Brew when John accidentally spilled his latte on her table. What could have been awkward turned into three hours of non-stop conversation about books, travel dreams, and favorite pizza toppings.', 0),
    (event_uuid, '2018', 'First Date', 'Two weeks later, John took Mary to Mama Lucias Italian restaurant overlooking Elliott Bay. They shared spaghetti carbonara, watched the ferries cross the water, and talked until the restaurant closed. The waiter had to politely ask them to leave at midnight.', 1),
    (event_uuid, '2019', 'Becoming Official', 'On New Years Eve, under the Space Needle fireworks, John asked Mary to be his girlfriend. She said yes and they kissed as the clock struck midnight, beginning a year that would change everything.', 2),
    (event_uuid, '2019', 'First Adventure: Paris', 'For Marys birthday, they flew to Paris. They got lost in Montmartre, ate croissants for breakfast every day, kissed at the top of the Eiffel Tower, and promised each other many more adventures. This trip made them realize they wanted to see the world together.', 3),
    (event_uuid, '2020', 'Moving In Together', 'When the world shut down, they decided to quarantine together. What started as "lets see how this goes" turned into John officially moving into Marys apartment. They learned each others quirks, cooked together every night, and fell even more in love.', 4),
    (event_uuid, '2020', 'Cooper Joins the Family', 'In December, they adopted Cooper, a golden retriever puppy from a local shelter. Their first "baby" brought chaos, joy, and so much love into their home. Late night puppy walks became their favorite time to talk about their future.', 5),
    (event_uuid, '2022', 'Career Wins & Celebrations', 'Mary got promoted to Senior Marketing Director, and John launched his own architecture firm. They celebrated each milestone together, proving that they were not just lovers but true partners supporting each others dreams.', 6),
    (event_uuid, '2023', 'Greece: The Place They Fell in Love Again', 'They took two weeks to island hop in Greece. In Santorini, watching the famous sunset in Oia, John knew this was where he wanted to propose one day. Mary felt the same magic - this place stole both their hearts.', 7),
    (event_uuid, '2024', 'The Proposal', 'John brought Mary back to Santorini "for vacation". On the same cliff where they watched sunset a year before, he got down on one knee with a ring his grandmother had given him. Through happy tears, Mary said YES! They celebrated with champagne as the sun painted the sky in shades of pink and gold.', 8),
    (event_uuid, '2024', 'Engagement Celebrations', 'They threw an engagement party in Seattle, surrounded by family and friends who had been rooting for them since day one. Marys sister gave a tearful toast, and Johns best friend embarrassed him with stories from their college days.', 9),
    (event_uuid, '2025', 'Planning Our Dream Wedding', 'Between cake tastings, venue visits, and endless Pinterest boards, they planned every detail of their Santorini wedding. Every decision brought them closer, and they couldnt wait to celebrate their love with everyone who mattered.', 10),
    (event_uuid, '2026', 'Finally: Our Wedding Day', 'After eight years of loving each other through coffee spills, adventures, challenges, and countless everyday moments, they are finally getting married. In the place where they fell in love twice - once with Greece, and once all over again with each other.', 11);

  -- Adding 40+ gallery photos
  INSERT INTO wedding_gallery_images (event_id, image_url, sort_order)
  VALUES
    (event_uuid, 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', 1),
    (event_uuid, 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800', 2),
    (event_uuid, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', 3),
    (event_uuid, 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800', 4),
    (event_uuid, 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800', 5),
    (event_uuid, 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800', 6),
    (event_uuid, 'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=800', 7),
    (event_uuid, 'https://images.unsplash.com/photo-1543158119-e81966bde5f5?w=800', 8),
    (event_uuid, 'https://images.unsplash.com/photo-1529634806980-85c3dd6d7c6d?w=800', 9),
    (event_uuid, 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800', 10),
    (event_uuid, 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800', 11),
    (event_uuid, 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800', 12),
    (event_uuid, 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800', 13),
    (event_uuid, 'https://images.unsplash.com/photo-1530221932330-27d06b49c1e6?w=800', 14),
    (event_uuid, 'https://images.unsplash.com/photo-1609151162377-794faf68b02f?w=800', 15),
    (event_uuid, 'https://images.unsplash.com/photo-1623719059128-8165e2d08555?w=800', 16),
    (event_uuid, 'https://images.unsplash.com/photo-1525258512965-786b4e4f178b?w=800', 17),
    (event_uuid, 'https://images.unsplash.com/photo-1606800052052-a08af71488dd?w=800', 18),
    (event_uuid, 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800', 19),
    (event_uuid, 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800', 20),
    (event_uuid, 'https://images.unsplash.com/photo-1595032834257-07d4e2c6e1dc?w=800', 21),
    (event_uuid, 'https://images.unsplash.com/photo-1543159127-e8b0aa2c9edb?w=800', 22),
    (event_uuid, 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800', 23),
    (event_uuid, 'https://images.unsplash.com/photo-1483691278019-cb7253bee49f?w=800', 24),
    (event_uuid, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800', 25),
    (event_uuid, 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800', 26),
    (event_uuid, 'https://images.unsplash.com/photo-1535743686920-55e4145369b9?w=800', 27),
    (event_uuid, 'https://images.unsplash.com/photo-1494776849589-c3e1b930e5c2?w=800', 28),
    (event_uuid, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', 29),
    (event_uuid, 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800', 30),
    (event_uuid, 'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=800', 31),
    (event_uuid, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800', 32),
    (event_uuid, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', 33),
    (event_uuid, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', 34),
    (event_uuid, 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800', 35),
    (event_uuid, 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800', 36),
    (event_uuid, 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800', 37),
    (event_uuid, 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', 38),
    (event_uuid, 'https://images.unsplash.com/photo-1525258512965-786b4e4f178b?w=800', 39),
    (event_uuid, 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', 40);

END $$;
