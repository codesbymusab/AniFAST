"use client"
import Link from "next/link"
import { cn } from "@/lib/utils"

export const tabs = [
  { name: "Top Anime", href: "/home?tab=top-anime", id: "top" },
  { name: "New Releases", href: "/home?tab=new-release", id: "seasonal" },
  { name: "Community", href: "/home?tab=community", id: "community" },
  { name: "Recommendations", href: "/home?tab=recommendations", id: "recommendations" },
  { name: "My List", href: "/home?tab=mylist", id: "mylist" },
]

interface NavigationTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function NavigationTabs({ activeTab, setActiveTab }: NavigationTabsProps) {
  return (
    <div className="flex overflow-x-auto scrollbar-hide mb-6">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            onClick={(e) => {
              e.preventDefault()
              setActiveTab(tab.id)
            }}
            className={cn(
              "px-6 py-3 text-sm font-medium rounded-md whitespace-nowrap transition-colors",
              activeTab === tab.id
                ? "bg-[#6B21A8] text-white"
                : "bg-[#1F1B3C] text-gray-300 hover:bg-[#2A1F4C] hover:text-white",
            )}
          >
            {tab.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
