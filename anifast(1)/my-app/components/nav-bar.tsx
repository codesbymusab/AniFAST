"use client"

import Link from "next/link"
import Image from "next/image"
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
      {/* Dashboard button with user profile image */}
      <Link href="/dashboard">
        <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
          <Image
            src="/images/pfp1.png"
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
          {/* 🔮 Later replace this with: */}
          {/* <Image src={user.image} alt="User Avatar" ... /> */}
        </Button>
      </Link>

      {/* Sign out button */}
      <Button
        onClick={async () => {
          await signOut({
            redirect: true,
            callbackUrl: "/login",
          })
        }}
        className="bg-[#E5A9FF] hover:bg-[#D68FFF] text-[#0E0A1F]"
      >
        Sign Out
      </Button>
    </div>
  )
}
