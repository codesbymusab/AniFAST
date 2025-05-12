"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  TrendingUp,
  Calendar,
  Users,
  Star,
  List,
  Heart,
  X,
  Menu,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const sidebarItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Top Rated", href: "/top-rated", icon: TrendingUp },
  { name: "New Release", href: "/new-release", icon: Calendar },
  { name: "Popular Anime", href: "/popular-anime", icon: Users },
  { name: "Recommendations", href: "/recommendations", icon: Star },
  { name: "Watchlist", href: "/watchlist", icon: List },
  { name: "Favorites", href: "/favorites", icon: Heart },
  { name: "Dashboard", href: "/dashboard", icon: User },
];

export function Sidebar() {
  // Determines if the dock is expanded (shows labels)
  const [isExpanded, setIsExpanded] = useState(false);
  // Tracks the item currently being hovered (used for the overlay tooltip)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "h-screen bg-[#0E0818] border-r border-[#2A1F3C] fixed left-0 top-0 pt-16 z-30 transition-all ease-in-out",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      <div className="px-2 py-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li
                key={item.name}
                className="relative" // relative to position the overlay tooltip
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm rounded-md transition-colors w-full",
                    isActive
                      ? "bg-[#6B21A8] text-white"
                      : "text-gray-300 hover:bg-[#1F1B3C] hover:text-white",
                    isExpanded ? "justify-start" : "justify-center"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {isExpanded && <span className="ml-3">{item.name}</span>}
                </Link>
                {/* Show overlay tooltip when dock is collapsed and this item is hovered.
                    You can customize the tooltip content as needed. */}
                {!isExpanded && hoveredItem === item.name && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow">
                    {item.name}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Toggle Button at the bottom */}
      <div className="absolute bottom-4 w-full flex justify-center">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="ghost"
          size="icon"
        >
          {isExpanded ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
