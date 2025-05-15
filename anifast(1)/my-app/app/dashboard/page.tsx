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
import { Friends } from "@/server/fetchfreinds"
import { FriendsFetcher } from "@/server/fetchfreinds"
import { Star } from "lucide-react"

interface UserPost {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
}


interface UserData {
  name: string;
  email: string;
  pfpNum: number;
  bio: string;
}



interface AnimeListItem {
  id: number;
  title: string;
  image: string;
  score: number;
  episodes: number | undefined;
  status: string;
}

const sampleImages = [
  "/images/characters/char1.png",
  "/images/characters/char2.png",
  "/images/characters/char3.png",
  "/images/characters/char4.png",
  "/images/characters/char5.png",
  "/images/characters/char6.png",
  "/images/characters/char7.png",
]

const getRandomCharacterImage = () => {
  return sampleImages[Math.floor(Math.random() * sampleImages.length)]
}

export default function UserDashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [newBio, setNewBio] = useState("")
  
  const { data: session, status } = useSession()
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)
  
  const [user, setUser] = useState<UserData>({
    name: "",
    email: "",
    pfpNum: 1,
    bio: "",
  })
  
  
  const [friends, setFriends] = useState<Friends[]>([]);



  useEffect(() => {

    const fetchFreinds = async () => {
      try {
        setIsLoading(true);
        const filter = session?.user?.email ?? "";
        const fetchedfriends = await FriendsFetcher(filter);
        console.log("Fetched reviews in component:", fetchedfriends);
        setFriends(fetchedfriends);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        
      }
    };

    fetchFreinds();
  }, [status, session?.user?.email]);

  
  const [posts, setPosts] = useState<UserPost[]>([])
  const [postedReviews, setPostedReviews] = useState<Review[]>([])
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          const response = await fetch(`/api/user?email=${encodeURIComponent(session.user.email)}`);
          if (response.ok) {
            const userData = await response.json();
            setUser({
              name: userData.name || session.user.name || "",
              email: userData.email || session.user.email || "",
              pfpNum: userData.pfpNum || 1,
              bio: userData.bio || "Just a regular anime lover binging between deadlines and dreams~ 🌸",
            });
            setNewBio(userData.bio || "Just a regular anime lover binging between deadlines and dreams~ 🌸");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    
    fetchUserData();
  }, [status, session]);
  
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          const response = await fetch(`/api/userPosts?email=${encodeURIComponent(session.user.email)}`);
          if (response.ok) {
            const postsData = await response.json();
            setPosts(postsData);
          }
        } catch (error) {
          console.error("Error fetching user posts:", error);
        }
      }
    };
    
    fetchUserPosts();
  }, [status, session]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const filter = "user" + session?.user?.email;
        const fetchedReviews = await ReviewsFetcher(filter);
        console.log("Fetched reviews in component:", fetchedReviews);
          
        setPostedReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        
      }
    };
    
    if (status === "authenticated" && session?.user?.email) {
      fetchReviews();
    }
  }, [status, session?.user?.email]);

  const updateProfilePicture = async (pfpNum: number) => {
    if (status === "authenticated" && session?.user?.email) {
      try {
        const response = await fetch('/api/pfp', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: session.user.email,
            pfpNum
          })
        });
        
        if (response.ok) {
          setUser(prev => ({ ...prev, pfpNum }));
        }
      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    }
  };
  
  const updateUserBio = async () => {
    if (status === "authenticated" && session?.user?.email) {
      try {
        const response = await fetch('/api/user', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: session.user.email,
            bio: newBio
          })
        });
        
        if (response.ok) {
          setUser(prev => ({ ...prev, bio: newBio }));
          setIsEditingBio(false);
        }
      } catch (error) {
        console.error("Error updating bio:", error);
      }
    }
  };

  const [watchlistAnime, setWatchlistAnime] = useState<AnimeItem[]>([])
    
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (status === "authenticated") {
        try {
          const filter = "watchlist" + session?.user?.email
          const data = await AnimeFetcher(filter, 0)
          setWatchlistAnime(data as AnimeItem[])
        } catch (error) {
          console.error("Error fetching watchlist:", error)
        } finally {
          
        }
      } 
    }
    fetchWatchlist()
  }, [status, session?.user?.email])

  const watchList: AnimeListItem[] = watchlistAnime.map((anime) => ({
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
          setFavoritesAnime(data as AnimeItem[])
        } catch (error) {
          console.error("Error fetching favorites:", error)
        } finally {
          setIsLoading(false)
        }
      } 
    }
    fetchfavorites()
  }, [status, session?.user?.email])

  const favList: AnimeListItem[] = favoritesAnime.map((anime) => ({
    id: anime.AnimeID,
    title: anime.Title,
    image: anime.CoverImage ?? "/placeholder.svg?height=225&width=150",
    score: anime.Rating ?? 0,
    episodes: anime.Episodes,
    status: anime.Status ?? "Unknown",
  }))

  if (isLoading && status === "loading") {
    return <Loading />
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0E0A1F] text-white">
      <NavBar toggleSidebar={toggleSidebar} />
      {/* @ts-ignore - We're keeping the frontend components unchanged as requested */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main className={`flex-grow transition-all duration-300 pt-24 px-6 pb-6 ${isSidebarOpen ? "ml-64" : "mx-auto"}`}>
        <div className={`max-w-4xl ${!isSidebarOpen && "mx-auto"}`}>

          {/* User Profile Header */}
          <div className="flex items-center gap-4 mb-8">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`/images/pfp${user.pfpNum}.png`} alt={user.name} />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-400">{user.email}</p>
            </div>

            {/* Profile Picture Edit Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="ml-auto">Edit Profile Picture</Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1A1338] border-none text-white">
                <DialogHeader>
                  <DialogTitle>Choose a Profile Picture</DialogTitle>
                  <DialogDescription>Select one of the avatars below</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => updateProfilePicture(num)}
                      className={`border-2 rounded-xl p-1 transition-all hover:border-purple-500 ${
                        user.pfpNum === num ? "border-purple-500" : "border-transparent"
                      }`}
                    >
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={`/images/pfp${num}.png`} alt={`Avatar option ${num}`} />
                      </Avatar>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Bio & Friends Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">About You</h2>
                {isEditingBio ? (
                  <Button variant="outline" onClick={updateUserBio}>Save Bio</Button>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditingBio(true)}>Edit Bio</Button>
                )}
              </div>

              {isEditingBio ? (
                <Textarea 
                  value={newBio} 
                  onChange={(e) => setNewBio(e.target.value)} 
                  className="bg-[#0E0A1F] text-white"
                />
              ) : (
                <p className="text-gray-300">{user.bio}</p>
              )}
		<img
                src={getRandomCharacterImage()}
                alt="Character"
                className="absolute bottom-0 right-0 w-24 object-contain"
              />
            </div>

            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">
              <h2 className="text-xl font-bold mb-4">Friends</h2>
              <div className="space-y-4">
                {friends.map(friend => (
                  <div key={friend.UserID} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/images/pfp${friend.PfpNum}.png`} alt={friend.Username} />
                      <AvatarFallback>{friend.Username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{friend.Username}</p>
                      <p className={`text-xs ${friend.STATUS === "Approved" ? "text-green-400" : "text-yellow-400"}`}>
                        Status: {friend.STATUS}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Your Posts</h2>
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">
                  <div className="flex justify-between mb-2">
                    <h3 className="text-lg font-bold">{post.title}</h3>
                    <span className="text-sm text-gray-400">
                      {new Date(post.timestamp).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{post.content}</p>
                  <div className="text-sm text-gray-400">
                    {post.likes} ❤️ Likes
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Your Reviews</h2>
            <div className="space-y-4">
              {postedReviews.map(review => (
                <div key={review.ReviewDate} className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">
                  <div className="flex justify-between mb-2">
                    <h3 className="text-lg font-bold">{review.Title}</h3>
                    <span className="text-sm text-gray-400">
                      {new Date(review.ReviewDate).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${review.Rating >= star
                            ? "fill-[#E5A9FF] text-[#E5A9FF]"
                            : review.Rating >= star - 0.5
                              ? "fill-[#E5A9FF] text-[#E5A9FF] opacity-50"
                              : "text-gray-500"
                          }`}
                      />
                    ))}
                  </div>
			  <p className="font-medium">{review.ReviewContent}</p>

                </div>
                  {review.AnimeId && (
                    <Link href={`/anime/${review.AnimeId}`}>
                      <Button variant="link" className="p-0 text-purple-400 hover:text-purple-300">
                        View Anime
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
              {postedReviews.length === 0 && (
                <p className="text-gray-400">You haven't posted any reviews yet.</p>
              )}
            </div>
          </div>

          {/* Watchlist Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Watchlist</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {watchList.map((anime) => (
                <Link key={anime.id} href={`/anime/${anime.id}`}>
                  <AnimeCard anime={anime} />
                </Link>
              ))}
              {watchList.length === 0 && (
                <p className="text-gray-400 col-span-full">Your watchlist is empty.</p>
              )}
            </div>
          </div>

          {/* Favorites Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Favorites</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {favList.map((anime) => (
                <Link key={anime.id} href={`/anime/${anime.id}`}>
                  <AnimeCard anime={anime} />
                </Link>
              ))}
              {favList.length === 0 && (
                <p className="text-gray-400 col-span-full">You haven't added any favorites yet.</p>
              )}
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
