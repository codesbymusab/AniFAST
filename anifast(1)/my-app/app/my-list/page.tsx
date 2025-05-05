"use client"

import { useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { Sidebar } from "@/components/sidebar"
import { SearchBar } from "@/components/search-bar"
import { Footer } from "@/components/footer"
import { AnimeCard, type Anime } from "@/components/anime-card"
import Link from "next/link"

export default function MyListPage() {
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
  //   const fetchMyList = async () => {
  //     const response = await fetch('/api/user/mylist');
  //     const data = await response.json();
  //     setAnimeList(data);
  //   };
  //   fetchMyList();
  // }, []);
  // ===================================

  // Sample data for My List
  const animeList: Anime[] = [
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

          <h1 className="text-3xl font-bold mb-6">My List</h1>

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
              <p className="text-xl text-gray-400">Your list is empty</p>
              <p className="text-gray-500 mt-2">
                Add anime to your list by clicking the "Add to List" button on anime pages
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
