"use client"

import type React from "react"
import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  LayoutGrid,
  Heart,
  ImageIcon,
  Type,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  Users,
  Upload,
  Menu,
  X,
  QrCode,
  HelpCircle,
} from "lucide-react"
import { Toaster, toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  getEventBySlug,
  updateEvent,
  updateStoryMilestones,
  updateContentSettings,
  addGalleryImage,
  deleteGalleryImage,
  updateVenue,
} from "@/app/actions"
import type { WeddingConfig } from "@/lib/types"

type TabType = "general" | "story" | "gallery" | "content"

export default function DashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = use(params)
  const slug = unwrappedParams.slug
  const router = useRouter()

  const [config, setConfig] = useState<WeddingConfig | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>("general")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [heroUploading, setHeroUploading] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("")
  const [showHelpModal, setShowHelpModal] = useState(false) // Added help modal state

  const [formData, setFormData] = useState({
    partner1_name: "",
    partner2_name: "",
    date: "",
    city: "",
    rsvp_deadline: "",
    bride_phone: "",
    groom_phone: "",
    ceremony_name: "",
    ceremony_address: "",
    ceremony_time: "",
    ceremony_map: "",
    party_name: "",
    party_address: "",
    party_time: "",
    party_map: "",
    hero_image_url: "",
  })

  const [storyMilestones, setStoryMilestones] = useState<{ year: string; title: string; description: string }[]>([])

  const [contentData, setContentData] = useState({
    story_title: "",
    story_subtitle: "",
    ceremony_title: "",
    party_title: "",
    rsvp_subtitle: "",
  })

  const [newImageUrl, setNewImageUrl] = useState("")

  useEffect(() => {
    document.title = "flormontana"
    loadConfig()
  }, [slug])

  async function loadConfig() {
    console.log("[v0] Dashboard loading event for slug:", slug)
    const data = await getEventBySlug(slug)
    console.log("[v0] Event data received:", data ? "Found" : "Not found")

    if (!data) {
      console.log("[v0] Event not found, redirecting to /admin")
      router.push("/admin")
      return
    }

    console.log("[v0] Event loaded successfully:", data.event.name)
    setConfig(data)

    setFormData({
      partner1_name: data.event.name.split(" & ")[0] || "",
      partner2_name: data.event.name.split(" & ")[1] || "",
      date: data.event.date ? new Date(data.event.date).toISOString().split("T")[0] : "",
      city: data.event.city,
      rsvp_deadline: data.event.rsvp_deadline ? new Date(data.event.rsvp_deadline).toISOString().split("T")[0] : "",
      bride_phone: data.event.bride_phone || "",
      groom_phone: data.event.groom_phone || "",
      ceremony_name: data.venues.ceremony?.name || "",
      ceremony_address: data.venues.ceremony?.address || "",
      ceremony_time: data.venues.ceremony?.time || "",
      ceremony_map: data.venues.ceremony?.map_embed_url || "",
      party_name: data.venues.party?.name || "",
      party_address: data.venues.party?.address || "",
      party_time: data.venues.party?.time || "",
      party_map: data.venues.party?.map_embed_url || "",
      hero_image_url: data.event.hero_image_url || "",
    })

    setStoryMilestones(
      data.story.map((s) => ({
        year: s.year,
        title: s.title,
        description: s.description || "",
      })),
    )

    setContentData({
      story_title: data.content.story_title,
      story_subtitle: data.content.story_subtitle,
      ceremony_title: data.content.ceremony_title || "",
      party_title: data.content.party_title || "",
      rsvp_subtitle: data.content.rsvp_subtitle || "",
    })

    setIsLoading(false)
  }

  async function handleSave() {
    if (!config) return
    setIsSaving(true)

    try {
      await updateEvent(config.event.slug, {
        name: `${formData.partner1_name} & ${formData.partner2_name}`,
        date: new Date(formData.date).toISOString(),
        city: formData.city,
        rsvp_deadline: formData.rsvp_deadline,
        bride_phone: formData.bride_phone,
        groom_phone: formData.groom_phone,
        image_url: formData.hero_image_url,
      })

      if (config.venues.ceremony) {
        await updateVenue(config.event.id, "ceremony", {
          name: formData.ceremony_name,
          address: formData.ceremony_address,
          time: formData.ceremony_time,
          map_embed_url: formData.ceremony_map,
        })
      }

      if (config.venues.party) {
        await updateVenue(config.event.id, "party", {
          name: formData.party_name,
          address: formData.party_address,
          time: formData.party_time,
          map_embed_url: formData.party_map,
        })
      }

      // Save story milestones
      await updateStoryMilestones(config.event.id, storyMilestones)

      // Save content settings
      await updateContentSettings(config.event.id, contentData)

      toast.success("Changes saved successfully!")
      loadConfig()
    } catch {
      toast.error("Failed to save changes")
    }

    setIsSaving(false)
  }

  async function handleAddMilestone() {
    setStoryMilestones([...storyMilestones, { year: new Date().getFullYear().toString(), title: "", description: "" }])
  }

  async function handleDeleteMilestone(index: number) {
    setStoryMilestones(storyMilestones.filter((_, i) => i !== index))
  }

  async function handleAddImage() {
    if (!config || !newImageUrl) return

    const result = await addGalleryImage(config.event.id, newImageUrl)
    if (result.success) {
      toast.success("Image added!")
      setNewImageUrl("")
      await loadConfig()
    } else {
      toast.error("Failed to add image")
    }
  }

  async function handleDeleteImage(imageId: string) {
    const result = await deleteGalleryImage(imageId)
    if (result.success) {
      toast.success("Image deleted!")
      await loadConfig()
    } else {
      toast.error("Failed to delete image")
    }
  }

  function handlePreview() {
    window.open(`/${slug}`, "_blank")
  }

  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setHeroUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      const result = await response.json()

      if (result.success) {
        setFormData((prev) => ({ ...prev, hero_image_url: result.url }))
        toast.success("Image uploaded!")
      } else {
        toast.error("Upload failed: " + result.message)
      }
    } catch (error) {
      console.error("[v0] Upload error:", error)
      toast.error("An error occurred during upload")
    } finally {
      setHeroUploading(false)
    }
  }

  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !config) return

    setGalleryUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      const result = await response.json()

      if (result.success) {
        const addResult = await addGalleryImage(config.event.id, result.url)
        if (addResult.success) {
          toast.success("Image added!")
          await loadConfig()
        } else {
          toast.error("Failed to add photo")
        }
      } else {
        toast.error("Upload failed: " + result.message)
      }
    } catch (error) {
      console.error("[v0] Upload error:", error)
      toast.error("An error occurred during upload")
    } finally {
      setGalleryUploading(false)
    }
  }

  const handleGenerateQR = async () => {
    try {
      const QRCode = (await import("qrcode")).default

      const eventUrl = `${window.location.origin}/${slug}`

      const qrDataUrl = await QRCode.toDataURL(eventUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: "#881337", // rose-900
          light: "#ffffff",
        },
      })

      setQrCodeDataUrl(qrDataUrl)
      setShowQRModal(true)
    } catch (error) {
      console.error("Failed to generate QR code:", error)
      toast.error("Failed to generate QR code")
    }
  }

  const handleDownloadQR = () => {
    const link = document.createElement("a")
    link.href = qrCodeDataUrl
    link.download = `${slug}-wedding-qr.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("QR Code downloaded!")
    setShowQRModal(false)
  }

  if (isLoading || !config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-rose-50 to-amber-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-rose-300 border-t-rose-600 rounded-full" />
      </div>
    )
  }

  const tabs = [
    { id: "general" as const, label: "General", icon: LayoutGrid },
    { id: "story" as const, label: "Story", icon: Heart },
    { id: "gallery" as const, label: "Gallery", icon: ImageIcon },
    { id: "content" as const, label: "Content", icon: Type },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-stone-50">
      <Toaster theme="light" position="bottom-right" />

      {showHelpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowHelpModal(false)}
              className="sticky top-4 float-right mr-4 text-stone-400 hover:text-stone-600 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 space-y-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-amber-100">
                  <HelpCircle className="w-8 h-8 text-rose-700" />
                </div>
                <h2 className="text-3xl font-bold text-stone-900">Dashboard Guide</h2>
                <p className="text-stone-600 text-lg">
                  Everything you need to know to create your perfect wedding website
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-xl p-6 border border-rose-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <LayoutGrid className="w-5 h-5 text-rose-700" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900">General Tab</h3>
                  </div>
                  <div className="space-y-3 text-stone-700">
                    <p>
                      <strong>Couple Details:</strong> Enter the couple's names that will appear throughout the website.
                    </p>
                    <p>
                      <strong>Event Details:</strong> Set the wedding date, city, and RSVP deadline. These are displayed
                      on your wedding website.
                    </p>
                    <p>
                      <strong>Contact Information:</strong> Add phone numbers for guests to reach out if needed.
                    </p>
                    <p>
                      <strong>Hero Media:</strong> Upload a beautiful image that appears at the top of your wedding
                      site. You can upload files directly or paste a URL.
                    </p>
                    <p>
                      <strong>Venues:</strong> Add details about both ceremony and party locations, including name,
                      address, time, and embed a Google Maps iframe for easy navigation.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Heart className="w-5 h-5 text-rose-700" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900">Story Tab</h3>
                  </div>
                  <div className="space-y-3 text-stone-700">
                    <p>
                      <strong>Love Story Milestones:</strong> Share your journey as a couple! Add key moments from your
                      relationship with years, titles, and descriptions.
                    </p>
                    <p>
                      <strong>Add New Milestones:</strong> Click the "Add Milestone" button to create new entries. You
                      can add as many as you like.
                    </p>
                    <p>
                      <strong>Delete Milestones:</strong> Use the trash icon to remove any milestone you don't want.
                    </p>
                    <p className="text-sm text-stone-600 italic">
                      Example: "2018 - First Date - We met at a coffee shop on a rainy Sunday afternoon..."
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <ImageIcon className="w-5 h-5 text-rose-700" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900">Gallery Tab</h3>
                  </div>
                  <div className="space-y-3 text-stone-700">
                    <p>
                      <strong>Photo Gallery:</strong> Showcase your favorite photos! These will appear in a beautiful
                      gallery on your wedding website.
                    </p>
                    <p>
                      <strong>Add Photos:</strong> You can either paste an image URL or click "Upload Image" to upload
                      from your device.
                    </p>
                    <p>
                      <strong>Delete Photos:</strong> Click the trash icon on any photo to remove it from the gallery.
                    </p>
                    <p className="text-sm text-stone-600 italic">
                      Tip: Use high-quality images for the best appearance. Recommended size: 1200x800 pixels or larger.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Type className="w-5 h-5 text-rose-700" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900">Content Tab</h3>
                  </div>
                  <div className="space-y-3 text-stone-700">
                    <p>
                      <strong>Customize Text:</strong> Personalize all the text that appears on your wedding website.
                    </p>
                    <p>
                      <strong>Story Section:</strong> Edit the title and subtitle for your love story section.
                    </p>
                    <p>
                      <strong>Gallery Section:</strong> Customize the gallery heading and subtitle.
                    </p>
                    <p>
                      <strong>RSVP Section:</strong> Change the RSVP subtitle text that appears above the RSVP form.
                    </p>
                    <p>
                      <strong>Venue Titles:</strong> Customize the names for ceremony and party sections.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Save className="w-5 h-5 text-rose-700" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900">Top Action Buttons</h3>
                  </div>
                  <div className="space-y-3 text-stone-700">
                    <p>
                      <strong>QR Code:</strong> Generate a QR code for your wedding website. Perfect for printing on
                      invitations so guests can easily access your site!
                    </p>
                    <p>
                      <strong>RSVPs:</strong> View all guest responses in one place. See who's attending, guest counts,
                      and personal messages.
                    </p>
                    <p>
                      <strong>Save & Preview:</strong> Opens your live wedding website in a new tab so you can see
                      exactly how it looks to guests.
                    </p>
                    <p>
                      <strong>Save Changes:</strong> Click this button after making any edits to save all your changes.
                      Don't forget to save!
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Upload className="w-5 h-5 text-rose-700" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900">Tips & Best Practices</h3>
                  </div>
                  <div className="space-y-2 text-stone-700">
                    <p>• Always click "Save Changes" after editing any section</p>
                    <p>• Use high-quality images for the best visual experience</p>
                    <p>• Keep milestone descriptions concise and meaningful</p>
                    <p>• Test your website on mobile devices to ensure it looks great</p>
                    <p>• Share the QR code on your physical invitations</p>
                    <p>• Check the RSVPs page regularly to track guest responses</p>
                    <p>• Add venue map embeds to help guests find locations easily</p>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-stone-200">
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="px-8 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl font-medium hover:from-rose-600 hover:to-rose-700 transition-all shadow-md"
                >
                  Got it! Let's get started
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Help Modal End */}

      {showQRModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-amber-100">
                <QrCode className="w-8 h-8 text-rose-700" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-stone-900 mb-2">Your Wedding QR Code</h3>
                <p className="text-stone-600 text-sm">
                  Share this QR code with your guests so they can easily access your wedding website and RSVP.
                </p>
              </div>

              <div className="bg-stone-50 rounded-xl p-6 border border-stone-200">
                <img
                  src={qrCodeDataUrl || "/placeholder.svg"}
                  alt="Wedding QR Code"
                  className="w-full max-w-[280px] mx-auto"
                />
              </div>

              <button
                onClick={handleDownloadQR}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl font-medium hover:from-rose-600 hover:to-rose-700 transition-all shadow-md"
              >
                <Upload className="w-5 h-5" />
                Download QR Code
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white rounded-lg shadow-lg border border-stone-200"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-xl border-r border-stone-200 p-4 flex flex-col shadow-sm z-40 transition-transform duration-300",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <nav className="space-y-1 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                activeTab === tab.id
                  ? "bg-gradient-to-r from-rose-100 to-amber-100 text-rose-900 shadow-sm"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100",
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="lg:ml-64 p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
        <header className="flex flex-wrap gap-2 md:gap-3 justify-end mb-6">
          <button
            onClick={() => setShowHelpModal(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs md:text-sm text-stone-700 hover:bg-stone-50 transition-colors shadow-sm"
            title="Dashboard Help & Guide"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Help</span>
          </button>
          <button
            onClick={handleGenerateQR}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs md:text-sm text-stone-700 hover:bg-stone-50 transition-colors shadow-sm"
            title="Download QR Code for guests"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">QR Code</span>
          </button>
          <a
            href={`/${slug}/rsvp`}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs md:text-sm text-stone-700 hover:bg-stone-50 transition-colors shadow-sm"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">RSVPs</span>
          </a>
          <button
            onClick={handlePreview}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs md:text-sm text-stone-700 hover:bg-stone-50 transition-colors shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Save & Preview</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl text-xs md:text-sm font-medium hover:from-rose-600 hover:to-rose-700 transition-all shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </header>

        <div className="max-w-4xl">
          {activeTab === "general" && (
            <div className="space-y-6 md:space-y-8">
              {/* Couple Details */}
              <section className="bg-white/80 backdrop-blur-xl border border-stone-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6 text-stone-900">Couple Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-stone-600 block mb-2">
                      Partner 1 Name
                    </label>
                    <input
                      value={formData.partner1_name}
                      onChange={(e) => setFormData({ ...formData, partner1_name: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                      placeholder="e.g. Mary"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-stone-600 block mb-2">
                      Partner 2 Name
                    </label>
                    <input
                      value={formData.partner2_name}
                      onChange={(e) => setFormData({ ...formData, partner2_name: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                      placeholder="e.g. John"
                    />
                  </div>
                </div>
              </section>

              {/* Event Details */}
              <section className="bg-white/80 backdrop-blur-xl border border-stone-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6 text-stone-900">Event Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-stone-600 block mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-stone-600 block mb-2">City</label>
                    <input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                      placeholder="New York"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs uppercase tracking-widest text-stone-600 block mb-2">RSVP Deadline</label>
                    <input
                      type="date"
                      value={formData.rsvp_deadline}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rsvp_deadline: e.target.value,
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                    />
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-xl border border-stone-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-xs text-white font-bold shadow-sm">
                      1
                    </span>
                    <h3 className="font-semibold text-stone-900">Ceremony</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-stone-600 block mb-2">Venue Name</label>
                      <input
                        value={formData.ceremony_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ceremony_name: e.target.value,
                          })
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                        placeholder="e.g. St. Patrick's Cathedral"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-stone-600 block mb-2">Address</label>
                      <input
                        value={formData.ceremony_address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ceremony_address: e.target.value,
                          })
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                        placeholder="Address"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-stone-600 block mb-2">Time</label>
                      <input
                        value={formData.ceremony_time}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ceremony_time: e.target.value,
                          })
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                        placeholder="e.g. 4:00 PM"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-stone-600 block mb-2">Google Maps Embed URL</label>
                      <input
                        value={formData.ceremony_map}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ceremony_map: e.target.value,
                          })
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all text-xs"
                        placeholder="Paste Google Maps embed URL"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-stone-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs text-white font-bold shadow-sm">
                      2
                    </span>
                    <h3 className="font-semibold text-stone-900">Party</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-stone-600 block mb-2">Venue Name</label>
                      <input
                        value={formData.party_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            party_name: e.target.value,
                          })
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                        placeholder="e.g. The Grand Hotel"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-stone-600 block mb-2">Address</label>
                      <input
                        value={formData.party_address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            party_address: e.target.value,
                          })
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                        placeholder="Address"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-stone-600 block mb-2">Time</label>
                      <input
                        value={formData.party_time}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            party_time: e.target.value,
                          })
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                        placeholder="e.g. 7:00 PM"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-stone-600 block mb-2">Google Maps Embed URL</label>
                      <input
                        value={formData.party_map}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            party_map: e.target.value,
                          })
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all text-xs"
                        placeholder="Paste Google Maps embed URL"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "story" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-stone-900">Our Story Timeline</h3>
                <button
                  onClick={handleAddMilestone}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl text-sm font-medium hover:from-rose-600 hover:to-rose-700 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Add Milestone
                </button>
              </div>

              <div className="space-y-4">
                {storyMilestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-xl border border-stone-200 rounded-2xl p-6 shadow-sm"
                  >
                    <div className="flex gap-4 mb-4">
                      <div className="w-32">
                        <label className="text-xs text-stone-600 block mb-2">Year</label>
                        <input
                          value={milestone.year}
                          onChange={(e) => {
                            const updated = [...storyMilestones]
                            updated[index].year = e.target.value
                            setStoryMilestones(updated)
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                          placeholder="2020"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-stone-600 block mb-2">Title</label>
                        <input
                          value={milestone.title}
                          onChange={(e) => {
                            const updated = [...storyMilestones]
                            updated[index].title = e.target.value
                            setStoryMilestones(updated)
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                          placeholder="First Met"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteMilestone(index)}
                        className="self-end p-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <label className="text-xs text-stone-600 block mb-2">Description</label>
                      <textarea
                        value={milestone.description}
                        onChange={(e) => {
                          const updated = [...storyMilestones]
                          updated[index].description = e.target.value
                          setStoryMilestones(updated)
                        }}
                        rows={3}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                        placeholder="We met at a coffee shop..."
                      />
                    </div>
                  </div>
                ))}

                {storyMilestones.length === 0 && (
                  <div className="text-center py-12 text-stone-500 border border-dashed border-stone-300 rounded-2xl bg-white/50">
                    <p>No milestones yet. Add your first one!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="space-y-6">
              {/* Hero Background Image */}
              <div className="bg-white/80 backdrop-blur-xl border border-stone-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-2 text-stone-900">Hero Background Image</h3>
                <p className="text-sm text-stone-600 mb-4">The main background image on your homepage</p>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      value={formData.hero_image_url || ""}
                      onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
                      placeholder="Enter hero image URL"
                      className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all text-sm"
                    />
                    <label className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl text-sm font-medium hover:from-rose-600 hover:to-rose-700 transition-all shadow-md cursor-pointer whitespace-nowrap">
                      {heroUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Upload from Device
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroFileUpload}
                        disabled={heroUploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {formData.hero_image_url && (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-stone-200 shadow-sm group">
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${formData.hero_image_url})` }}
                      />
                      <button
                        onClick={() => setFormData({ ...formData, hero_image_url: "" })}
                        className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg shadow-lg"
                        title="Remove hero image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Photo Gallery */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">Photo Gallery</h3>
                  <p className="text-sm text-stone-600">Manage your memorable moments</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Enter image URL"
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all text-sm"
                  />
                  <button
                    onClick={handleAddImage}
                    disabled={!newImageUrl}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-stone-200 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors shadow-sm disabled:opacity-50 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    Add URL
                  </button>
                  <label className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl text-sm font-medium hover:from-rose-600 hover:to-rose-700 transition-all shadow-md cursor-pointer whitespace-nowrap">
                    {galleryUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload from Device
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryFileUpload}
                      disabled={galleryUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {config.gallery.map((image) => (
                  <div key={image.id} className="relative group">
                    <div
                      className="aspect-square bg-cover bg-center rounded-xl border border-stone-200 shadow-sm"
                      style={{ backgroundImage: `url(${image.image_url})` }}
                    />
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="absolute top-2 right-2 p-2 bg-white/90 text-red-500 rounded-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow-md"
                      aria-label="Delete image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {config.gallery.length === 0 && (
                  <div className="col-span-2 md:col-span-3 text-center py-12 text-stone-500 border border-dashed border-stone-300 rounded-2xl bg-white/50">
                    <p>No photos yet. Add your first one!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div className="space-y-6">
              <section className="bg-white/80 backdrop-blur-xl border border-stone-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6 text-stone-900">Story Section</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-stone-600 block mb-2">
                      Story Subtitle
                    </label>
                    <input
                      value={contentData.story_subtitle}
                      onChange={(e) =>
                        setContentData({
                          ...contentData,
                          story_subtitle: e.target.value,
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                      placeholder="Our Journey"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-stone-600 block mb-2">Story Title</label>
                    <input
                      value={contentData.story_title}
                      onChange={(e) =>
                        setContentData({
                          ...contentData,
                          story_title: e.target.value,
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                      placeholder="How it began"
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white/80 backdrop-blur-xl border border-stone-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6 text-stone-900">RSVP Section</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-stone-600 block mb-2">RSVP Subtitle</label>
                    <input
                      value={contentData.rsvp_subtitle}
                      onChange={(e) =>
                        setContentData({
                          ...contentData,
                          rsvp_subtitle: e.target.value,
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                      placeholder="Share Your Love"
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white/80 backdrop-blur-xl border border-stone-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6 text-stone-900">Venue Titles</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-stone-600 block mb-2">
                      Ceremony Title
                    </label>
                    <input
                      value={contentData.ceremony_title}
                      onChange={(e) =>
                        setContentData({
                          ...contentData,
                          ceremony_title: e.target.value,
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                      placeholder="Ceremony"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-stone-600 block mb-2">Party Title</label>
                    <input
                      value={contentData.party_title}
                      onChange={(e) =>
                        setContentData({
                          ...contentData,
                          party_title: e.target.value,
                        })
                      }
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                      placeholder="Party"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
