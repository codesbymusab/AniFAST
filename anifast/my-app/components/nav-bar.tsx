"use client"

import Link from "next/link"
import { Logo } from "./logo"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

interface NavBarProps {
  toggleSidebar?: () => void
}

export function NavBar({ toggleSidebar }: NavBarProps) {
  return (
    <header className="bg-[#0E0A1F] border-b border-[#2A1F3C] fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          {/* Add hamburger menu button */}
          {toggleSidebar && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 text-white hover:bg-[#2A1F3C]">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Logo />
        </div>

        <NavButtons />
      </div>
    </header>
  )
}

function NavButtons() {
  const pathname = usePathname()

  // If we're on the home page, show login and sign up buttons
  if (pathname === "/home") {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/login" className="text-gray-300 hover:text-white">
          Log In
        </Link>
        <Button asChild className="bg-[#E5A9FF] hover:bg-[#D68FFF] text-[#0E0A1F]">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    )
  }

  // Show different buttons based on current page
  if (pathname === "/login") {
    return (
      <div className="flex items-center space-x-4">
        <Button asChild className="bg-[#E5A9FF] hover:bg-[#D68FFF] text-[#0E0A1F]">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    )
  }

  if (pathname === "/signup") {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/login" className="text-gray-300 hover:text-white">
          Login
        </Link>
      </div>
    )
  }

  // Default buttons for other pages
  return (
    <div className="flex items-center space-x-4">
      <Link href="/login" className="text-gray-300 hover:text-white">
        Login
      </Link>
      <Button asChild className="bg-[#E5A9FF] hover:bg-[#D68FFF] text-[#0E0A1F]">
        <Link href="/signup">Sign Up</Link>
      </Button>
    </div>
  )
}
