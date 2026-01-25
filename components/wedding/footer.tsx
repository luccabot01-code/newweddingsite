import { Heart } from "lucide-react"
import type { Event } from "@/lib/types"

interface FooterProps {
  event: Event
}

export function Footer({ event }: FooterProps) {
  const formattedDate = new Date(event.date).toISOString().split("T")[0]

  return (
    <footer className="bg-stone-900 text-stone-400 py-12 text-center">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-3xl mb-4 text-white">{event.name}</h2>
        <p className="text-sm uppercase tracking-widest mb-8">
          {formattedDate} • {event.city}
        </p>

        <div className="flex justify-center items-center gap-8 mb-8 text-sm md:text-base">
          <div className="flex flex-col gap-2">
            {event.bride_phone && <span>Bride: {event.bride_phone}</span>}
            {event.groom_phone && <span>Groom: {event.groom_phone}</span>}
          </div>
        </div>

        <div className="text-xs text-stone-600 flex items-center justify-center gap-2">
          <span>Made with</span>
          <Heart className="w-3 h-3 text-red-900 fill-red-900" />
          <span>for our special day</span>
        </div>
      </div>
    </footer>
  )
}
