"use client"

import { useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { Sidebar } from "@/components/sidebar"
import { SearchBar } from "@/components/search-bar"
import { Footer } from "@/components/footer"
import { AnimeSection } from "@/components/anime-section"
import type { Anime } from "@/components/anime-card"

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  // ===== BACKEND INTEGRATION POINT =====
  // Replace these sample data arrays with data fetched from your backend API
  // You can use getServerSideProps, SWR, or React Query to fetch this data
  // Example with SWR:
  // const { data: topAnime, error: topAnimeError } = useSWR('/api/anime/top', fetcher)
  // ===================================

  // Sample data for Top Anime
  const topAnime: Anime[] = [
    {
      id: 1,
      title: "One Piece",
      image: "/placeholder.svg?height=225&width=150",
      score: 9.1,
      episodes: 1080,
      status: "Airing",
    },
    {
      id: 2,
      title: "Fullmetal Alchemist: Brotherhood",
      image: "/placeholder.svg?height=225&width=150",
      score: 9.0,
      episodes: 64,
      status: "Completed",
    },
    {
      id: 3,
      title: "Steins;Gate",
      image: "/placeholder.svg?height=225&width=150",
      score: 9.0,
      episodes: 24,
      status: "Completed",
    },
    {
      id: 4,
      title: "Gintama",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.9,
      episodes: 367,
      status: "Completed",
    },
    {
      id: 5,
      title: "Attack on Titan",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.9,
      episodes: 88,
      status: "Completed",
    },
    {
      id: 6,
      title: "Hunter x Hunter (2011)",
      image: "/placeholder.svg?height=225&width=150",
      score: 9.0,
      episodes: 148,
      status: "Completed",
    },
  ]

  // Sample data for Seasonal Anime
  const seasonalAnime: Anime[] = [
    {
      id: 7,
      title: "Enen no Shouboutai: San no Shou",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.6,
      episodes: 12,
      status: "Airing",
    },
    {
      id: 8,
      title: "Lazarus",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.8,
      episodes: 13,
      status: "Airing",
    },
    {
      id: 9,
      title: "Saikyou no Ousama, Nigome no Jinsei wa Nani wo Suru?",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.2,
      episodes: 12,
      status: "Airing",
    },
    {
      id: 10,
      title: "WIND BREAKER Season 2",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.5,
      episodes: 12,
      status: "Airing",
    },
    {
      id: 11,
      title: "Witch Watch",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.3,
      episodes: 12,
      status: "Airing",
    },
    {
      id: 12,
      title: "Kowloon Generic Romance",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.7,
      episodes: 13,
      status: "Airing",
    },
  ]

  // Sample data for Popular Anime
  const popularAnime: Anime[] = [
    {
      id: 13,
      title: "Demon Slayer: Entertainment District Arc",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.9,
      episodes: 11,
      status: "Completed",
    },
    {
      id: 14,
      title: "Jujutsu Kaisen",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.7,
      episodes: 24,
      status: "Completed",
    },
    {
      id: 15,
      title: "Chainsaw Man",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.8,
      episodes: 12,
      status: "Completed",
    },
    {
      id: 16,
      title: "Spy x Family",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.6,
      episodes: 25,
      status: "Completed",
    },
    {
      id: 17,
      title: "My Hero Academia Season 6",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.3,
      episodes: 25,
      status: "Completed",
    },
    {
      id: 18,
      title: "Mob Psycho 100 III",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.8,
      episodes: 12,
      status: "Completed",
    },
  ]

  // Sample data for My List
  // ===== BACKEND INTEGRATION POINT =====
  // This would typically be fetched from your backend based on the logged-in user
  // You would need authentication and user-specific API endpoints
  // Example: const { data: myList } = useSWR('/api/user/mylist', fetcher)
  // ===================================
  const myListAnime: Anime[] = [
    {
      id: 19,
      title: "Vinland Saga",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.8,
      episodes: 24,
      status: "Completed",
    },
    {
      id: 20,
      title: "Made in Abyss",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.7,
      episodes: 13,
      status: "Completed",
    },
    {
      id: 21,
      title: "Violet Evergarden",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.9,
      episodes: 13,
      status: "Completed",
    },
    {
      id: 22,
      title: "Mushoku Tensei: Jobless Reincarnation",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.7,
      episodes: 23,
      status: "Completed",
    },
    {
      id: 23,
      title: "86 EIGHTY-SIX",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.6,
      episodes: 23,
      status: "Completed",
    },
    {
      id: 24,
      title: "Oshi no Ko",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.9,
      episodes: 11,
      status: "Completed",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#0E0A1F] text-white">
      <NavBar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main className={`flex-grow transition-all duration-300 pt-24 px-6 pb-6 ${isSidebarOpen ? "ml-64" : "mx-auto"}`}>
        <div className={`max-w-6xl ${!isSidebarOpen && "mx-auto"}`}>
          <div className="mb-8">
            <SearchBar />
          </div>

          {/* ===== BACKEND INTEGRATION POINT =====
              Replace these static AnimeSection components with dynamic ones
              that render based on data fetched from your backend
              You can also add loading states and error handling here
              ===================================== */}
          <AnimeSection title="Top Anime" animeList={topAnime} viewAllLink="/top-anime" />
          <AnimeSection title="Seasonal Anime" animeList={seasonalAnime} viewAllLink="/seasonal-anime" />
          <AnimeSection title="Popular Anime" animeList={popularAnime} viewAllLink="/popular-anime" />
          <AnimeSection title="My List" animeList={myListAnime} viewAllLink="/my-list" />
        </div>
      </main>

      <div className={`transition-all duration-300 mt-auto ${isSidebarOpen ? "ml-64" : "mx-auto"}`}>
        <Footer />
      </div>
    </div>
  )
}
