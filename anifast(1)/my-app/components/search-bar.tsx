"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() !== "") {
      router.push(`/searchpage?query=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      className="relative max-w-3xl mx-auto flex items-center"
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />

      <Input
        type="text"
        placeholder="Search for animes by title or genres..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-[#13102A] border-[#2A1F3C] focus:border-[#E5A9FF] h-12 pl-10 pr-12 rounded-full"
      />

      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
      >
        <Search className="h-5 w-5" />
      </Button>
    </form>
  )
}
