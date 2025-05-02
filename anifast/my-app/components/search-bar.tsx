"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", query)
    // Implement search functionality
  }

  return (
    <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto">
      <Input
        type="text"
        placeholder="Search for anime, manga, and more..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-[#13102A] border-[#2A1F3C] focus:border-[#E5A9FF] h-12 pl-10 rounded-full"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
    </form>
  )
}
