// components/loading.tsx

"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function Loading() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100))
    }, 15)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-screen bg-[#0E0A1F] flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="relative w-24 h-24 mb-6">
        <Image
          src="/images/anifast-icon.png"
          alt="AniFast Logo"
          fill
          className="object-contain"
        />
      </div>

      {/* Slim Loading Bar */}
      <div className="w-48 h-2 bg-[#2B0F51] border border-[#E5A9FF] rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-200 ease-in-out"
          style={{
            width: `${progress}%`,
            backgroundColor: "#E5A9FF",
          }}
        />
      </div>
    </div>
  )
}
