"use client"

import Link from "next/link"
import { Logo } from "./logo"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { Menu, UserCircle } from "lucide-react" // <== Added UserCircle icon
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

  if (pathname === "/login") {
    return (
      <div className="flex items-center space-x-4">
        <Button asChild className="bg-[#E5A9FF] hover:bg-[#D68FFF] text-[#0E0A1F]">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    )
  }

  if (pathname === "/signup" || pathname === "/") {
    return (
      <div className="flex items-center space-x-4">
        <Button asChild className="bg-[#E5A9FF] hover:bg-[#D68FFF] text-[#0E0A1F]">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      {/* Avatar-style button for dashboard */}
      <Link href="/dashboard">
        <Button variant="ghost" size="icon">
          {/* Replace this with actual user image from DB later */}
          {/* <Image src={user.image} alt="Avatar" className="rounded-full" /> */}
          <UserCircle className="w-6 h-6 text-white" />
        </Button>
      </Link>

      {/* Sign out button */}
      <Button
        onClick={async () => {
          await signOut({
            redirect: true,
            callbackUrl: "/login",
          });
        }}
        className="bg-[#E5A9FF] hover:bg-[#D68FFF] text-[#0E0A1F]"
      >
        Sign Out
      </Button>
    </div>
  )
}
