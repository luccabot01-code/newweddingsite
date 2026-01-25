"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Plus, LayoutTemplate, ExternalLink, Settings, Loader2, Trash2, Lock } from "lucide-react"
import { Toaster, toast } from "sonner"
import { motion } from "framer-motion"
import { getEvents, createEvent, deleteEvent } from "@/app/actions"
import type { Event } from "@/lib/types"

export default function AdminHub() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [isCheckingPassword, setIsCheckingPassword] = useState(false)

  const [events, setEvents] = useState<Event[]>([])
  const [newSlug, setNewSlug] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)

  useEffect(() => {
    document.title = "flormontana"
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadEvents()
    }
  }, [isAuthenticated])

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsCheckingPassword(true)

    // Correct password: Flormontana.1997
    if (password === "mihail") {
      setIsAuthenticated(true)
      toast.success("Login successful!")
    } else {
      toast.error("Incorrect password!")
      setPassword("")
    }

    setIsCheckingPassword(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#09090b] text-stone-200 font-sans selection:bg-white/20 flex items-center justify-center p-4">
        <Toaster theme="dark" position="bottom-right" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-white/5 mx-auto">
              <Lock className="w-8 h-8 text-black" />
            </div>

            <h1 className="text-3xl font-bold text-white text-center mb-2">Admin Hub</h1>
            <p className="text-stone-400 text-center mb-8">Enter your password to continue</p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/30 transition-colors"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isCheckingPassword || !password}
                className="w-full bg-white text-black py-3 rounded-xl font-medium hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCheckingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  async function loadEvents() {
    try {
      setError(null)
      const data = await getEvents()
      setEvents(data || [])
    } catch (err) {
      console.error("Error loading events:", err)
      setError("Failed to load events. Please make sure the database tables are created.")
      setEvents([])
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newSlug) return

    setIsCreating(true)

    const res = await createEvent(newSlug)

    if (res.success) {
      toast.success("Event created successfully!")
      setNewSlug("")
      loadEvents()
    } else {
      toast.error(res.message || "Failed to create event")
    }
    setIsCreating(false)
  }

  function confirmDelete(slug: string) {
    setEventToDelete(slug)
    setDeleteModalOpen(true)
  }

  async function handleDelete() {
    if (!eventToDelete) return

    const slug = eventToDelete
    setDeleteModalOpen(false)
    const toastId = toast.loading("Deleting event...")
    const res = await deleteEvent(slug)

    if (res.success) {
      toast.success("Event deleted", { id: toastId })
      loadEvents()
    } else {
      toast.error("Failed to delete event", { id: toastId })
    }
    setEventToDelete(null)
  }

  const handleManageClick = (slug: string) => {
    console.log("[v0] Manage clicked for slug:", slug)
    console.log("[v0] Navigating to:", `/${slug}/dashboard`)
    window.location.href = `/${slug}/dashboard`
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-stone-200 font-sans selection:bg-white/20 p-8 md:p-12 lg:p-20 relative">
      <Toaster theme="dark" position="bottom-right" />

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#111] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Delete Event?</h3>
            <p className="text-stone-400 text-center text-sm mb-6">
              Are you sure you want to delete{" "}
              <span className="text-white font-mono bg-white/5 px-1 rounded">/{eventToDelete}</span>? This action cannot
              be undone.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-stone-200 hover:bg-stone-700 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors font-medium text-sm"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-white/5">
              <LayoutTemplate className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Admin Hub</h1>
            <p className="text-stone-400 text-lg max-w-xl leading-relaxed">
              Create and manage multiple wedding websites from a single control center. Each event gets a unique link
              and dashboard.
            </p>
          </div>

          <div className="bg-[#111] p-6 rounded-2xl border border-white/5 w-full md:w-auto md:min-w-[400px]">
            <h3 className="text-sm font-medium text-stone-400 uppercase tracking-widest mb-4">Create New Event</h3>
            <form onSubmit={handleCreate} className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 font-mono text-sm">/</span>
                <input
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="event-url-slug"
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white outline-none focus:border-white/30 transition-colors font-mono text-sm"
                />
              </div>
              <button
                disabled={isCreating || !newSlug}
                type="submit"
                className="bg-white text-black px-4 py-2 rounded-xl font-medium hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-stone-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={event.slug}
                className="group bg-[#111] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all hover:bg-[#151515] flex flex-col"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 font-bold text-sm">
                      {event.slug.substring(0, 2).toUpperCase()}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        new Date() > new Date(event.date)
                          ? "bg-red-500/10 text-red-500 border-red-500/10"
                          : "bg-green-500/10 text-green-500 border-green-500/10"
                      }`}
                    >
                      {new Date() > new Date(event.date) ? "Past Event" : "Upcoming"}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{event.name}</h3>
                  <p className="text-stone-500 font-mono text-sm mb-6">/{event.slug}</p>

                  <div className="space-y-1 text-sm text-stone-400 mb-8">
                    <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto mb-4">
                  <button
                    onClick={() => handleManageClick(event.slug)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-black rounded-xl font-medium hover:bg-stone-200 transition-colors text-sm cursor-pointer"
                  >
                    <Settings className="w-4 h-4" />
                    Manage
                  </button>
                  <a
                    href={`/${event.slug}`}
                    target="_blank"
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-white/10 text-stone-400 rounded-xl font-medium hover:bg-white/5 hover:text-white transition-colors text-sm group-hover:border-white/20"
                    rel="noreferrer"
                  >
                    <span className="truncate">View Site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="border-t border-white/5 pt-4 flex justify-center">
                  <button
                    onClick={() => confirmDelete(event.slug)}
                    className="flex items-center gap-2 text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete Event
                  </button>
                </div>
              </motion.div>
            ))}

            {events.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <p className="text-stone-500 text-lg">No events created yet.</p>
                <p className="text-stone-600">Use the form above to start your first event.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
