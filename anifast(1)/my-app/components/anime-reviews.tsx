"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, Heart } from "lucide-react"

interface Review {
  id: number
  userId: number
  username: string
  avatar: string
  rating: number
  content: string
  likes: number
  date: string
}

interface AnimeReviewsProps {
  animeId: number
}

export function AnimeReviews({ animeId }: AnimeReviewsProps) {
  const [newReview, setNewReview] = useState("")
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ===== BACKEND INTEGRATION POINT =====
  // Replace this sample data with data fetched from your backend API
  // Example with fetch:
  // const [reviews, setReviews] = useState<Review[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  //
  // useEffect(() => {
  //   const fetchReviews = async () => {
  //     try {
  //       const response = await fetch(`/api/anime/${animeId}/reviews`);
  //       const data = await response.json();
  //       setReviews(data);
  //     } catch (error) {
  //       console.error("Error fetching reviews:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchReviews();
  // }, [animeId]);
  // ===================================

  // Sample reviews data
  const reviews: Review[] = [
    {
      id: 1,
      userId: 101,
      username: "animefan42",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.5,
      content:
        "This anime completely blew me away. The animation quality is top-notch, and the story keeps you on the edge of your seat. The character development is phenomenal, especially for the protagonist. Can't wait for the next season!",
      likes: 253,
      date: "2023-12-15",
    },
    {
      id: 2,
      userId: 102,
      username: "otakumaster",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      content:
        "A masterpiece in every sense of the word. The plot twists are unexpected and the emotional impact is incredible. This is easily in my top 3 anime of all time. The soundtrack deserves special mention too!",
      likes: 189,
      date: "2023-11-28",
    },
    {
      id: 3,
      userId: 103,
      username: "sakuralover",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      content:
        "While not perfect, this anime delivers a compelling story with memorable characters. Some episodes drag a bit in the middle, but the finale more than makes up for it. The animation is consistently beautiful throughout.",
      likes: 97,
      date: "2023-10-05",
    },
  ]

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReview.trim() || rating === 0) return

    setIsSubmitting(true)

    // ===== BACKEND INTEGRATION POINT =====
    // Here you would send the review to your backend API
    // Example with fetch:
    // try {
    //   const response = await fetch(`/api/anime/${animeId}/reviews`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       content: newReview,
    //       rating,
    //     }),
    //   });
    //   const newReviewData = await response.json();
    //   setReviews(prevReviews => [newReviewData, ...prevReviews]);
    //   setNewReview('');
    //   setRating(0);
    // } catch (error) {
    //   console.error('Error posting review:', error);
    // }
    // ===================================

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Reset form
    setNewReview("")
    setRating(0)
    setIsSubmitting(false)

    // Show success message or update UI
    alert("Review submitted successfully!")
  }

  return (
    <div className="space-y-8">
      {/* Review Form */}
      <div className="bg-[#13102A] rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
        <form onSubmit={handleSubmitReview}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                  <Star className={`h-6 w-6 ${rating >= star ? "fill-[#E5A9FF] text-[#E5A9FF]" : "text-gray-500"}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Your Review</label>
            <Textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Share your thoughts about this anime..."
              className="bg-[#0E0A1F] border-[#2A1F3C] focus:border-[#E5A9FF] min-h-[120px]"
            />
          </div>
          <Button
            type="submit"
            className="bg-[#E5A9FF] hover:bg-[#D68FFF] text-[#0E0A1F]"
            disabled={isSubmitting || !newReview.trim() || rating === 0}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-[#2A1F3C] pb-6 last:border-0">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.username} />
                <AvatarFallback>{review.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium">{review.username}</div>
                  <div className="text-sm text-gray-400">{review.date}</div>
                </div>
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          review.rating >= star
                            ? "fill-[#E5A9FF] text-[#E5A9FF]"
                            : review.rating >= star - 0.5
                              ? "fill-[#E5A9FF] text-[#E5A9FF] opacity-50"
                              : "text-gray-500"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-200 mb-3">{review.content}</p>
                <button className="flex items-center text-sm text-gray-400 hover:text-[#E5A9FF]">
                  <Heart className="h-4 w-4 mr-1" />
                  <span>{review.likes} likes</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No reviews yet. Be the first to review!</p>
        </div>
      )}
    </div>
  )
}
