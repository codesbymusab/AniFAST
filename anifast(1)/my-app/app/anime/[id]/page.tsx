"use client"

import { useState, use } from "react"
import { useEffect } from "react"
import { NavBar } from "@/components/nav-bar"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Star, Plus } from "lucide-react"
import Image from "next/image"
import { AnimeReviews } from "@/components/anime-reviews"
import type { AnimeDetails } from "@/server/fetchanimdata"
import { AnimeFetcher } from "@/server/fetchanimdata"
import Loading from "@/components/loading"
import { handleAddToWatchlist } from "@/server/addtowatchlist"
import { handleAddToFavorite } from "@/server/addtofavorites"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { CuteToast } from "@/components/ui/cute-toast"

interface AnimeDetailProps {
  params: Promise<{ id: string }>
}

export default function AnimeDetailPage({ params }: AnimeDetailProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [animeDetails, setAnimeDetails] = useState<AnimeDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showWatchlistToast, setShowWatchlistToast] = useState(false)
  const [showFavoriteToast, setShowFavoriteToast] = useState(false)

  const { id } = use(params)
  const { data: session } = useSession()
  const email = session?.user?.email

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      try {
        const data = await AnimeFetcher(id)
        setAnimeDetails(data)
      } catch (error) {
        console.error("Error fetching anime details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnimeDetail()
  }, [id])

  if (isLoading) {
    return <Loading />
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
                  src={animeDetails?.CoverImage || "/placeholder.svg"}
                  alt="image"
                  width={300}
                  height={450}
                  className="rounded-md shadow-lg border border-[#2A1F3C]"
                  priority
                />

                {/* 💖 Action Buttons */}
                <div className="mt-4 flex flex-col gap-2">
                  <Button
                    onClick={() => {
                      handleAddToWatchlist(id, email ?? "")
                      setShowWatchlistToast(true)
                    }}
                    className="w-full bg-[#E5A9FF] hover:bg-[#D68FFF] text-[#0E0A1F]"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add to WatchList
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      handleAddToFavorite(id, email ?? "")
                      setShowFavoriteToast(true)
                    }}
                    className="w-full border-[#E5A9FF] text-[#E5A9FF] hover:bg-[#2A1F3C]"
                  >
                    <Heart className="mr-2 h-4 w-4" /> Favorite
                  </Button>
                </div>
              </div>

              {/* Anime Details */}
              <div className="flex-grow">
                <h1 className="text-3xl font-bold mb-1">{animeDetails?.Title}</h1>
                <h2 className="text-xl text-gray-400 mb-4">{animeDetails?.JapaneseTitle}</h2>

                <div className="flex items-center mb-6">
                  <div className="bg-[#E5A9FF] text-[#0E0A1F] rounded-md px-3 py-1 flex items-center mr-4">
                    <Star className="h-4 w-4 mr-1 fill-[#0E0A1F]" />
                    <span className="font-bold">{animeDetails?.Rating}</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    <span className="mr-4">{animeDetails?.Episodes} episodes</span>
                    <span>{animeDetails?.Status}</span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none mb-6">
                  <p>{animeDetails?.Synopsis.replace(/<\/?[^>]+(>|$)/g, "")}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Aired</h3>
                    <p>{animeDetails?.ReleaseDate}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Status</h3>
                    <p>{animeDetails?.Status}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Studios</h3>
                    <p>{animeDetails?.Studio}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Duration</h3>
                    <p>23 Minutes</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Rating</h3>
                    <p>{animeDetails?.Rating}</p>
                  </div>
                </div>

                {/* Genres */}
                <div>
                  <h3 className="text-gray-400 text-sm mb-1">Genres</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {animeDetails?.Genres
                      ? animeDetails.Genres.split(", ").map((genre) => (
                          <Link key={genre} href={`/searchpage?query=${encodeURIComponent(genre)}`}>
                            <Badge className="bg-[#2A1F3C] hover:bg-[#3A2F4C] text-white cursor-pointer">
                              {genre}
                            </Badge>
                          </Link>
                        ))
                      : <p className="text-gray-400 text-sm">No genres available</p>}
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-4">
                  <h3 className="text-gray-400 text-sm mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {animeDetails?.Tags
                      ? animeDetails.Tags.split(", ").map((tag) => (
                          <Badge key={tag} className="bg-[#2A1F3C] hover:bg-[#3A2F4C] text-white">
                            {tag}
                          </Badge>
                        ))
                      : <p className="text-gray-400 text-sm">No tags available</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12 mb-8">
              <h2 className="text-2xl font-bold mb-6">Reviews</h2>
              <AnimeReviews animeId={id}/>
            </div>
          </div>
        </div>
      </main>

      <div className={`transition-all duration-300 mt-auto ${isSidebarOpen ? "ml-64" : "mx-auto"}`}>
        <Footer />
      </div>

      {/* Toasts */}
      <CuteToast
        message="✨ Added to your Watchlist! Enjoy watching~ 💖"
        show={showWatchlistToast}
        onClose={() => setShowWatchlistToast(false)}
      />
      <CuteToast
        message="💘 Added to Favorites! You're in love with this one, huh~? 🥰"
        show={showFavoriteToast}
        onClose={() => setShowFavoriteToast(false)}
      />
     
    </div>
  )
}
