"use client"

import { motion } from "framer-motion"
import { type FormEvent, useState } from "react"
import { cn } from "@/lib/utils"
import { submitRSVP } from "@/app/actions"
import type { Event, ContentSettings } from "@/lib/types"
import Image from "next/image"

interface RsvpProps {
  event: Event
  content: ContentSettings
  slug: string
}

export function Rsvp({ event, content, slug }: RsvpProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries()) as Record<string, string>

    await submitRSVP(slug, data)
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const formattedDeadline = event.rsvp_deadline
    ? new Date(event.rsvp_deadline).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""

  return (
    <section className="py-32 bg-[#F5F5F0] relative overflow-hidden" id="rsvp">
      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white p-8 md:p-16 shadow-2xl text-center border-t-4 border-[#D4A373]"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <Image
              src="/images/default-wedding-hearts.png"
              alt="Hearts"
              width={80}
              height={80}
              className="animate-pulse"
            />
          </motion.div>
          <span className="text-sm tracking-[0.3em] uppercase text-stone-500 block mb-3">{content.rsvp_subtitle}</span>
          <h2 className="font-serif text-5xl md:text-6xl text-stone-900 mb-8">{content.rsvp_title}</h2>
          {/* </CHANGE> */}
          {formattedDeadline && (
            <p className="text-stone-600 mb-10 font-light">Please respond by {formattedDeadline}.</p>
          )}

          {isSubmitted ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="font-serif text-2xl text-stone-800 mb-2">{content.thank_you_message}</h3>
              <p className="text-stone-600">{content.thank_you_submessage}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs uppercase tracking-widest text-stone-500">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  id="name"
                  name="name"
                  className="w-full bg-stone-50 border-b border-stone-300 p-3 focus:outline-none focus:border-[#D4A373] transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs uppercase tracking-widest text-stone-500">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  id="email"
                  name="email"
                  className="w-full bg-stone-50 border-b border-stone-300 p-3 focus:outline-none focus:border-[#D4A373] transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-xs uppercase tracking-widest text-stone-500">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full bg-stone-50 border-b border-stone-300 p-3 focus:outline-none focus:border-[#D4A373] transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="guests" className="text-xs uppercase tracking-widest text-stone-500">
                    Guests
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    className="w-full bg-stone-50 border-b border-stone-300 p-3 focus:outline-none focus:border-[#D4A373] transition-colors"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="attending" className="text-xs uppercase tracking-widest text-stone-500">
                    Attending
                  </label>
                  <select
                    id="attending"
                    name="attending"
                    className="w-full bg-stone-50 border-b border-stone-300 p-3 focus:outline-none focus:border-[#D4A373] transition-colors"
                  >
                    <option value="yes">Joyfully Accepts</option>
                    <option value="no">Regretfully Declines</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs uppercase tracking-widest text-stone-500">
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className="w-full bg-stone-50 border-b border-stone-300 p-3 focus:outline-none focus:border-[#D4A373] transition-colors resize-none"
                  placeholder="We are so happy for you!"
                />
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className={cn(
                  "w-full bg-[#333] text-white py-4 px-8 uppercase tracking-[0.2em] text-sm hover:bg-[#D4A373] transition-colors duration-500",
                  isSubmitting && "opacity-50 cursor-not-allowed",
                )}
              >
                {isSubmitting ? "Sending..." : content.rsvp_button_text}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
