"use client"

import Link from "next/link"
import { Logo } from "./logo"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { signOut } from "next-auth/react"

interface NavBarProps {
  toggleSidebar?: () => void
}

export function NavBar({ toggleSidebar }: NavBarProps) {
  return (
    <header className="bg-[#0E0A1F] border-b border-[#2A1F3C] fixed top-0 left-20 right-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">

          <Logo />
        </div>

        <NavButtons />
      </div>
    </header>
  )
}

function NavButtons() {
  const pathname = usePathname()

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

  if (pathname === "/signup" || pathname==="/") {
    return (
      <div className="flex items-center space-x-4">
        <Button asChild className="bg-[#E5A9FF] hover:bg-[#D68FFF] text-[#0E0A1F]">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    )
  }

  // Default buttons for other pages
  return (
    <div className="flex items-center space-x-4">
      <Button asChild onClick={async () => {
        // Call signOut to clear the session
        await signOut({
          redirect: true,               // Optionally redirect after sign-out
          callbackUrl: '/login',        // Specify where to redirect the user after logout
        });

      }} className="bg-[#E5A9FF] hover:bg-[#D68FFF] text-[#0E0A1F]">
        <Link href="/login">Sign Out</Link>
      </Button>
    </div>
  )
}
