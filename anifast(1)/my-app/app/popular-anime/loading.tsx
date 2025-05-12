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
    <div className="w-full h-screen bg-[#0E0A1F] flex items-center justify-center">
      <div className="relative w-40 h-40 overflow-hidden">
        {/* White filling bar clipped to logo */}
        <div
          className="absolute inset-0 z-10"
          style={{
            backgroundColor: "#ffffff",
            width: "100%",
            height: "100%",
            WebkitMaskImage: "url(/images/anifast-icon.png)",
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "left center",
            maskImage: "url(/images/anifast-icon.png)",
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "left center",
            transform: `translateX(-${100 - progress}%)`,
            transition: "transform 0.2s ease-out",
          }}
        />

        {/* Full transparent logo underneath */}
        <Image
          src="/images/anifast-icon.png"
          alt="AniFast Logo"
          fill
          className="object-contain z-0"
        />
      </div>
    </div>
  )
}
