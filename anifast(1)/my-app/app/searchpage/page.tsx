"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AnimeFetcher } from "@/server/fetchanimes"
import type { AnimeItem } from "@/server/fetchanimes"
import { AnimeCard } from "@/components/anime-card"
import Loading from "@/components/loading"
import Link from "next/link"
import { NavBar } from "@/components/nav-bar"
import { Sidebar } from "@/components/sidebar"
import { SearchBar } from "@/components/search-bar"
import { Footer } from "@/components/footer"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") ?? ""
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<AnimeItem[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (query.trim() === "") return
        setLoading(true)
        const data = await AnimeFetcher("search", 20, query)
        setResults(data)
      } catch (error) {
        console.error("Error fetching search results:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [query])

  if (loading) return <Loading />

  return (
  <div className="flex flex-col min-h-screen bg-[#0E0A1F] text-white">
    <NavBar toggleSidebar={toggleSidebar} />
    <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

    <main className={`flex-grow transition-all duration-300 pt-24 px-6 pb-6 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
         <div className={`max-w-6xl ${!isSidebarOpen && "mx-auto"}`}>
          <div className="mb-8">
            <SearchBar />
          </div>

          <h1 className="text-3xl font-bold mb-6">
            Search Results for: <span className="text-purple-400">"{query}"</span>
          </h1>

          {results.length === 0 ? (
            <div className="text-center mt-20 text-lg text-gray-400">
              No results found... try something else, senpai~ 🥺🍥
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {results.map((anime) => (
                <Link key={anime.AnimeID} href={`/anime/${anime.AnimeID}`}>
                  <AnimeCard
                    anime={{
                      id: anime.AnimeID,
                      title: anime.Title,
                      image: anime.CoverImage ?? "/placeholder.svg?height=225&width=150",
                      score: anime.Rating ?? 0,
                      episodes: anime.Episodes,
                      status: anime.Status ?? "Unknown"
                    }}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
       </main>

    <div className={`transition-all duration-300 mt-auto ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
      <Footer />
    </div>
  </div>
)
}