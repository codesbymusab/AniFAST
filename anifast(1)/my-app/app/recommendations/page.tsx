"use client"

import { useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { Sidebar } from "@/components/sidebar"
import { SearchBar } from "@/components/search-bar"
import { Footer } from "@/components/footer"
import { AnimeCard } from "@/components/anime-card"
import Link from "next/link"
import { AnimeItem } from "@/server/fetchanimes"
import { useEffect } from "react"
import { AnimeFetcher } from "@/server/fetchanimes"
import { useSession } from "next-auth/react"
import Loading from "./loading"

export default function RecommendationsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isloading, setLoading] = useState(true);
  const { data: session, status } = useSession(); 
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

 const [newAnime1, setWatchlistAnime] = useState<AnimeItem[]>([]);
 const [newAnime2, setFavoritesAnime] = useState<AnimeItem[]>([]);
 const [newAnime3, setFriendsAnime] = useState<AnimeItem[]>([]);

  
    const filter1="recommendation1"+ session?.user?.email;
    const filter2="recommendation2"+ session?.user?.email;
    const filter3="recommendation3"+ session?.user?.email;

    

    useEffect(() => {
   
      AnimeFetcher(filter1,0).then(setWatchlistAnime);
      AnimeFetcher(filter2,0).then(setFavoritesAnime);
      AnimeFetcher(filter3,0).then(setFriendsAnime);
      setLoading(true);
      
    }, []);
  

   
      const wanimeList=newAnime1.map((anime) => ({
        id: anime.AnimeID,
        title: anime.Title,
        image: anime.CoverImage ?? "/placeholder.svg?height=225&width=150",
        score: anime.Rating ?? 0,
        episodes: anime.Episodes,
        status: anime.Status ?? "Unknown",
      }));

      const fanimeList=newAnime2.map((anime) => ({
        id: anime.AnimeID,
        title: anime.Title,
        image: anime.CoverImage ?? "/placeholder.svg?height=225&width=150",
        score: anime.Rating ?? 0,
        episodes: anime.Episodes,
        status: anime.Status ?? "Unknown",
      }));

      const frnanimeList=newAnime3.map((anime) => ({
        id: anime.AnimeID,
        title: anime.Title,
        image: anime.CoverImage ?? "/placeholder.svg?height=225&width=150",
        score: anime.Rating ?? 0,
        episodes: anime.Episodes,
        status: anime.Status ?? "Unknown",
      }));

  const recommendations = [
    {
      category: "Based on your watchlist",
      animeList: wanimeList
        
    },
    {
      category: "Baased on your Likes",
      animeList: fanimeList
       
    },
    {
      category: "Your Friends are Watching",
      animeList: frnanimeList
      
    }

  ]

  if (status === "loading") {
    return <Loading/>
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
