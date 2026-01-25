import Link from "next/link"
import { Heart, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <div className="w-16 h-16 bg-[#D4A373] rounded-2xl flex items-center justify-center mx-auto mb-8">
          <Heart className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-4xl md:text-6xl font-serif mb-6">Wedding Site Builder</h1>

        <p className="text-stone-400 text-lg mb-12 leading-relaxed">
          Create beautiful, personalized wedding websites for your special day. Manage RSVPs, share your story, and
          celebrate with your guests.
        </p>

        <Link
          href="/admin"
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-xl font-medium hover:bg-stone-200 transition-colors text-lg"
        >
          Go to Admin Hub
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}
