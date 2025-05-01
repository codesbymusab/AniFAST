import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { tabs } from "./navigation-tabs"

interface ContentAreaProps {
  activeTab: string
}

export function ContentArea({ activeTab }: ContentAreaProps) {
  // Get the title based on the active tab
  const activeTabName = tabs.find((tab) => tab.id === activeTab)?.name || "Recommended For You"

  // Sample anime data
  const animeList = [
    {
      id: 1,
      title: "Attack on Titan: Final Season",
      image: "/placeholder.svg?height=225&width=150",
      score: 9.1,
      episodes: 16,
      status: "Airing",
    },
    {
      id: 2,
      title: "Demon Slayer: Entertainment District Arc",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.9,
      episodes: 11,
      status: "Completed",
    },
    {
      id: 3,
      title: "Jujutsu Kaisen",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.7,
      episodes: 24,
      status: "Completed",
    },
    {
      id: 4,
      title: "Chainsaw Man",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.8,
      episodes: 12,
      status: "Completed",
    },
    {
      id: 5,
      title: "Spy x Family",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.6,
      episodes: 25,
      status: "Completed",
    },
    {
      id: 6,
      title: "My Hero Academia Season 6",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.3,
      episodes: 25,
      status: "Airing",
    },
  ]

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">{activeTabName}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {animeList.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </div>
  )
}

interface AnimeCardProps {
  anime: {
    id: number
    title: string
    image: string
    score: number
    episodes: number
    status: string
  }
}

function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Card className="bg-[#13102A] border-[#2A1F3C] overflow-hidden hover:border-[#E5A9FF] transition-colors anime-card-hover">
      <div className="relative">
        <Image
          src={anime.image || "/placeholder.svg"}
          alt={anime.title}
          width={150}
          height={225}
          className="w-full object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-[#E5A9FF] text-[#0E0A1F]">{anime.score}</Badge>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm line-clamp-2 text-white text-shadow-sm" title={anime.title}>
          {anime.title}
        </h3>
        <div className="flex justify-between items-center mt-2 text-xs text-gray-300">
          <span>{anime.episodes} eps</span>
          <span>{anime.status}</span>
        </div>
      </CardContent>
    </Card>
  )
}
