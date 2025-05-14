//File: app\community\page.tsx

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { NavBar } from "@/components/nav-bar"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import Loading from "@/components/loading"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
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

interface User {
  name: string
  image: string
  email?: string
}

interface Comment {
  id: number
  content: string
  createdAt: Date
  user: User
}

interface CommunityPost {
  id: number
  user: User
  title: string
  content: string
  createdAt: Date
  likes: number
  comments: number
  hasLiked?: boolean
}

export default function CommunityPage() {
  const { data: session } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [postDialogOpen, setPostDialogOpen] = useState(false)
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [currentPostId, setCurrentPostId] = useState<number | null>(null)
  const [newComment, setNewComment] = useState("")
  const [postComments, setPostComments] = useState<Comment[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  // Fetch posts on load
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
  characterImage: getRandomCharacterImage(), // assign random character image
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

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!session?.user?.email || posts.length === 0) return
      
      for (const post of posts) {
        try {
          const response = await fetch(`/api/likes?postId=${post.id}&email=${encodeURIComponent(session.user.email)}`)
          
          if (response.ok) {
            const { hasLiked } = await response.json()
            setPosts(currentPosts => 
              currentPosts.map(p => p.id === post.id ? { ...p, hasLiked } : p)
            )
          }
        } catch (error) {
          console.error("Failed to check like status:", error)
        }
      }
    }

    checkLikeStatus()
  }, [session?.user?.email, posts.length])

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        title: newPostTitle, 
        content: newPostContent, 
        email: session.user.email 
      })
    })

    if (!response.ok) throw new Error("Failed to create post")

    const newPost = await response.json()
    
    // ✅ Add characterImage to the newPost object
    setPosts([{ 
      ...newPost, 
      createdAt: new Date(newPost.createdAt), 
      characterImage: getRandomCharacterImage() 
    }, ...posts])

    setNewPostTitle("")
    setNewPostContent("")
    setPostDialogOpen(false)

    toast.success("Post created successfully!")
  } catch (error) {
    console.error("Failed to create post:", error)
    toast.error("Failed to create post. Please try again.")
  } finally {
    setIsSubmitting(false)
  }
}


  const handleToggleLike = async (postId: number, e: React.MouseEvent) => {
    if (!session?.user?.email) {
      toast.error("You must be logged in to like posts")
      return
    }

    const x = e.clientX
    const y = e.clientY

    const currentPost = posts.find(p => p.id === postId)
    const isLiked = currentPost?.hasLiked || false
    
    if (!isLiked) {
      setFloatingHearts(prev => [...prev, { id: Date.now(), x, y }])
    }
    
    setPosts(posts.map(p => 
      p.id === postId 
        ? { 
            ...p, 
            likes: isLiked ? p.likes - 1 : p.likes + 1,
            hasLiked: !isLiked
          } 
        : p
    ))

    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          postId, 
          email: session.user.email 
        })
      })

      if (!response.ok) throw new Error("Failed to toggle like")

      const data = await response.json()
      
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, likes: data.likes, hasLiked: data.hasLiked } 
          : p
      ))
    } catch (error) {
      console.error("Failed to toggle like:", error)
      toast.error("Failed to update like")
      
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, likes: isLiked ? p.likes : p.likes - 1, hasLiked: isLiked } 
          : p
      ))
    }
  }

  const handleOpenComments = async (postId: number) => {
    setCurrentPostId(postId)
    setCommentDialogOpen(true)
    setCommentsLoading(true)
    
    try {
      const response = await fetch(`/api/comments?postId=${postId}`)
      
      if (!response.ok) throw new Error("Failed to fetch comments")
      
      const data = await response.json()
      setPostComments(data.map((comment: any) => ({ 
        ...comment, 
        createdAt: new Date(comment.createdAt) 
      })))
    } catch (error) {
      console.error("Failed to fetch comments:", error)
      toast.error("Failed to load comments")
      setPostComments([])
    } finally {
      setCommentsLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!session?.user?.email) {
      toast.error("You must be logged in to comment")
      return
    }
    
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty")
      return
    }
    
    if (!currentPostId) return

    try {
      setIsSubmitting(true)

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          postId: currentPostId, 
          content: newComment, 
          email: session.user.email 
        })
      })

      if (!response.ok) throw new Error("Failed to add comment")

      const comment = await response.json()
      setPostComments([...postComments, { ...comment, createdAt: new Date(comment.createdAt) }])
      
      setPosts(posts.map(p => 
        p.id === currentPostId 
          ? { ...p, comments: p.comments + 1 } 
          : p
      ))

      setNewComment("")
      toast.success("Comment added!")
    } catch (error) {
      console.error("Failed to add comment:", error)
      toast.error("Failed to add comment")
    } finally {
      setIsSubmitting(false)
    }
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
              <Dialog open={postDialogOpen} onOpenChange={setPostDialogOpen}>
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
          </div>

          <div className={viewMode === 'card' ? 'grid grid-cols-1 sm:grid-cols-2 gap-6' : 'space-y-6'}>
            <AnimatePresence>
              {posts.map(post => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                className="relative p-6 pb-32 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 shadow-lg"
                 >
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.user.image} alt={post.user.name} />
                      <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{post.user.name}</h3>
                      <p className="text-xs text-gray-400">{formatDistanceToNow(post.createdAt, { addSuffix: true })}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-lg font-bold mb-2">{post.title}</h4>
                    <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <button 
                      onClick={(e) => handleToggleLike(post.id, e)} 
                      className={`flex items-center gap-1 hover:text-pink-400 relative ${post.hasLiked ? 'text-pink-400' : ''}`}
                      aria-label={post.hasLiked ? "Unlike post" : "Like post"}
                    >
                      <Heart className={`h-4 w-4 ${post.hasLiked ? 'fill-current text-red-500' : ''}`} />
                      <span>{post.likes} likes</span>
                    </button>
                   

                    <button 
                      onClick={() => handleOpenComments(post.id)} 
                      className="flex items-center gap-1 hover:text-blue-400"
                      aria-label="Show comments"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments} comments</span>
                    </button>
                  </div>
                   {post.characterImage && (
                  <img
                    src={post.characterImage}
                    alt="Character"
                    className="absolute bottom-0 right-0 w-40 object-contain"
                  />
                  )}
                </motion.div>
                
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Comments Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="bg-[#1A1338] border-none text-white max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription>Join the conversation</DialogDescription>
          </DialogHeader>
          
          {commentsLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto mb-4 space-y-4 pr-2">
              {postComments.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No comments yet. Be the first to comment!</p>
              ) : (
                postComments.map(comment => (
                  <div key={comment.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={comment.user.image} alt={comment.user.name} />
                        <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h5 className="text-sm font-semibold">{comment.user.name}</h5>
                        <p className="text-xs text-gray-400">{formatDistanceToNow(comment.createdAt, { addSuffix: true })}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-200 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          )}
          
          <div className="mt-auto pt-2 border-t border-white/10">
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a comment..."
                className="bg-[#0E0A1F] text-white min-h-[60px] resize-none"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button 
                className="bg-[#6B21A8] hover:bg-[#7C3AED] self-end"
                onClick={handleAddComment}
                disabled={isSubmitting || !session?.user}
              >
                {isSubmitting ? "Posting..." : "Post"}
              </Button>
            </div>
            {!session?.user && (
              <p className="text-xs text-gray-400 mt-2">You must be logged in to comment</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating hearts animation */}
      {floatingHearts.map(({ id, x, y }) => (
        <motion.div
          key={id}
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -60 }}
          transition={{ duration: 1 }}
          className="absolute pointer-events-none text-pink-400 text-xl"
          style={{ left: x, top: y }}
          onAnimationComplete={() => 
            setFloatingHearts(hearts => hearts.filter(h => h.id !== id))
          }
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