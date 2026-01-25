import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "flormontana",
  description: "RSVP management",
}

export default function RSVPLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
