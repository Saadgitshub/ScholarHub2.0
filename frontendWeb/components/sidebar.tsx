"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Calendar, FileText, GraduationCap, Home, LogOut, Menu, Settings, User, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface SidebarProps {
  role: "student" | "teacher" | "admin"
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  const studentLinks = [
    { href: "/dashboard/student", label: "Dashboard", icon: Home },
    { href: "/dashboard/student/assignments", label: "Assignments", icon: FileText },
    { href: "/dashboard/student/grades", label: "Grades", icon: GraduationCap },
    { href: "/dashboard/student/profile", label: "Profile", icon: User },
  ]

  const teacherLinks = [
    { href: "/dashboard/teacher", label: "Dashboard", icon: Home },
    { href: "/dashboard/teacher/assignments", label: "Assignments", icon: FileText },
    { href: "/dashboard/teacher/students", label: "Students", icon: Users },
    { href: "/dashboard/teacher/grades", label: "Grades", icon: GraduationCap },
    { href: "/dashboard/teacher/profile", label: "Profile", icon: User },
  ]

  const adminLinks = [
    { href: "/dashboard/admin", label: "Dashboard", icon: Home },
    { href: "/dashboard/admin/teachers", label: "Teachers", icon: BookOpen },
    { href: "/dashboard/admin/students", label: "Students", icon: Users },
    { href: "/dashboard/admin/classes", label: "Classes", icon: Calendar },
    { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
  ]

  const links = role === "student" ? studentLinks : role === "teacher" ? teacherLinks : adminLinks

  const roleTitle = role === "student" ? "Student Portal" : role === "teacher" ? "Teacher Portal" : "Admin Portal"

  const MobileSidebar = (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link
              href={`/dashboard/${role}`}
              className="flex items-center gap-2 font-bold"
              onClick={() => setIsOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <span>ScholarHub</span>
            </Link>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="px-2 py-4">
              <h2 className="mb-2 px-4 text-lg font-semibold">{roleTitle}</h2>
              <nav className="space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname === link.href ? "bg-accent text-accent-foreground" : "transparent",
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </ScrollArea>
          <div className="border-t p-4">
            <Link href="/login">
              <Button variant="outline" className="w-full justify-start gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  const DesktopSidebar = (
    <div className="hidden border-r bg-background md:flex md:w-64 md:flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link href={`/dashboard/${role}`} className="flex items-center gap-2 font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
          <span>ScholarHub</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 py-4">
          <h2 className="mb-2 px-4 text-lg font-semibold">{roleTitle}</h2>
          <nav className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === link.href ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <Link href="/login">
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </Link>
      </div>
    </div>
  )

  return <>{isMobile ? MobileSidebar : DesktopSidebar}</>
}
