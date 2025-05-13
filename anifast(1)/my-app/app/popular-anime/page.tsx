"use client"

import { useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { Sidebar } from "@/components/sidebar"
import { SearchBar } from "@/components/search-bar"
import { Footer } from "@/components/footer"
import { AnimeCard, type Anime } from "@/components/anime-card"
import Link from "next/link"
import { AnimeFetcher } from "@/server/fetchanimes"
import { useEffect } from "react"
import type { AnimeItem } from "@/server/types"
import Loading from "@/components/loading"

export default function PopularAnimePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [popularAnime, setPopularAnime] = useState<AnimeItem[]>([])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AnimeFetcher("popular", 18)
        setPopularAnime(data)
      } catch (error) {
        console.error("Error fetching popular anime:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const animeList = popularAnime.map((anime) => ({
    id: anime.AnimeID,
    title: anime.Title,
    image: anime.CoverImage ?? "/placeholder.svg?height=225&width=150",
    score: anime.Rating ?? 0,
    episodes: anime.Episodes,
    status: anime.Status ?? "Unknown",
  }))

  if (loading) {
    return <Loading />
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0E0A1F] text-white">
      <NavBar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main className={`flex-grow transition-all duration-300 pt-24 px-6 pb-6 ${isSidebarOpen ? "ml-64" : "mx-auto"}`}>
        <div className={`max-w-6xl ${!isSidebarOpen && "mx-auto"}`}>
          <div className="mb-8">
            <SearchBar />
          </div>

          <h1 className="text-3xl font-bold mb-6">`Popular Anime</h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {animeList.map((anime) => (
              <Link key={anime.id} href={`/anime/${anime.id}`}>
                <AnimeCard anime={anime} />
              </Link>
            ))}
          </div>
        </div>
      </main>

      <div className={`transition-all duration-300 mt-auto ${isSidebarOpen ? "ml-64" : "mx-auto"}`}>
        <Footer />
      </div>
    </div>
  )
}