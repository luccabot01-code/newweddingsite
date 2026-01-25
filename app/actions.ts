"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { put } from "@vercel/blob"

// Get all events
export async function getEvents() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("wedding_sites").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching events:", error)
      return []
    }
    return data || []
  } catch (err) {
    console.error("[v0] Exception in getEvents:", err)
    return []
  }
}

// Get event by slug with all related data
export async function getEventBySlug(slug: string) {
  const supabase = await createClient()

  const { data: event, error: eventError } = await supabase.from("wedding_sites").select("*").eq("slug", slug).single()

  if (eventError || !event) {
    return null
  }

  const [storyResult, galleryResult, venuesResult, contentResult] = await Promise.all([
    supabase.from("wedding_story_milestones").select("*").eq("event_id", event.id).order("sort_order"),
    supabase.from("wedding_gallery_images").select("*").eq("event_id", event.id).order("sort_order"),
    supabase.from("wedding_venues").select("*").eq("event_id", event.id),
    supabase.from("wedding_content_settings").select("*").eq("event_id", event.id).single(),
  ])

  const venues = venuesResult.data || []
  const ceremony = venues.find((v) => v.type === "ceremony") || null
  const party = venues.find((v) => v.type === "party") || null

  return {
    event,
    story: storyResult.data || [],
    gallery: galleryResult.data || [],
    venues: { ceremony, party },
    content: contentResult.data || getDefaultContent(event.id),
  }
}

function getDefaultContent(eventId: string) {
  return {
    id: "",
    event_id: eventId,
    story_title: "How it began",
    story_subtitle: "Our Journey",
    gallery_title: "Gallery",
    gallery_subtitle: "Captured Moments",
    rsvp_title: "RSVP",
    rsvp_subtitle: "Join Us",
    rsvp_button_text: "Confirm Attendance",
    thank_you_message: "Thank you!",
    thank_you_submessage: "We can't wait to celebrate with you.",
    scroll_indicator: "Scroll to Explore",
    ceremony_title: "Ceremony",
    party_title: "Party",
    created_at: new Date().toISOString(),
  }
}

// Create a new event
export async function createEvent(slug: string) {
  console.log("[v0] Creating event with slug:", slug)
  const supabase = await createClient()

  try {
    // Check if slug already exists
    const { data: existing, error: checkError } = await supabase.from("wedding_sites").select("slug").eq("slug", slug).single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("[v0] Error checking existing slug:", checkError)
      return { success: false, message: `Database error: ${checkError.message}` }
    }

    if (existing) {
      console.log("[v0] Slug already exists:", slug)
      return { success: false, message: "This URL is already taken" }
    }

    const eventData = {
      slug,
      name: slug.replace(/^\//, "").replace(/-/g, " "),
      date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      city: "",
      rsvp_deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      hero_image_url: null,
      hero_video_url: null,
    }

    console.log("[v0] Inserting event:", eventData)

    const { data: event, error: eventError } = await supabase.from("wedding_sites").insert(eventData).select().single()

    if (eventError) {
      console.error("[v0] Error creating event:", eventError)
      return { success: false, message: `Failed to create event: ${eventError.message}` }
    }

    if (!event) {
      console.error("[v0] No event returned after insert")
      return { success: false, message: "Failed to create event: No data returned" }
    }

    console.log("[v0] Event created successfully:", event.id)

    const { error: contentError } = await supabase.from("wedding_content_settings").insert({
      event_id: event.id,
    })

    if (contentError) {
      console.error("[v0] Error creating content settings:", contentError)
    }

    console.log("[v0] Event setup complete")
    revalidatePath("/admin")
    return { success: true, slug }
  } catch (err) {
    console.error("[v0] Exception in createEvent:", err)
    return { success: false, message: `Unexpected error: ${err instanceof Error ? err.message : String(err)}` }
  }
}

