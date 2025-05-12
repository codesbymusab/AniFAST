"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, Heart } from "lucide-react"
import { postReview } from "@/server/addreview"
import { useSession } from "next-auth/react";
import { useEffect } from "react"
import { ReviewsFetcher } from "@/server/fetchreview"

export interface Review {
  AnimeId: string;
  Title: string
  Username: string;
  Avatar: string;
  Rating: number;
  Content: string;
  ReviewDate: string;
}

export interface postReview {
  AnimeId: string;
  UserEmail: string;
  Avatar: string;
  Rating: number;
  Content: string;
  ReviewDate: string;
}


interface AnimeReviewsProps {
  animeId: string;
}

// Accept the props object and destructure it
export function AnimeReviews({ animeId }: AnimeReviewsProps) {


  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);


  const [postedReviews, setPostedReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Only fetch if animeId is valid.
    if (!animeId) return;

    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const fetchedReviews = await ReviewsFetcher(animeId);
        console.log("Fetched reviews in component:", fetchedReviews);
        setPostedReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [animeId]);






  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.trim() || rating === 0) return;

    setIsSubmitting(true);

    // Build the review object matching our API expectations.
    const review: postReview = {
      AnimeId: animeId.toString(),
      UserEmail: session?.user?.email ?? "anonymous@example.com", // using the user's email
      Avatar: "/avatar.png",
      Rating: rating,
      Content: newReview,
      ReviewDate: new Date().toISOString(),
    };

    try {
      const newReviewData = await postReview(review);
      // Optionally update state with the new review if needed
      // e.g., setReviews(prev => [newReviewData.review, ...prev]);
    } catch (error) {
      console.error("Error posting review:", error);
    } finally {
      setNewReview("");
      setRating(0);
      setIsSubmitting(false);
      alert("Review submitted successfully!");
    }
  };



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
        {postedReviews.map((review) => (
          <div key={review.ReviewDate} className="border-b border-[#2A1F3C] pb-6 last:border-0">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={"/placeholder.svg"} alt={review.Username.charAt(0)} />
                <AvatarFallback>{review.Username}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium">{review.Username}</div>
                  <div className="text-sm text-gray-400">
                    {new Date(review.ReviewDate).toLocaleString(undefined, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </div>

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
                </div>
                <p className="text-gray-200 mb-3">{review.Content}</p>

              </div>
            </div>
          </div>
        ))}
      </div>

      {postedReviews.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No reviews yet. Be the first to review!</p>
        </div>
      )}
    </div>
  )
}