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
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// Define types for sidebar items and props
interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose: () => void;
}

const sidebarItems: SidebarItem[] = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Top Rated", href: "/top-rated", icon: TrendingUp },
  { name: "New Release", href: "/new-release", icon: Calendar },
  { name: "Popular Anime", href: "/popular-anime", icon: Globe }, 
  { name: "Recommendations", href: "/recommendations", icon: Star },
  { name: "Watchlist", href: "/watchlist", icon: List },
  { name: "Favorites", href: "/favorites", icon: Heart },
  { name: "Community", href: "/community", icon: Users }, 
];

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();

  // Handle Escape key press to close sidebar
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);

  return (
    <div
      className={cn(
        "h-screen bg-[#0E0818] border-r border-[#2A1F3C] fixed left-0 top-0 pt-16 z-30 transition-all ease-in-out",
        isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:w-16 md:translate-x-0"
      )}
    >
      <div className="px-2 py-4 overflow-hidden">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li
                key={item.name}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  href={item.href}
                  onClick={() => {
                    if (isOpen && window.innerWidth < 768) {
                      onClose();
                    }
                  }}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm rounded-md transition-colors w-full",
                    isActive
                      ? "bg-[#6B21A8] text-white"
                      : "text-gray-300 hover:bg-[#1F1B3C] hover:text-white",
                    isOpen ? "justify-start" : "justify-center"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {isOpen && <span className="ml-3 truncate">{item.name}</span>}
                </Link>
                {!isOpen && hoveredItem === item.name && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow z-50">
                    {item.name}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="absolute bottom-4 w-full flex justify-center">
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="text-gray-300 hover:text-white"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}