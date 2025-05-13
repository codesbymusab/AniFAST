"use client"

import { useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { Sidebar } from "@/components/sidebar"
import { SearchBar } from "@/components/search-bar"
import { Footer } from "@/components/footer"
import { AnimeCard, type Anime } from "@/components/anime-card"
import Link from "next/link"
import { AnimeFetcher } from "@/server/fetchanimes"
import { useEffect} from "react";
import type {AnimeItem} from "@/server/types"
import Loading from "@/components/loading"

export default function SeasonalAnimePage() {
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
  // useEffect(() => {
  //   const fetchSeasonalAnime = async () => {
  //     const response = await fetch('/api/anime?filter=seasonal&limit=24');
  //     const data = await response.json();
  //     setAnimeList(data);
  //   };
  //   fetchSeasonalAnime();
  // }, []);
  // ===================================

  // Sample data for Seasonal Anime
  
    const [newAnime, setNewAnime] = useState<AnimeItem[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
  const fetchNewAnime = async () => {
    try {
      const data = await AnimeFetcher("new", 18);
      setNewAnime(data);
    } catch (error) {
      console.error("Failed to fetch new anime:", error);
    } finally {
      setLoading(false); 
    }
  };

  fetchNewAnime();
}, []);

      const animeList=newAnime.map((anime) => ({
        id: anime.AnimeID,
        title: anime.Title,
        image: anime.CoverImage ?? "/placeholder.svg?height=225&width=150",
        score: anime.Rating ?? 0,
        episodes: anime.Episodes,
        status: anime.Status ?? "Unknown",
      }));
  
 
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

          <h1 className="text-3xl font-bold mb-6">New Releases</h1>

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
