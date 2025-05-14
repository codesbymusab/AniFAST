// File: app/community/page.tsx

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
import { motion, AnimatePresence } from "framer-motion"

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
  characterImage?: string
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

export default function CommunityPage() {
  const { data: session } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/posts")
        if (!response.ok) throw new Error("Failed to fetch posts")
        const data = await response.json()
        const formattedPosts = data.map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          characterImage: getRandomCharacterImage()
        }))
        setPosts(formattedPosts)
      } catch (error) {
        console.error("Failed to fetch posts:", error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const handleCreatePost = async () => {
    if (!session?.user?.email) return toast.error("You must be logged in to create a post")
    if (!newPostTitle.trim() || !newPostContent.trim()) return toast.error("Title and content are required")
    try {
      setIsSubmitting(true)
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newPostTitle, content: newPostContent, email: session.user.email })
      })
      if (!response.ok) throw new Error("Failed to create post")
      const newPost = await response.json()
      setPosts([{ ...newPost, createdAt: new Date(newPost.createdAt), characterImage: getRandomCharacterImage() }, ...posts])
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

  const handleLikePost = (postId: number, e: React.MouseEvent) => {
    const x = e.clientX
    const y = e.clientY
    setFloatingHearts([...floatingHearts, { id: Date.now(), x, y }])
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    fetch("/api/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId })
    }).then(async res => {
      if (res.ok) {
        const data = await res.json()
        setPosts(posts.map(p => p.id === postId ? { ...p, likes: data.likes } : p))
      } else throw new Error("Failed to like post")
    }).catch(() => toast.error("Failed to like post"))
  }

  if (loading) return <Loading />

  return (
    <div className="flex flex-col min-h-screen bg-[#0E0A1F] text-white relative overflow-hidden">
      <NavBar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main className={`flex-grow transition-all duration-300 pt-24 px-6 pb-6 ${isSidebarOpen ? "ml-64" : "mx-auto"}`}>
        <div className={`max-w-4xl ${!isSidebarOpen && "mx-auto"}`}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Community Posts</h1>
            <div className="flex gap-2 items-center">
              <Button variant="outline" onClick={() => setViewMode(viewMode === 'card' ? 'list' : 'card')}>
                {viewMode === 'card' ? 'List View' : 'Card View'}
              </Button>
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
                    <Textarea placeholder="Post title" className="bg-[#0E0A1F] text-white" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} />
                    <Textarea placeholder="What do you wanna share? ✨" className="bg-[#0E0A1F] text-white min-h-[200px]" value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} />
                  </div>
                  <Button className="mt-4 bg-[#6B21A8] hover:bg-[#7C3AED]" onClick={handleCreatePost} disabled={isSubmitting}>
                    {isSubmitting ? "Posting..." : "Post"}
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className={`transition-all grid gap-6 ${viewMode === 'card' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            <AnimatePresence>
              {posts.map(post => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className={`relative p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 shadow-lg flex ${viewMode === 'list' ? 'flex-row' : 'flex-col'}`}
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.user.image} />
                        <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{post.user.name}</h3>
                        <p className="text-xs text-gray-400">{formatDistanceToNow(post.createdAt, { addSuffix: true })}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-lg font-bold mb-2">{post.title}</h4>
                      <p className="text-gray-300 whitespace-pre-wrap break-words max-w-full">{post.content}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <button onClick={(e) => handleLikePost(post.id, e)} className="flex items-center gap-1 hover:text-pink-400 relative">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes} likes</span>
                      </button>
                    </div>
                  </div>
                  {post.characterImage && (
                    <img
                      src={post.characterImage}
                      alt="Character"
                      className="w-24 object-contain self-end"
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {floatingHearts.map(({ id, x, y }) => (
        <motion.div
          key={id}
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -60 }}
          transition={{ duration: 1 }}
          className="absolute pointer-events-none text-pink-400 text-xl"
          style={{ left: x, top: y }}
          onAnimationComplete={() => setFloatingHearts(hearts => hearts.filter(h => h.id !== id))}
        >
          ❤️
        </motion.div>
      ))}

      <div className={`transition-all duration-300 mt-auto ${isSidebarOpen ? "ml-64" : "mx-auto"}`}>
        <Footer />
      </div>
    </div>
  )
}