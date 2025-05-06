"use client"

import { useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { Sidebar } from "@/components/sidebar"
import { SearchBar } from "@/components/search-bar"
import { Footer } from "@/components/footer"
import { AnimeCard, type Anime } from "@/components/anime-card"
import Link from "next/link"

export default function FavoritesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  // ===== BACKEND INTEGRATION POINT =====
  // Replace this sample data with data fetched from your backend API
  // This would typically be fetched from your backend based on the logged-in user
  // Example with fetch:
  // useEffect(() => {
  //   const fetchFavorites = async () => {
  //     const response = await fetch('/api/user/favorites');
  //     const data = await response.json();
  //     setAnimeList(data);
  //   };
  //   fetchFavorites();
  // }, []);
  // ===================================

  // Sample data for Favorites
  const animeList: Anime[] = [
    {
      id: 25,
      title: "Fullmetal Alchemist: Brotherhood",
      image: "/placeholder.svg?height=225&width=150",
      score: 9.1,
      episodes: 64,
      status: "Completed",
    },
    {
      id: 26,
      title: "Steins;Gate",
      image: "/placeholder.svg?height=225&width=150",
      score: 9.0,
      episodes: 24,
      status: "Completed",
    },
    {
      id: 27,
      title: "Hunter x Hunter (2011)",
      image: "/placeholder.svg?height=225&width=150",
      score: 9.0,
      episodes: 148,
      status: "Completed",
    },
    {
      id: 28,
      title: "Attack on Titan",
      image: "/placeholder.svg?height=225&width=150",
      score: 8.9,
      episodes: 75,
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

          <h1 className="text-3xl font-bold mb-6">Favorites</h1>

          {animeList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {animeList.map((anime) => (
                <Link key={anime.id} href={`/anime/${anime.id}`}>
                  <AnimeCard anime={anime} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">Your favorites list is empty</p>
              <p className="text-gray-500 mt-2">
                Add anime to your favorites by clicking the "Add to Favorites" button on anime pages
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
