import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/home" className="flex items-center">
      <div className="flex items-center">
        <Image src="/images/anifast-icon.png" alt="aniFAST" width={32} height={32} className="h-8 w-8" />
        <span className="ml-2 text-xl font-bold text-[#E5A9FF]">aniFAST</span>
      </div>
    </Link>
  )
}

export function IconOnly() {
  return <Image src="/images/anifast-icon.png" alt="aniFAST" width={40} height={40} className="h-10 w-10" />
}
