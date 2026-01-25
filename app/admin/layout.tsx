import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "flormontana",
  description: "Admin hub",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
