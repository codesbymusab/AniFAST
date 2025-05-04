import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface Anime {
  id: number
  title: string
  image: string
  score?: number
  episodes?: number
  status?: string
}

interface AnimeCardProps {
  anime: Anime
}

export function AnimeCard({ anime }: AnimeCardProps) {
  // Ensure we have a valid image path
  const imageSrc = `/placeholder.svg?height=225&width=150`

  return (
    <Card className="bg-[#13102A] border-[#2A1F3C] overflow-hidden hover:border-[#E5A9FF] transition-colors anime-card-hover">
      <div className="relative">
        <Image
          src={anime.image || imageSrc}
          alt={anime.title || "Anime"}
          width={150}
          height={225}
          className="w-full object-cover"
        />
        {typeof anime.score === "number" && (
          <Badge className="absolute top-2 right-2 bg-[#E5A9FF] text-[#0E0A1F]">{anime.score}</Badge>
        )}
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm line-clamp-2 text-white text-shadow-sm" title={anime.title || ""}>
          {anime.title || "Untitled Anime"}
        </h3>
        {typeof anime.episodes === "number" && typeof anime.status === "string" && (
          <div className="flex justify-between items-center mt-2 text-xs text-gray-300">
            <span>{anime.episodes} eps</span>
            <span>{anime.status}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
