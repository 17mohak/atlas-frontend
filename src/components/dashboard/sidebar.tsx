"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, MapPin, Calendar, Settings } from "lucide-react"

const sidebarNavItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Faculty",
    href: "/dashboard/faculty",
    icon: Users,
  },
  {
    title: "Rooms",
    href: "/dashboard/rooms",
    icon: MapPin,
  },
  {
    title: "Schedule",
    href: "/dashboard/schedule",
    icon: Calendar,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="w-64 min-h-screen border-r border-indigo-100 dark:border-indigo-900 bg-indigo-50/30 dark:bg-zinc-950 px-3 py-4 flex flex-col hidden md:flex">
      <div className="mb-8 px-4">
        <h1 className="text-2xl font-bold tracking-tight text-indigo-950 dark:text-indigo-50">ATLAS</h1>
        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium tracking-wider uppercase">Mission Control</p>
      </div>
      <div className="space-y-1">
        {sidebarNavItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-600 hover:bg-indigo-100/50 hover:text-indigo-950 dark:text-zinc-400 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-100"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}