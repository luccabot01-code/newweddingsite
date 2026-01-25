"use client"

import { MapPin, Clock } from "lucide-react"
import { motion } from "framer-motion"
import type { WeddingConfig } from "@/lib/types"

interface WeddingDetailsProps {
  venues: WeddingConfig["venues"]
  content: WeddingConfig["content"]
}

export function WeddingDetails({ venues, content }: WeddingDetailsProps) {
  const { ceremony, party } = venues

  const createMapsUrl = (address: string | null, name: string | null) => {
    if (!address && !name) return null
    const query = encodeURIComponent(`${name || ""} ${address || ""}`.trim())
    return `https://www.google.com/maps/search/?api=1&query=${query}`
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-[#FFF8F0] via-white to-[#FFF8F0] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6"
          >
            <img
              src="/images/default-wedding-hearts.png"
              alt="Hearts"
              className="w-16 h-16 md:w-20 md:h-20 mx-auto object-contain"
            />
          </motion.div>
          <h2
            className="font-serif text-5xl md:text-6xl text-stone-900 mb-4"
            style={{ fontFamily: "Great Vibes, cursive" }}
          >
            Wedding Details
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {ceremony && (
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-rose-100">
              <div className="text-center mb-6">
                <h3 className="text-3xl text-stone-900 mb-3" style={{ fontFamily: "Great Vibes, cursive" }}>
                  {content.ceremony_title}
                </h3>
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4A373] to-transparent mx-auto" />
              </div>

              {ceremony.time && (
                <div className="flex items-center gap-3 mb-4 text-stone-700">
                  <Clock className="w-5 h-5 text-stone-900" />
                  <span className="text-lg">{ceremony.time}</span>
                </div>
              )}

              {ceremony.name && (
                <div className="mb-4">
                  <h4 className="font-semibold text-xl text-stone-800 mb-1">{ceremony.name}</h4>
                  {ceremony.address && (
                    <div className="flex items-start gap-3 text-stone-600">
                      <MapPin className="w-5 h-5 text-stone-900 flex-shrink-0 mt-1" />
                      <a
                        href={createMapsUrl(ceremony.address, ceremony.name) || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="leading-relaxed hover:text-rose-600 transition-colors underline decoration-rose-300 hover:decoration-rose-600"
                      >
                        {ceremony.address}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {ceremony.map_embed_url && (
                <div className="mt-6 rounded-2xl overflow-hidden border border-rose-200">
                  <iframe
                    src={ceremony.map_embed_url}
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </div>
          )}

          {party && (
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-rose-100">
              <div className="text-center mb-6">
                <h3 className="text-3xl text-stone-900 mb-3" style={{ fontFamily: "Great Vibes, cursive" }}>
                  {content.party_title}
                </h3>
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4A373] to-transparent mx-auto" />
              </div>

              {party.time && (
                <div className="flex items-center gap-3 mb-4 text-stone-700">
                  <Clock className="w-5 h-5 text-stone-900" />
                  <span className="text-lg">{party.time}</span>
                </div>
              )}

              {party.name && (
                <div className="mb-4">
                  <h4 className="font-semibold text-xl text-stone-800 mb-1">{party.name}</h4>
                  {party.address && (
                    <div className="flex items-start gap-3 text-stone-600">
                      <MapPin className="w-5 h-5 text-stone-900 flex-shrink-0 mt-1" />
                      <a
                        href={createMapsUrl(party.address, party.name) || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="leading-relaxed hover:text-rose-600 transition-colors underline decoration-rose-300 hover:decoration-rose-600"
                      >
                        {party.address}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {party.map_embed_url && (
                <div className="mt-6 rounded-2xl overflow-hidden border border-rose-200">
                  <iframe
                    src={party.map_embed_url}
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
