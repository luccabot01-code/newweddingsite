import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "flormontana",
  description: "Wedding event dashboard",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
