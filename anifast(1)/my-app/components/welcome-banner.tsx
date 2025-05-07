import Image from "next/image"
import { Sparkles } from "lucide-react"

export function WelcomeBanner() {
  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-[#13102A] to-[#2A1F4C] mb-8">
      <div className="absolute inset-0 overflow-hidden">
        {/* Background pattern elements */}
        <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-[#6B21A8]/10 -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#6B21A8]/10 translate-x-1/4 translate-y-1/4"></div>

        {/* Stars */}
        <Sparkles className="absolute top-10 left-[10%] text-white/20 h-4 w-4" />
        <Sparkles className="absolute top-16 right-[15%] text-white/30 h-5 w-5" />
        <Sparkles className="absolute bottom-12 left-[30%] text-white/20 h-3 w-3" />
        <Sparkles className="absolute top-[40%] right-[25%] text-white/20 h-4 w-4" />
      </div>

      <div className="relative flex flex-col md:flex-row items-center justify-between px-6 py-8 md:py-10">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome to <span className="text-[#E5A9FF]">aniFAST</span>
          </h1>
          <p className="text-gray-300 max-w-xl">
            Discover anime, track your progress, and get personalized recommendations. Your ultimate anime companion.
          </p>
        </div>

        <div className="flex-shrink-0 relative">
          <div className="relative">
            <Image
              src="/images/anifast-icon.png"
              alt="aniFAST"
              width={100}
              height={100}
              className="relative z-10 w-20 h-20 md:w-28 md:h-28 animate-float"
            />
            <div className="absolute inset-0 rounded-full animate-pulse-glow bg-[#E5A9FF]/20 blur-xl -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
