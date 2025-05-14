//File: app/community/page.tsx

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { NavBar } from "@/components/nav-bar"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import Loading from "@/components/loading"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from "date-fns"
import { Heart } from "lucide-react"
import { toast } from "sonner"

interface CommunityPost {
  id: number
  user: {
    name: string
    image: string
  }
  title: string
  content: string
  createdAt: Date
  likes: number
  comments: number
}

export default function CommunityPage() {
  const { data: session } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/posts")
        
        if (!response.ok) {
          throw new Error("Failed to fetch posts")
        }
        
        const data = await response.json()
        
        const formattedPosts = data.map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt)
        }))
        
        setPosts(formattedPosts)
      } catch (error) {
        console.error("Failed to fetch posts:", error)

        const mockPosts: CommunityPost[] = [
          {
            id: 1,
            user: {
              name: "Sarah",
              image: "/images/pfp3.png"
            },
            title: "My Top 5 Romance Anime",
            content: "Here are some heartwarming picks: Clannad, Toradora, Your Lie in April, Fruits Basket, and Horimiya! What are your favorites?",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
            likes: 24,
            comments: 8
          },
          {
            id: 2,
            user: {
              name: "Mike",
              image: "/images/pfp4.png"
            },
            title: "Winter Season Watchlist",
            content: "So hyped for Solo Leveling and Haikyuu movies!! Also checking out Delicious in Dungeon and The Dangers in My Heart S2.",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
            likes: 15,
            comments: 3
          },
          {
            id: 3,
            user: {
              name: "Emma",
              image: "/images/pfp2.png"
            },
            title: "Underrated Gems",
            content: "Just finished 'A Place Further Than The Universe' and it's now one of my all-time favorites. More people should watch this masterpiece!",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
            likes: 42,
            comments: 12
          },
          {
            id: 4,
            user: {
              name: "Alex",
              image: "/images/pfp1.png"
            },
            title: "Anime Music Recommendations",
            content: "Looking for anime with amazing soundtracks. Already love Yoko Kanno's work on Cowboy Bebop and Hiroyuki Sawano's tracks. Any other recommendations?",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
            likes: 31,
            comments: 17
          }
        ]
        setPosts(mockPosts)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleCreatePost = async () => {
    if (!session?.user?.email) {
      toast.error("You must be logged in to create a post")
      return
    }
    
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast.error("Title and content are required")
      return
    }
    
    try {
      setIsSubmitting(true)
      
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: newPostTitle,
          content: newPostContent,
          email: session.user.email
        })
      })
      
      if (!response.ok) {
        throw new Error("Failed to create post")
      }
      
      const newPost = await response.json()
      
      setPosts([
        {
          ...newPost,
          createdAt: new Date(newPost.createdAt)
        },
        ...posts
      ])
      
      setNewPostTitle("")
      setNewPostContent("")
      setDialogOpen(false)
      
      toast.success("Post created successfully!")
    } catch (error) {
      console.error("Failed to create post:", error)
      toast.error("Failed to create post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikePost = async (postId: number) => {
    try {
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ))
      
      const response = await fetch("/api/posts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ postId })
      })
      
      if (!response.ok) {
        throw new Error("Failed to like post")
      }
      
      const data = await response.json()
      
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, likes: data.likes } : post
      ))
    } catch (error) {
      console.error("Failed to like post:", error)

      setPosts(posts.map(post => 
        post.id === postId ? { ...post, likes: post.likes - 1 } : post
      ))
      toast.error("Failed to like post. Please try again.")
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0E0A1F] text-white">
      <NavBar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main className={`flex-grow transition-all duration-300 pt-24 px-6 pb-6 ${isSidebarOpen ? "ml-64" : "mx-auto"}`}>
        <div className={`max-w-4xl ${!isSidebarOpen && "mx-auto"}`}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Community Posts</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#6B21A8] hover:bg-[#7C3AED]">Create Post</Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1A1338] border-none text-white">
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                  <DialogDescription>Share your thoughts with the community</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Post title" 
                    className="bg-[#0E0A1F] text-white" 
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                  <Textarea 
                    placeholder="What do you wanna share? ✨" 
                    className="bg-[#0E0A1F] text-white min-h-[200px]" 
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                </div>
                <Button 
                  className="mt-4 bg-[#6B21A8] hover:bg-[#7C3AED]" 
                  onClick={handleCreatePost}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Posting..." : "Post"}
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-6">
            {posts.map(post => (
              <div key={post.id} className="p-6 bg-[#1A1338] rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.user.image} />
                    <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{post.user.name}</h3>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-lg font-bold mb-2">{post.title}</h4>
                  <p className="text-gray-300">{post.content}</p>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <button 
                    className="flex items-center gap-1 hover:text-purple-400"
                    onClick={() => handleLikePost(post.id)}
                  >
                    <Heart className="h-4 w-4" />
                    <span>{post.likes} likes</span>
                  </button>
                </div>
              </div>
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