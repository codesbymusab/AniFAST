"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AnimeSearch } from "@/server/searchanimes"
import type { AnimeItem } from "@/server/types"
import { AnimeCard } from "@/components/anime-card"
import Loading from "@/components/loading"
import Link from "next/link"
import { NavBar } from "@/components/nav-bar"
import { Sidebar } from "@/components/sidebar"
import { SearchBar } from "@/components/search-bar"
import { Footer } from "@/components/footer"

// Separate component that uses useSearchParams
function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") ?? ""
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<AnimeItem[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchType, setSearchType] = useState<"title" | "genre" | "all">("all")

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        
        setLoading(true)
        const data = await AnimeSearch(query);
  
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
            {searchType === "genre" ? (
              <>
                Anime with <span className="text-purple-400">"{query}"</span> Genre
              </>
            ) : (
              <>
                Search Results for: <span className="text-purple-400">"{query}"</span>
              </>
            )}
          </h1>

          {results.length === 0 ? (
            <div className="text-center mt-20 text-lg text-gray-400">
              No results found... try something else, senpai~ 🥺🍥
            </div>
          ) : (
            <>
              <p className="text-gray-400 mb-6">Found {results.length} anime matching your search</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {results.map((anime) => (
                  <Link key={anime.id || anime.AnimeID} href={`/anime/${anime.id || anime.AnimeID}`}>
                    <AnimeCard
                      anime={{
                        id: anime.id || anime.AnimeID,
                        title: anime.title || anime.Title,
                        image: anime.image || anime.CoverImage || "/placeholder.svg?height=225&width=150",
                        score: anime.score || anime.Rating,
                        episodes: anime.episodes || anime.Episodes,
                        status: anime.status || anime.Status
                      }}
                    />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <div className={`transition-all duration-300 mt-auto ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        <Footer />
      </div>
    </div>
  )
}

// Main component that wraps the SearchContent with Suspense
export default function SearchPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchContent />
    </Suspense>
  )
}