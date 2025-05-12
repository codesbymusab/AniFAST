import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock } from "lucide-react"
import { Review } from "./anime-reviews"
import { ReviewsFetcher } from "@/server/fetchreview"
import { useState,useEffect } from "react"


export function RecentReviews() {


  
    const [postedReviews, setPostedReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Only fetch if animeId is valid.
      
      const fetchReviews = async () => {
        try {
          setIsLoading(true);
          const fetchedReviews = await ReviewsFetcher("0");
          console.log("Fetched reviews in component:", fetchedReviews);
          setPostedReviews(fetchedReviews);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchReviews();
    }, ["0"]);
  
  return (
    <div className="w-full py-8 mt-8 border-t border-[#2A1F3C]">
      <h2 className="text-2xl font-bold mb-6 text-white">`Recent Reviews</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Character Image Section */}
        <div className="lg:w-1/4 flex justify-center lg:justify-start">
          <div className="relative">
            <Image
              src="/images/pink-hair-character.png"
              alt="Anime Character"
              width={240}
              height={400}
              className="object-contain"
            />
            <div className="absolute -inset-4 bg-gradient-to-b from-[#E5A9FF]/10 to-transparent rounded-full blur-xl -z-10 opacity-70"></div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {postedReviews.map((review) => (
            <div
              key={review.ReviewDate}
              className="bg-[#13102A] rounded-lg p-4 border border-[#2A1F3C] hover:border-[#E5A9FF] transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={review.Avatar || "/placeholder.svg"} alt={review.Username} />
                  <AvatarFallback>{review.Username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="font-medium text-sm text-gray-200">{review.Username}</div>
                <div className="flex items-center text-xs text-gray-400 ml-auto">
                  <Clock className="h-3 w-3 mr-1" />
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

              <p className="text-gray-300 mb-3 text-sm">
                {review.Content}
          
              </p>

              <Link
                href={`/anime/${review.AnimeId}`}
                className="flex items-center text-xs text-[#E5A9FF] hover:underline"
              >
                <span className="mr-1">📝</span> {review.Title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