// Delete event
export async function deleteEvent(slug: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("wedding_sites").delete().eq("slug", slug)

  if (error) {
    return { success: false, message: "Failed to delete event" }
  }

  revalidatePath("/admin")
  return { success: true }
}

// Update event
export async function updateEvent(
  slug: string,
  data: {
    title?: string
    subtitle?: string
    date?: string
    time?: string
    location?: string
    description?: string
    image_url?: string
    custom_message?: string
    name?: string
    city?: string
    rsvp_deadline?: string
    bride_phone?: string
    groom_phone?: string
    hero_video_url?: string
  },
) {
  const supabase = await createClient()

  const updateData: any = { updated_at: new Date().toISOString() }

  if (data.title !== undefined) updateData.name = data.title // 'title' param maps to 'name' column
  if (data.name !== undefined) updateData.name = data.name
  if (data.subtitle !== undefined) updateData.subtitle = data.subtitle
  if (data.date !== undefined) updateData.date = data.date
  if (data.time !== undefined) updateData.time = data.time
  if (data.location !== undefined) updateData.city = data.location // 'location' param maps to 'city' column
  if (data.city !== undefined) updateData.city = data.city
  if (data.description !== undefined) updateData.description = data.description
  if (data.image_url !== undefined) updateData.hero_image_url = data.image_url
  if (data.custom_message !== undefined) updateData.custom_message = data.custom_message
  if (data.rsvp_deadline !== undefined) updateData.rsvp_deadline = data.rsvp_deadline
  if (data.bride_phone !== undefined) updateData.bride_phone = data.bride_phone
  if (data.groom_phone !== undefined) updateData.groom_phone = data.groom_phone
  if (data.hero_video_url !== undefined) updateData.hero_video_url = data.hero_video_url

  const { error } = await supabase.from("wedding_sites").update(updateData).eq("slug", slug)

  if (error) {
    console.error("[v0] Error updating event:", error)
    return { success: false, message: "Failed to update event" }
  }

  revalidatePath(`/${slug}`)
  revalidatePath(`/${slug}/dashboard`)
  revalidatePath("/admin")
  return { success: true }
}

// Update story milestones
export async function updateStoryMilestones(
  eventId: string,
  milestones: { year: string; title: string; description: string }[],
) {
  const supabase = await createClient()

  // Delete existing milestones
  await supabase.from("wedding_story_milestones").delete().eq("event_id", eventId)

  // Insert new milestones
  const { error } = await supabase.from("wedding_story_milestones").insert(
    milestones.map((m, index) => ({
      event_id: eventId,
      year: m.year,
      title: m.title,
      description: m.description,
      sort_order: index,
    })),
  )

  if (error) {
    return { success: false, message: "Failed to update milestones" }
  }

  return { success: true }
}

// Update content settings
export async function updateContentSettings(
  eventId: string,
  data: {
    story_title?: string
    story_subtitle?: string
    gallery_title?: string
    gallery_subtitle?: string
  },
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("wedding_content_settings")
    .upsert({ event_id: eventId, ...data }, { onConflict: "event_id" })

  if (error) {
    return { success: false, message: "Failed to update content settings" }
  }

  return { success: true }
}

