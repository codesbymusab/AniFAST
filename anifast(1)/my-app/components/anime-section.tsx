import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { AnimeCard, type Anime } from "./anime-card"

interface AnimeSectionProps {
  title: string
  animeList: Anime[]
  viewAllLink: string
}

export function AnimeSection({ title, animeList, viewAllLink }: AnimeSectionProps) {
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <Link href={viewAllLink} className="text-[#E5A9FF] hover:text-[#D68FFF] text-sm flex items-center">
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {animeList.map((anime) => (
           <Link key={anime.id} href={`/anime/${anime.id}`}>
           <AnimeCard anime={anime} />
         </Link>
        ))}
      </div>
    </div>
  )
}
