"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Users, Check, X, Trash2, Loader2, Download } from "lucide-react"
import { Toaster, toast } from "sonner"
import { motion } from "framer-motion"
import { getEventBySlug, getRsvpsBySlug, deleteRsvp } from "@/app/actions"
import type { Event, RsvpResponse } from "@/lib/types"

export default function RsvpPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [event, setEvent] = useState<Event | null>(null)
  const [rsvps, setRsvps] = useState<RsvpResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileView, setIsMobileView] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<{ name: string; message: string } | null>(null)

  useEffect(() => {
    loadData()
    const checkMobile = () => setIsMobileView(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [slug])

  async function loadData() {
    const eventData = await getEventBySlug(slug)
    if (!eventData) {
      router.push("/admin")
      return
    }
    setEvent(eventData.event)

    const rsvpData = await getRsvpsBySlug(slug)
    setRsvps(rsvpData)
    setIsLoading(false)
  }

  async function handleDeleteRsvp(rsvpId: string) {
    const result = await deleteRsvp(rsvpId)
    if (result.success) {
      toast.success("RSVP deleted")
      loadData()
    } else {
      toast.error("Failed to delete RSVP")
    }
  }

  function exportToCsv() {
    const headers = ["Name", "Email", "Phone", "Guests", "Attending", "Message", "Date"]
    const rows = rsvps.map((r) => [
      r.full_name,
      r.email,
      r.phone || "",
      r.guest_count.toString(),
      r.attending,
      r.message || "",
      new Date(r.created_at).toLocaleDateString(),
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${slug}-rsvps.csv`
    a.click()
  }

  function truncateMessage(message: string, maxLength = 50) {
    if (message.length <= maxLength) return message
    return message.slice(0, maxLength) + "..."
  }

  const attendingCount = rsvps.filter((r) => r.attending === "yes").length
  const decliningCount = rsvps.filter((r) => r.attending === "no").length
  const totalGuests = rsvps.filter((r) => r.attending === "yes").reduce((sum, r) => sum + r.guest_count, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-stone-800 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 text-stone-900 p-4 md:p-8 lg:p-12">
      <Toaster theme="light" position="bottom-right" />

      {selectedMessage && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-stone-900">Message from</h3>
                <p className="text-sm text-stone-600">{selectedMessage.name}</p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-stone-600" />
              </button>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>
          </motion.div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="mb-8 md:mb-12">
          <a
            href={`/${slug}/dashboard`}
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors mb-4 md:mb-6 text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </a>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">RSVP Responses</h1>
              <p className="text-sm md:text-base text-stone-600">
                {event?.name} - {slug}
              </p>
            </div>
            <button
              onClick={exportToCsv}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-stone-200 rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm md:text-base text-stone-600">Attending</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-stone-900">{attendingCount}</p>
            <p className="text-xs md:text-sm text-stone-500">{totalGuests} total guests</p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-sm md:text-base text-stone-600">Declining</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-stone-900">{decliningCount}</p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm md:text-base text-stone-600">Total Responses</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-stone-900">{rsvps.length}</p>
          </div>
        </div>

        {/* RSVP List */}
        {isMobileView ? (
          <div className="space-y-4">
            {rsvps.map((rsvp) => (
              <motion.div
                key={rsvp.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-stone-900">{rsvp.full_name}</h3>
                    <p className="text-sm text-stone-600">{rsvp.email}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteRsvp(rsvp.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  {rsvp.phone && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">Phone:</span>
                      <span className="text-stone-900">{rsvp.phone}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-stone-500">Guests:</span>
                    <span className="text-stone-900">{rsvp.guest_count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500">Status:</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        rsvp.attending === "yes" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {rsvp.attending === "yes" ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {rsvp.attending === "yes" ? "Attending" : "Declined"}
                    </span>
                  </div>
                  {rsvp.message && (
                    <div className="pt-2 border-t border-stone-200">
                      <span className="text-stone-500">Message:</span>
                      <div className="mt-1">
                        <p className="text-stone-900">{truncateMessage(rsvp.message, 80)}</p>
                        {rsvp.message.length > 80 && (
                          <button
                            onClick={() => setSelectedMessage({ name: rsvp.full_name, message: rsvp.message! })}
                            className="text-xs text-rose-600 hover:text-rose-700 font-medium mt-1"
                          >
                            See More
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between text-xs pt-2 border-t border-stone-200">
                    <span className="text-stone-500">Date:</span>
                    <span className="text-stone-600">{new Date(rsvp.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {rsvps.length === 0 && (
              <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-500">
                No RSVP responses yet.
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50">
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-stone-600 font-medium">Name</th>
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-stone-600 font-medium">
                      Email
                    </th>
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-stone-600 font-medium">
                      Phone
                    </th>
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-stone-600 font-medium">
                      Guests
                    </th>
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-stone-600 font-medium">
                      Status
                    </th>
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-stone-600 font-medium">
                      Message
                    </th>
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-stone-600 font-medium">Date</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((rsvp) => (
                    <motion.tr
                      key={rsvp.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-stone-200 hover:bg-stone-50 transition-colors"
                    >
                      <td className="p-4 font-medium text-stone-900">{rsvp.full_name}</td>
                      <td className="p-4 text-stone-600">{rsvp.email}</td>
                      <td className="p-4 text-stone-600">{rsvp.phone || "-"}</td>
                      <td className="p-4 text-stone-900">{rsvp.guest_count}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            rsvp.attending === "yes" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {rsvp.attending === "yes" ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          {rsvp.attending === "yes" ? "Attending" : "Declined"}
                        </span>
                      </td>
                      <td className="p-4 text-stone-600 max-w-[200px]">
                        {rsvp.message ? (
                          <div>
                            <p className="truncate">{truncateMessage(rsvp.message, 50)}</p>
                            {rsvp.message.length > 50 && (
                              <button
                                onClick={() => setSelectedMessage({ name: rsvp.full_name, message: rsvp.message! })}
                                className="text-xs text-rose-600 hover:text-rose-700 font-medium mt-0.5"
                              >
                                See More
                              </button>
                            )}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-4 text-stone-500 text-sm">{new Date(rsvp.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDeleteRsvp(rsvp.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}

                  {rsvps.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-stone-500">
                        No RSVP responses yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
