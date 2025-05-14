"use client"

import { useState, useEffect } from "react"
import { NavBar } from "@/components/nav-bar"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import Loading from "@/components/loading"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { AnimeCard } from "@/components/anime-card"
import Link from "next/link"
import type { AnimeItem } from "@/server/types"
import { AnimeFetcher } from "@/server/fetchanimes"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react"
import { Review } from "@/components/anime-reviews"
import { ReviewsFetcher } from "@/server/fetchreview"

export default function UserDashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
   const { data: session, status } = useSession()

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    pfpNum: 1,
    bio: "Just a regular anime lover binging between deadlines and dreams~ 🌸",
  })

  const [friends, setFriends] = useState([
    { id: 1, name: "Sarah", image: "/images/pfp3.png", status: "Approved" },
    { id: 2, name: "Mike", image: "/images/pfp2.png", status: "Pending" },
    { id: 3, name: "Emma", image: "/images/pfp3.png", status: "Pending" },
    { id: 4, name: "Alex", image: "/images/pfp4.png", status: "Approved" }
  ])

const [posts, setPosts] = useState([
  {
    id: 1,
    title: "My Top 5 Romance Anime",
    content: "Here are some heartwarming picks: Clannad, Toradora, and more~!",
    timestamp: "2025-05-12T18:30:00Z",
    likes: 24,
  },
  {
    id: 2,
    title: "Winter Season Watchlist",
    content: "So hyped for Solo Leveling and Haikyuu movies!!",
    timestamp: "2025-05-13T10:15:00Z",
    likes: 15,
  },
])



  const [postedReviews, setPostedReviews] = useState<Review[]>([]);



  useEffect(() => {

    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const filter="user"+session?.user?.email;
        const fetchedReviews = await ReviewsFetcher(filter);
        console.log("Fetched reviews in component:", fetchedReviews);
        setPostedReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [status, session?.user?.email]);


  const [watchlistAnime, setWatchlistAnime] = useState<AnimeItem[]>([])
  
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (status === "authenticated") {
        try {
          const filter = "watchlist" + session?.user?.email
          const data = await AnimeFetcher(filter, 0)
          setWatchlistAnime(data)
        } catch (error) {
          console.error("Error fetching watchlist:", error)
        } finally {
          setIsLoading(false)
        }
      } else if (status === "unauthenticated") {
        setIsLoading(false)
      }
    }

    fetchWatchlist()
  }, [status, session?.user?.email])

  const watchList = watchlistAnime.map((anime) => ({
    id: anime.AnimeID,
    title: anime.Title,
    image: anime.CoverImage ?? "/placeholder.svg?height=225&width=150",
    score: anime.Rating ?? 0,
    episodes: anime.Episodes,
    status: anime.Status ?? "Unknown",
  }))


  const [favoritesAnime, setFavoritesAnime] = useState<AnimeItem[]>([])
  
  useEffect(() => {
    const fetchfavorites = async () => {
      if (status === "authenticated") {
        try {
          const filter = "favorites" + session?.user?.email
          const data = await AnimeFetcher(filter, 0)
          setFavoritesAnime(data)
        } catch (error) {
          console.error("Error fetching favorites:", error)
        } finally {
          setIsLoading(false)
        }
      } else if (status === "unauthenticated") {
        setIsLoading(false)
      }
    }

    fetchfavorites()
  }, [status, session?.user?.email])

  const favList = favoritesAnime.map((anime) => ({
    id: anime.AnimeID,
    title: anime.Title,
    image: anime.CoverImage ?? "/placeholder.svg?height=225&width=150",
    score: anime.Rating ?? 0,
    episodes: anime.Episodes,
    status: anime.Status ?? "Unknown",
  }))

if (isLoading) {
    return <Loading />
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0E0A1F] text-white">
      <NavBar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main className={`flex-grow transition-all duration-300 pt-24 px-6 pb-6 ${isSidebarOpen ? "ml-64" : "mx-auto"}`}>
        <div className={`max-w-6xl ${!isSidebarOpen && "mx-auto"}`}>
          {/* User Profile Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`/images/pfp${user.pfpNum}.png`} />
                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>

            {/* Profile Picture Edit Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-[#6B21A8] hover:bg-[#7C3AED]">
                  Edit Profile Picture
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1A1338] border-none text-white">
                <DialogHeader>
                  <DialogTitle>Choose a Profile Picture</DialogTitle>
                  <DialogDescription>Select one of the avatars below</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setUser(prev => ({ ...prev, pfpNum: num }))}
                      className={`border-2 rounded-xl p-1 transition-all hover:border-purple-500 ${
                        user.pfpNum === num ? "border-purple-500" : "border-transparent"
                      }`}
                    >
                      <img
                        src={`/images/pfp${num}.png`}
                        alt={`Profile ${num}`}
                        className="rounded-lg w-full h-auto"
                      />
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Bio & Friends Section */}
          <div className="flex flex-col md:flex-row justify-center gap-6 mb-10 max-w-4xl mx-auto">
            <div className="flex-1 p-6 rounded-xl bg-[#1A1338]">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold mb-4">About You</h2>
                <Button variant="ghost" size="sm" className="text-xs text-purple-400">Edit Bio</Button>
              </div>
              <p className="text-gray-300">{user.bio}</p>
            </div>

            <div className="flex-1 p-6 rounded-xl bg-[#1A1338]">
              <h2 className="text-xl font-semibold mb-4">Friends</h2>
              <div className="grid grid-cols-2 gap-4">
                {friends.map(friend => (
                  <div key={friend.id} className="p-3 rounded-lg bg-[#2A1F3C]">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={friend.image} />
                        <AvatarFallback>{friend.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{friend.name}</p>
                        <p className="text-xs text-gray-400 mt-1">Status: {friend.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

         {/* Posts Section */}
<div className="space-y-4 mb-10">
  <h2 className="text-2xl font-bold mb-4">Your Posts</h2>
  {posts.map(post => (
    <div key={post.id} className="p-4 bg-[#1A1338] rounded-xl">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <span className="text-xs text-gray-400">
          {new Date(post.timestamp).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      </div>
      <p className="text-gray-300 mb-2">{post.content}</p>
      <div className="text-sm text-purple-400">{post.likes} ❤️ Likes</div>
    </div>
  ))}
</div>



          {/* Reviews Section */}
          <div className="space-y-4 mb-10">
  <h2 className="text-2xl font-bold mb-4">Your Reviews</h2>
  {postedReviews.map(review => (
    <div key={review.ReviewDate} className="p-4 bg-[#1A1338] rounded-xl">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-semibold">{review.Title}</h3>
        <span className="text-xs text-gray-400">
          {new Date(review.ReviewDate).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      </div>
      <p className="text-gray-300 mb-2">{review.Content}</p>
     
    </div>
  ))}
</div>
          {/* Watchlist Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Watchlist</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {watchList.map((anime) => (
                <Link key={anime.id} href={`/anime/${anime.id}`}>
                  <AnimeCard anime={anime} />
                </Link>
              ))}
            </div>
          </div>

          {/* Favorites Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Favorites</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {favList.map((anime) => (
                <Link key={anime.id} href={`/anime/${anime.id}`}>
                  <AnimeCard anime={anime} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <div className={`transition-all duration-300 mt-auto ${isSidebarOpen ? "ml-64" : "mx-auto"}`}>
        <Footer />
      </div>
    </div>
  )
}
