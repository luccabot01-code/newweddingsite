export interface Event {
  id: string
  slug: string
  title: string
  subtitle: string | null
  date: string
  time: string
  location: string
  description: string | null
  image_url: string | null
  custom_message: string | null
  color_scheme: any | null
  user_id: string | null
  created_at: string
  updated_at: string | null
  hero_video_url?: string | null
}

export interface StoryMilestone {
  id: string
  event_id: string
  year: string
  title: string
  description: string | null
  image_url: string | null
  sort_order: number
  created_at: string
}

export interface GalleryImage {
  id: string
  event_id: string
  image_url: string
  sort_order: number
  created_at: string
}

export interface Venue {
  id: string
  event_id: string
  type: "ceremony" | "party"
  name: string | null
  address: string | null
  time: string | null
  map_embed_url: string | null
  created_at: string
}

export interface RsvpResponse {
  id: string
  event_id: string
  full_name: string
  email: string
  phone: string | null
  guest_count: number
  attending: "yes" | "no"
  message: string | null
  created_at: string
}

export interface ContentSettings {
  id: string
  event_id: string
  story_title: string
  story_subtitle: string
  gallery_title: string
  gallery_subtitle: string
  rsvp_title: string
  rsvp_subtitle: string
  rsvp_button_text: string
  thank_you_message: string
  thank_you_submessage: string
  scroll_indicator: string
  ceremony_title: string
  party_title: string
  created_at: string
}

export interface WeddingConfig {
  event: Event
  story: StoryMilestone[]
  gallery: GalleryImage[]
  venues: {
    ceremony: Venue | null
    party: Venue | null
  }
  content: ContentSettings
}
