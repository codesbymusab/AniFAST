"use client"

import { useState, useEffect } from "react"
import { NavBar } from "@/components/nav-bar"
import { Sidebar } from "@/components/sidebar"
import { SearchBar } from "@/components/search-bar"
import { Footer } from "@/components/footer"
import Loading from "@/components/loading"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { AnimeCard } from "@/components/anime-card"
import Link from "next/link"
import type { AnimeItem } from "@/server/fetchanimes"
import { AnimeFetcher } from "@/server/fetchanimes"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function UserDashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    image: "/avatar-placeholder.png",
    bio: "Just a regular anime lover binging between deadlines and dreams~ 🌸"
  })

  const [recentActivity, setRecentActivity] = useState({
    lastWatched: "Marcus Sheppaden",
    episode: "Ep. 15",
    favourites: ["Naruto", "One Piece", "Your Name"]
  })

  const [friends, setFriends] = useState([
    { id: 1, name: "Sarah", image: "/friend1-avatar.png", watching: "Attack on Titan" },
    { id: 2, name: "Mike", image: "/friend2-avatar.png", watching: "Jujutsu Kaisen" },
    { id: 3, name: "Emma", image: "/friend3-avatar.png", watching: "" },
    { id: 4, name: "Alex", image: "/friend4-avatar.png", watching: "Demon Slayer" }
  ])

  const [recommendations, setRecommendations] = useState<AnimeItem[]>([])

  const [posts, setPosts] = useState([
    { id: 1, title: "My Top 5 Romance Anime", content: "Here are some heartwarming picks: Clannad, Toradora, and more~!" },
    { id: 2, title: "Winter Season Watchlist", content: "So hyped for Solo Leveling and Haikyuu movies!!" }
  ])

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await AnimeFetcher("new", 12)
        setRecommendations(data)
      } catch (error) {
        console.error("Failed to fetch recommendations:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRecommendations()
  }, [])

  if (loading) return <Loading />

  const animeList = recommendations.map((anime) => ({
    id: anime.AnimeID,
    title: anime.Title,
    image: anime.CoverImage ?? "/placeholder.svg?height=225&width=150",
    score: anime.Rating ?? 0,
    episodes: anime.Episodes,
    status: anime.Status ?? "Unknown"
  }))

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
                <AvatarImage src={user.image} />
                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" className="bg-[#6B21A8] hover:bg-[#7C3AED]">
              Edit Profile
            </Button>
          </div>

          {/* Dashboard Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Bio */}
            <div className="p-6 rounded-xl bg-[#1A1338]">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold mb-4">About You</h2>
                <Button variant="ghost" size="sm" className="text-xs text-purple-400">Edit Bio</Button>
              </div>
              <p className="text-gray-300">{user.bio}</p>
            </div>

            {/* Recent Activity */}
            <div className="p-6 rounded-xl bg-[#1A1338]">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <p className="text-gray-300 mb-4">Last watched: {recentActivity.lastWatched} ({recentActivity.episode})</p>
              <h3 className="font-medium text-white mb-2">Favourites</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {recentActivity.favourites.map((anime, idx) => (
                  <li key={idx}>{anime}</li>
                ))}
              </ul>
            </div>

            {/* Friends */}
            <div className="p-6 rounded-xl bg-[#1A1338]">
              <h2 className="text-xl font-semibold mb-4">Friends</h2>
              <div className="grid grid-cols-2 gap-4">
                {friends.map(friend => (
                  <div key={friend.id} className="p-3 rounded-lg bg-[#2A1F3C]">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={friend.image} />
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{friend.name}</p>
                        {friend.watching && (
                          <p className="text-xs text-gray-400 mt-1">Watching: {friend.watching}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">`Your Posts</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#6B21A8] hover:bg-[#7C3AED]">New Post</Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1A1338] border-none text-white">
                  <DialogHeader>
                    <DialogTitle>Create New Post</DialogTitle>
                    <DialogDescription>Share your thoughts with fellow otakus~</DialogDescription>
                  </DialogHeader>
                  <Textarea placeholder="What do you wanna share? ✨" className="bg-[#0E0A1F] text-white" />
                  <Button className="mt-4 bg-[#6B21A8] hover:bg-[#7C3AED]">Post</Button>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="p-4 bg-[#1A1338] rounded-xl">
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-gray-300">{post.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">`Watchlist</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {animeList.map((anime) => (
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
