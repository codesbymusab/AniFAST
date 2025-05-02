import Image from "next/image"
import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0A0818] border-t border-[#2A1F3C] py-8 w-full">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-4">
            <Image src="/images/anifast-icon.png" alt="aniFAST" width={32} height={32} className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold text-[#E5A9FF]">aniFAST</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <Link href="/about" className="text-sm text-gray-400 hover:text-white">
              About
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-sm text-gray-400 hover:text-white">
              Contact
            </Link>
            <Link href="/help" className="text-sm text-gray-400 hover:text-white">
              Help Center
            </Link>
          </div>

          <p className="text-xs text-gray-500">&copy; {currentYear} aniFAST. All rights reserved.</p>

          <p className="text-xs text-gray-500 mt-2">
            All anime content is owned by their respective creators and licensors.
          </p>
        </div>
      </div>
    </footer>
  )
}
