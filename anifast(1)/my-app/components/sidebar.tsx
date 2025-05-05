"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, TrendingUp, Calendar, Users, Star, List, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Popular", href: "/popular-anime", icon: Calendar },
  { name: "Top Rated", href: "/top-rated", icon: TrendingUp },
  { name: "Community", href: "/community", icon: Users },
  { name: "Recommendations", href: "/recommendations", icon: Star },
  { name: "My List", href: "/my-list", icon: List },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay - visible only when sidebar is open on mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        data-sidebar="true"
        className={cn(
          "w-64 h-screen bg-[#0A0818] border-r border-[#2A1F3C] fixed left-0 top-0 pt-16 z-30 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white hover:bg-[#2A1F3C]"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close sidebar</span>
        </Button>

        <div className="px-4 py-6">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                      isActive ? "bg-[#6B21A8] text-white" : "text-gray-300 hover:bg-[#1F1B3C] hover:text-white",
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </>
  )
}
