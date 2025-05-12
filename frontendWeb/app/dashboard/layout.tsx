"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Determine user role from URL path
  let role: "student" | "teacher" | "admin" = "student"
  if (pathname.includes("/dashboard/teacher")) {
    role = "teacher"
  } else if (pathname.includes("/dashboard/admin")) {
    role = "admin"
  }

  const sidebarTrigger = (
    <Button variant="outline" size="icon" className="md:hidden">
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle Menu</span>
    </Button>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <Sidebar role={role} />
        <div className="flex flex-1 flex-col">
          <DashboardHeader sidebarTrigger={sidebarTrigger} />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
