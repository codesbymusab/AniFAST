"use client"

import { useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { Sidebar } from "@/components/sidebar"
import { SearchBar } from "@/components/search-bar"
import { Footer } from "@/components/footer"
import { AnimeCard, type Anime } from "@/components/anime-card"
import Link from "next/link"
import { AnimeItem } from "@/server/fetchanimes"
import { useEffect } from "react"
import { AnimeFetcher } from "@/server/fetchanimes"
import { useSession } from "next-auth/react"

export default function WatchlistPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isloading, setLoading] = useState(true);
  const { data: session, status } = useSession(); 
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

 const [newAnime, setWatchlistAnime] = useState<AnimeItem[]>([]);
 
    const filter="watchlist"+ session?.user?.email;
    useEffect(() => {
      AnimeFetcher(filter,0).then(setWatchlistAnime);
      setLoading(true);
    }, []);
  

   
      const animeList=newAnime.map((anime) => ({
        id: anime.AnimeID,
        title: anime.Title,
        image: anime.CoverImage ?? "/placeholder.svg?height=225&width=150",
        score: anime.Rating ?? 0,
        episodes: anime.Episodes,
        status: anime.Status ?? "Unknown",
      }));

      

  return (
    <div className="flex flex-col min-h-screen bg-[#0E0A1F] text-white">
      <NavBar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main className={`flex-grow transition-all duration-300 pt-24 px-6 pb-6 ${isSidebarOpen ? "ml-64" : "mx-auto"}`}>
        <div className={`max-w-6xl ${!isSidebarOpen && "mx-auto"}`}>
          <div className="mb-8">
            <SearchBar />
          </div>

          <h1 className="text-3xl font-bold mb-6">Watchlist</h1>

          {(animeList.length > 0||isloading)  ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {animeList.map((anime) => (
                <Link key={anime.id} href={`/anime/${anime.id}`}>
                  <AnimeCard anime={anime} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">Your watchlist is empty</p>
              <p className="text-gray-500 mt-2">
                Add anime to your watchlist by clicking the "Add to Watchlist" button on anime pages
              </p>
            </div>
          )}
        </div>
      </main>

      <div className={`transition-all duration-300 mt-auto ${isSidebarOpen ? "ml-64" : "mx-auto"}`}>
        <Footer />
      </div>
    </div>
  )
}
