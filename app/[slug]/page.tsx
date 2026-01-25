import { notFound, redirect } from "next/navigation"
import { getEventBySlug } from "@/app/actions"
import { Hero } from "@/components/wedding/hero"
import { OurStory } from "@/components/wedding/our-story"
import { Gallery } from "@/components/wedding/gallery"
import { WeddingDetails } from "@/components/wedding/wedding-details"
import { Rsvp } from "@/components/wedding/rsvp"
import { Footer } from "@/components/wedding/footer"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  if (slug === "admin" || slug === "_next" || slug === "api") {
    return {
      title: "Wedding Site Builder",
    }
  }

  try {
    const config = await getEventBySlug(slug)

    if (!config) {
      return {
        title: "Wedding Site Builder",
      }
    }

    return {
      title: config.event.name,
      description: `Wedding invitation for ${config.event.name}`,
    }
  } catch {
    return {
      title: "Wedding Site Builder",
    }
  }
}

export default async function WeddingPage({ params }: PageProps) {
  const { slug } = await params

  if (slug === "admin") {
    redirect("/admin")
  }

  if (slug === "_next" || slug === "api") {
    notFound()
  }

  try {
    const config = await getEventBySlug(slug)

    if (!config) {
      notFound()
    }

    return (
      <main className="min-h-screen">
        <Hero event={config.event} content={config.content} />
        <OurStory story={config.story} content={config.content} />
        <Gallery gallery={config.gallery} content={config.content} />
        <WeddingDetails venues={config.venues} content={config.content} />
        <Rsvp event={config.event} content={config.content} slug={slug} />
        <Footer event={config.event} />
      </main>
    )
  } catch (error) {
    console.error("[v0] Error loading event:", error)
    notFound()
  }
}
