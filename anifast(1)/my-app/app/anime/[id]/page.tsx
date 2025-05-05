"use client"

import { useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Star, Plus } from "lucide-react"
import Image from "next/image"
import { AnimeReviews } from "@/components/anime-reviews"

interface AnimeDetailProps {
  params: {
    id: string
  }
}

export default function AnimeDetailPage({ params }: AnimeDetailProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  // ===== BACKEND INTEGRATION POINT =====
  // Replace this sample data with data fetched from your backend API
  // Example with fetch:
  // const [anime, setAnime] = useState<AnimeDetail | null>(null);
  // const [isLoading, setIsLoading] = useState(true);
  //
  // useEffect(() => {
  //   const fetchAnimeDetail = async () => {
  //     try {
  //       const response = await fetch(`/api/anime/${params.id}`);
  //       const data = await response.json();
  //       setAnime(data);
  //     } catch (error) {
  //       console.error("Error fetching anime details:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchAnimeDetail();
  // }, [params.id]);
  // ===================================

  // Sample anime data
  const anime = {
    id: Number.parseInt(params.id),
    title: "Attack on Titan: Final Season",
    japaneseTitle: "進撃の巨人 The Final Season",
    image: "/placeholder.svg?height=450&width=300",
    coverImage: "/placeholder.svg?height=450&width=1200",
    synopsis:
      "Gabi Braun and Falco Grice have been training their entire lives to inherit one of the seven Titans under Marley's control and aid their nation in eradicating the Eldians on Paradis. However, just as all seems well for the two cadets, their peace is suddenly shaken by the arrival of Eren Yeager and the remaining members of the Survey Corps. Having finally reached the Yeager family basement and learned about the dark history surrounding the Titans, the Survey Corps has at long last found the answer they so desperately fought to uncover. With the truth now in their hands, the group set out for the world beyond the walls. In this Final Season, two utterly different worlds collide as each party pursues its own agenda in the long-awaited conclusion to Paradis's fight for freedom.",
    score: 9.1,
    episodes: 16,
    status: "Completed",
    aired: "Dec 7, 2020 to Mar 29, 2021",
    genres: ["Action", "Drama", "Fantasy", "Mystery"],
    studios: ["MAPPA"],
    duration: "23 min. per ep.",
    rating: "R - 17+ (violence & profanity)",
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0E0A1F] text-white">
      <NavBar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main className={`flex-grow transition-all duration-300 pt-16 ${isSidebarOpen ? "ml-64" : "mx-auto"}`}>
        <div className={`w-full ${!isSidebarOpen && "mx-auto"}`}>
          {/* Cover Image */}
          <div className="relative w-full h-64 md:h-80 bg-gradient-to-b from-[#13102A] to-[#0E0A1F]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0A1F] to-transparent" />
          </div>

          <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Anime Poster */}
              <div className="flex-shrink-0">
                <Image
                  src={anime.image || "/placeholder.svg"}
                  alt={anime.title}
                  width={300}
                  height={450}
                  className="rounded-md shadow-lg border border-[#2A1F3C]"
                />

                <div className="mt-4 flex flex-col gap-2">
                  <Button className="w-full bg-[#E5A9FF] hover:bg-[#D68FFF] text-[#0E0A1F]">
                    <Plus className="mr-2 h-4 w-4" /> Add to List
                  </Button>
                  <Button variant="outline" className="w-full border-[#E5A9FF] text-[#E5A9FF] hover:bg-[#2A1F3C]">
                    <Heart className="mr-2 h-4 w-4" /> Favorite
                  </Button>
                </div>
              </div>

              {/* Anime Details */}
              <div className="flex-grow">
                <h1 className="text-3xl font-bold mb-1">{anime.title}</h1>
                <h2 className="text-xl text-gray-400 mb-4">{anime.japaneseTitle}</h2>

                <div className="flex items-center mb-6">
                  <div className="bg-[#E5A9FF] text-[#0E0A1F] rounded-md px-3 py-1 flex items-center mr-4">
                    <Star className="h-4 w-4 mr-1 fill-[#0E0A1F]" />
                    <span className="font-bold">{anime.score}</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    <span className="mr-4">{anime.episodes} episodes</span>
                    <span>{anime.status}</span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none mb-6">
                  <p>{anime.synopsis}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Aired</h3>
                    <p>{anime.aired}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Status</h3>
                    <p>{anime.status}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Studios</h3>
                    <p>{anime.studios.join(", ")}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Duration</h3>
                    <p>{anime.duration}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Rating</h3>
                    <p>{anime.rating}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-gray-400 text-sm mb-1">Genres</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {anime.genres.map((genre) => (
                      <Badge key={genre} className="bg-[#2A1F3C] hover:bg-[#3A2F4C] text-white">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12 mb-8">
              <h2 className="text-2xl font-bold mb-6">Reviews</h2>
              <AnimeReviews animeId={anime.id} />
            </div>
          </div>
        </div>
      </main>

      <div className={`transition-all duration-300 mt-auto ${isSidebarOpen ? "ml-64" : "mx-auto"}`}>
        <Footer />
      </div>
    </div>
  )
}
