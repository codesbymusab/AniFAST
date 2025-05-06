"use client"

import { useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { Sidebar } from "@/components/sidebar"
import { SearchBar } from "@/components/search-bar"
import { Footer } from "@/components/footer"
import { AnimeCard } from "@/components/anime-card"
import Link from "next/link"

export default function RecommendationsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  // ===== BACKEND INTEGRATION POINT =====
  // Replace this sample data with data fetched from your backend API
  // This would typically be fetched from your backend based on the logged-in user's preferences
  // Example with fetch:
  // useEffect(() => {
  //   const fetchRecommendations = async () => {
  //     const response = await fetch('/api/recommendations');
  //     const data = await response.json();
  //     setRecommendations(data);
  //   };
  //   fetchRecommendations();
  // }, []);
  // ===================================

  // Sample data for recommendations
  const recommendations = [
    {
      category: "Based on your watchlist",
      animeList: [
        {
          id: 29,
          title: "Demon Slayer",
          image: "/placeholder.svg?height=225&width=150",
          score: 8.7,
          episodes: 26,
          status: "Completed",
        },
        {
          id: 30,
          title: "Jujutsu Kaisen",
          image: "/placeholder.svg?height=225&width=150",
          score: 8.6,
          episodes: 24,
          status: "Completed",
        },
        {
          id: 31,
          title: "Chainsaw Man",
          image: "/placeholder.svg?height=225&width=150",
          score: 8.5,
          episodes: 12,
          status: "Completed",
        },
        {
          id: 32,
          title: "Spy x Family",
          image: "/placeholder.svg?height=225&width=150",
          score: 8.6,
          episodes: 25,
          status: "Completed",
        },
        {
          id: 33,
          title: "Mob Psycho 100",
          image: "/placeholder.svg?height=225&width=150",
          score: 8.7,
          episodes: 25,
          status: "Completed",
        },
      ],
    },
    {
      category: "Because you liked Attack on Titan",
      animeList: [
        {
          id: 34,
          title: "Vinland Saga",
          image: "/placeholder.svg?height=225&width=150",
          score: 8.8,
          episodes: 24,
          status: "Completed",
        },
        {
          id: 35,
          title: "Parasyte",
          image: "/placeholder.svg?height=225&width=150",
          score: 8.4,
          episodes: 24,
          status: "Completed",
        },
        {
          id: 36,
          title: "Tokyo Ghoul",
          image: "/placeholder.svg?height=225&width=150",
          score: 7.9,
          episodes: 12,
          status: "Completed",
        },
        {
          id: 37,
          title: "Kabaneri of the Iron Fortress",
          image: "/placeholder.svg?height=225&width=150",
          score: 7.2,
          episodes: 12,
          status: "Completed",
        },
      ],
    },
    {
      category: "Popular in your region",
      animeList: [
        {
          id: 38,
          title: "One Piece",
          image: "/placeholder.svg?height=225&width=150",
          score: 8.7,
          episodes: 1000,
          status: "Ongoing",
        },
        {
          id: 39,
          title: "Naruto",
          image: "/placeholder.svg?height=225&width=150",
          score: 8.3,
          episodes: 220,
          status: "Completed",
        },
        {
          id: 40,
          title: "Dragon Ball Z",
          image: "/placeholder.svg?height=225&width=150",
          score: 8.5,
          episodes: 291,
          status: "Completed",
        },
        {
          id: 41,
          title: "Bleach",
          image: "/placeholder.svg?height=225&width=150",
          score: 8.1,
          episodes: 366,
          status: "Completed",
        },
      ],
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

          <h1 className="text-3xl font-bold mb-6">Recommendations</h1>

          {recommendations.map((section) => (
            <div key={section.category} className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">{section.category}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {section.animeList.map((anime) => (
                  <Link key={anime.id} href={`/anime/${anime.id}`}>
                    <AnimeCard anime={anime} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className={`transition-all duration-300 mt-auto ${isSidebarOpen ? "ml-64" : "mx-auto"}`}>
        <Footer />
      </div>
    </div>
  )
}
