"use client"


import { NavBar } from "@/components/nav-bar"
import { Sidebar } from "@/components/sidebar"
import { SearchBar } from "@/components/search-bar"
import { Footer } from "@/components/footer"
import { AnimeSection } from "@/components/anime-section"
import type { Anime } from "@/components/anime-card"
import { AnimeFetcher } from "@/server/fetchanimes"
import { useEffect, useState } from "react";
import type {AnimeItem} from "@/server/fetchanimes"


import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";



export default function HomePage() {

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("Session:", session);
    console.log("Status:", status);
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [session, status, router]);

  

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

  const [newAnime, setNewAnime] = useState<AnimeItem[]>([]);
  const [popularAnime, setPopularAnime] = useState<AnimeItem[]>([]);
  const [topRatedAnime, setTopRatedAnime] = useState<AnimeItem[]>([]);

  
  useEffect(() => {
    AnimeFetcher("new", 6).then(setNewAnime);
  }, []);

  useEffect(() => {
    AnimeFetcher("popular", 6).then(setPopularAnime);
  }, []);

  useEffect(() => {
    AnimeFetcher("top-rated", 6).then(setTopRatedAnime);
  }, []);

  const mapAnime = (animeList: AnimeItem[]): Anime[] =>
    animeList.map((anime) => ({
      id: anime.AnimeID,
      title: anime.Title,
      image: anime.CoverImage ?? "/placeholder.svg?height=225&width=150",
      score: anime.Rating ?? 0,
      episodes: anime.Episodes,
      status: anime.Status ?? "Unknown",
    }));


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
              
      <AnimeSection title="Newly Released" animeList={mapAnime(newAnime)} viewAllLink="/new-releases" />
      <AnimeSection title="Popular" animeList={mapAnime(popularAnime)} viewAllLink="/popular-animes" />
      <AnimeSection title="Top Rated" animeList={mapAnime(topRatedAnime)} viewAllLink="/top-animes" />
      <AnimeSection title="My List" animeList={myListAnime} viewAllLink="/my-list" />
        </div>
      </main>

      <div className={`transition-all duration-300 mt-auto ${isSidebarOpen ? "ml-64" : "mx-auto"}`}>
        <Footer />
      </div>
    </div>
  )
}
