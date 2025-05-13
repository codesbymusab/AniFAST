"use client"


import { NavBar } from "@/components/nav-bar"
import { Sidebar } from "@/components/sidebar"
import { SearchBar } from "@/components/search-bar"
import { Footer } from "@/components/footer"
import { AnimeSection } from "@/components/anime-section"
import type { Anime } from "@/components/anime-card"
import { AnimeFetcher } from "@/server/fetchanimes"
import { useEffect, useState } from "react";
import { WelcomeBanner } from "@/components/welcome-banner"
import { RecentReviews } from "@/components/recent-reviews"
import type {AnimeItem} from "@/server/types"


import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading"


export default function HomePage() {

  const { data: session, status } = useSession();
  const router = useRouter();
  let filter:string ;

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





  const [newAnime, setNewAnime] = useState<AnimeItem[]>([]);
  const [popularAnime, setPopularAnime] = useState<AnimeItem[]>([]);
  const [topRatedAnime, setTopRatedAnime] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(true);
  
 

  useEffect(() => {

    async function fetchAnimeData() {
      try {
        const [newList, popularList, topRatedList] = await Promise.all([
          AnimeFetcher("new", 6),
          AnimeFetcher("popular", 6),
          AnimeFetcher("top-rated", 6),
         
        ]);

        setNewAnime(newList);
        setPopularAnime(popularList);
        setTopRatedAnime(topRatedList);
      
      } catch (error) {
        console.error("Error fetching anime data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnimeData();
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


  // Sample data for watchlist (my list)
  // ===== BACKEND INTEGRATION POINT =====
  // This would typically be fetched from your backend based on the logged-in user
  // You would need authentication and user-specific API endpoints
  // Example: const { data: myList } = useSWR('/api/user/mylist', fetcher)
  // ===================================

  if (loading) {
    return <Loading />
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0E0A1F] text-white">
      <NavBar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main className={`flex-grow transition-all duration-300 pt-24 px-6 pb-6 ${isSidebarOpen ? "ml-64" : "mx-auto"}`}>
        <div className={`max-w-6xl ${!isSidebarOpen && "mx-auto"}`}>
          {/* Welcome Banner */}
          <WelcomeBanner />
          <div className="mb-8">
            <SearchBar />
          </div>

          
              
      <AnimeSection title="`Newly Released" animeList={mapAnime(newAnime)} viewAllLink="/new-release" />
      <AnimeSection title="`Popular" animeList={mapAnime(popularAnime)} viewAllLink="/popular-anime" />
      <AnimeSection title="`Top Rated" animeList={mapAnime(topRatedAnime)} viewAllLink="/top-rated" />
  
      {/* Recent Reviews Section */}
      <RecentReviews />
        </div>
      </main>

      <div className={`transition-all duration-300 mt-auto ${isSidebarOpen ? "ml-64" : "mx-auto"}`}>
        <Footer />
      </div>
    </div>
  )
}