// Add gallery image
export async function addGalleryImage(eventId: string, imageUrl: string) {
  const supabase = await createClient()

  const { data: maxOrder } = await supabase
    .from("wedding_gallery_images")
    .select("sort_order")
    .eq("event_id", eventId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single()

  const { error } = await supabase.from("wedding_gallery_images").insert({
    event_id: eventId,
    image_url: imageUrl,
    sort_order: (maxOrder?.sort_order || 0) + 1,
  })

  if (error) {
    console.error("[v0] Error adding gallery image:", error)
    return { success: false, message: "Failed to add image" }
  }

  const { data: event } = await supabase.from("wedding_sites").select("slug").eq("id", eventId).single()

  if (event?.slug) {
    revalidatePath(`/${event.slug}`)
    revalidatePath(`/${event.slug}/dashboard`)
  }

  return { success: true }
}

// Delete gallery image
export async function deleteGalleryImage(imageId: string) {
  const supabase = await createClient()

  const { data: image } = await supabase.from("wedding_gallery_images").select("event_id").eq("id", imageId).single()

  const { error } = await supabase.from("wedding_gallery_images").delete().eq("id", imageId)

  if (error) {
    console.error("[v0] Error deleting gallery image:", error)
    return { success: false, message: "Failed to delete image" }
  }

  if (image?.event_id) {
    const { data: event } = await supabase.from("wedding_sites").select("slug").eq("id", image.event_id).single()

    if (event?.slug) {
      revalidatePath(`/${event.slug}`)
      revalidatePath(`/${event.slug}/dashboard`)
    }
  }

  return { success: true }
}

// Submit RSVP
export async function submitRSVP(
  slug: string,
  data: {
    name?: string
    email?: string
    phone?: string
    guests?: string
    attending?: string
    message?: string
  },
) {
  const supabase = await createClient()

  // Get event ID from slug
  const { data: event } = await supabase.from("wedding_sites").select("id").eq("slug", slug).single()

  if (!event) {
    return { success: false, message: "Event not found" }
  }

  const { error } = await supabase.from("wedding_rsvp_submissions").insert({
    event_id: event.id,
    full_name: data.name || "",
    email: data.email || "",
    phone: data.phone || null,
    guest_count: Number.parseInt(data.guests || "1"),
    attending: data.attending || "yes",
    message: data.message || null,
  })

  if (error) {
    return { success: false, message: "Failed to submit RSVP" }
  }

  return { success: true }
}

// Get RSVPs for an event
export async function getRsvpsBySlug(slug: string) {
  const supabase = await createClient()

  const { data: event } = await supabase.from("wedding_sites").select("id").eq("slug", slug).single()

  if (!event) {
    return []
  }

  const { data, error } = await supabase
    .from("wedding_rsvp_submissions")
    .select("*")
    .eq("event_id", event.id)
    .order("created_at", { ascending: false })

  if (error) {
    return []
  }

  return data
}

// Delete RSVP
export async function deleteRsvp(rsvpId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("wedding_rsvp_submissions").delete().eq("id", rsvpId)

  if (error) {
    return { success: false, message: "Failed to delete RSVP" }
  }

  return { success: true }
}

// Update venues
export async function updateVenue(
  eventId: string,
  type: "ceremony" | "party",
  data: {
    name?: string
    address?: string
    time?: string
    map_embed_url?: string
  },
) {
  const supabase = await createClient()

  const { data: event } = await supabase.from("wedding_sites").select("slug").eq("id", eventId).single()

  // Check if venue exists
  const { data: existing } = await supabase
    .from("wedding_venues")
    .select("id")
    .eq("event_id", eventId)
    .eq("type", type)
    .single()

  if (existing) {
    // Update existing venue
    const { error } = await supabase.from("wedding_venues").update(data).eq("id", existing.id)

    if (error) {
      console.error("[v0] Error updating venue:", error)
      return { success: false, message: "Failed to update venue" }
    }
  } else {
    // Insert new venue
    const { error } = await supabase.from("wedding_venues").insert({
      event_id: eventId,
      type,
      ...data,
    })

    if (error) {
      console.error("[v0] Error creating venue:", error)
      return { success: false, message: "Failed to create venue" }
    }
  }

  if (event?.slug) {
    revalidatePath(`/${event.slug}`)
    revalidatePath(`/${event.slug}/dashboard`)
  }
  revalidatePath("/")

  return { success: true }
}

// Upload image to Vercel Blob
export async function uploadImageToBlob(formData: FormData) {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return { success: false, message: "No file provided" }
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
    })

    return { success: true, url: blob.url }
  } catch (error) {
    console.error("[v0] Error uploading to blob:", error)
    return { success: false, message: "Failed to upload image" }
  }
}
