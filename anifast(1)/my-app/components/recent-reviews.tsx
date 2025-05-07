import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock } from "lucide-react"

interface Review {
  id: string
  user: {
    name: string
    avatar: string
  }
  time: string
  comment: string
  anime: {
    id: number
    title: string
  }
  episode?: string
}

export function RecentReviews() {
  // Sample reviews data
  const reviews: Review[] = [
    {
      id: "1",
      user: {
        name: "Watcher",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      time: "a minute ago",
      comment: "Ep Done ✅",
      anime: {
        id: 101,
        title: "The Apothecary Diaries",
      },
    },
    {
      id: "2",
      user: {
        name: "bread.",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      time: "a minute ago",
      comment: "peak show btw",
      anime: {
        id: 102,
        title: "Lazarus",
      },
    },
    {
      id: "3",
      user: {
        name: "Withyx",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      time: "a minute ago",
      comment: "07:33 huh Humans? I thought u guys was demons",
      anime: {
        id: 103,
        title: "The Misfit of Demon King Academy",
      },
    },
    {
      id: "4",
      user: {
        name: "Watcher",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      time: "a minute ago",
      comment: "W ep",
      anime: {
        id: 101,
        title: "The Apothecary Diaries",
      },
      episode: "12",
    },
  ]

  return (
    <div className="w-full py-8 mt-8 border-t border-[#2A1F3C]">
      <h2 className="text-2xl font-bold mb-6 text-white">Recent Reviews</h2>

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
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#13102A] rounded-lg p-4 border border-[#2A1F3C] hover:border-[#E5A9FF] transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                  <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="font-medium text-sm text-gray-200">{review.user.name}</div>
                <div className="flex items-center text-xs text-gray-400 ml-auto">
                  <Clock className="h-3 w-3 mr-1" />
                  {review.time}
                </div>
              </div>

              <p className="text-gray-300 mb-3 text-sm">
                {review.comment}
                {review.episode && <span className="ml-1 text-xs text-gray-400">(Episode {review.episode})</span>}
              </p>

              <Link
                href={`/anime/${review.anime.id}`}
                className="flex items-center text-xs text-[#E5A9FF] hover:underline"
              >
                <span className="mr-1">📝</span> {review.anime.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
