"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { GalleryImage, ContentSettings } from "@/lib/types"

interface GalleryProps {
  gallery: GalleryImage[]
  content: ContentSettings
}

export function Gallery({ gallery, content }: GalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const autoScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const scrollAmount = container.clientWidth * 0.8

    setIsAutoScrollPaused(true)

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })

    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current)
    }
    autoScrollTimeoutRef.current = setTimeout(() => {
      setIsAutoScrollPaused(false)
    }, 2000)
  }

  useEffect(() => {
    return () => {
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.3 },
    )

    if (scrollContainerRef.current) {
      observer.observe(scrollContainerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInView || isAutoScrollPaused || gallery.length === 0) return

    let animationFrameId: number
    const scrollSpeed = 1 // pixel per frame (~60fps)

    const animate = () => {
      if (!scrollContainerRef.current) return

      const container = scrollContainerRef.current
      const currentScroll = container.scrollLeft
      const maxScroll = container.scrollWidth - container.clientWidth

      if (currentScroll >= maxScroll - 1) {
        container.scrollLeft = 0
      } else {
        container.scrollLeft = currentScroll + scrollSpeed
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isInView, isAutoScrollPaused, gallery.length])

  const handleMouseEnter = () => {
    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current)
    }
    setIsAutoScrollPaused(true)
  }

  const handleMouseLeave = () => {
    setIsAutoScrollPaused(false)
  }

  const handleTouchStart = () => {
    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current)
    }
    setIsAutoScrollPaused(true)
  }

  const handleTouchEnd = () => {
    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current)
    }
    autoScrollTimeoutRef.current = setTimeout(() => {
      setIsAutoScrollPaused(false)
    }, 2000)
  }

  if (gallery.length === 0) {
    return null
  }

  return (
    <section className="relative bg-stone-900 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-white text-4xl md:text-6xl mb-4" style={{ fontFamily: "Great Vibes, cursive" }}>
            {content.gallery_title}
          </h2>
          <p className="text-white/90 tracking-wide text-sm md:text-base max-w-2xl mx-auto italic">
            {content.gallery_subtitle}
          </p>
        </div>

        <div className="relative group">
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-stone-900 rounded-full p-2 md:p-3 shadow-xl transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide px-4 md:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {gallery.map((img) => (
              <ImageCard key={img.id} img={img} />
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-stone-900 rounded-full p-2 md:p-3 shadow-xl transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

function ImageCard({ img }: { img: GalleryImage }) {
  const [isError, setIsError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  if (isError) {
    return null
  }

  return (
    <div className="group relative h-[60vh] w-[85vw] md:h-[70vh] md:w-[45vw] lg:w-[40vw] flex-shrink-0 bg-neutral-800 overflow-hidden rounded-lg shadow-2xl">
      {!isLoaded && <div className="absolute inset-0 bg-neutral-800 animate-pulse" />}
      <Image
        src={img.image_url || "/placeholder.svg"}
        alt="Wedding gallery photo"
        fill
        className={`object-cover transition-all duration-700 group-hover:scale-110 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 40vw"
        unoptimized
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
      />
    </div>
  )
}
