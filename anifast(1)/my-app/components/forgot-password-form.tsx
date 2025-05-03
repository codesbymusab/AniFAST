"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function ForgotPasswordForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate password reset request
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log({ email })
      setIsSubmitted(true)
    } catch (error) {
      console.error("Password reset request failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-4">
        <div className="text-[#E5A9FF] text-xl mb-4">✓</div>
        <h3 className="text-lg font-medium mb-2">Check your email</h3>
        <p className="text-gray-400 mb-4">We've sent a password reset link to {email}</p>
        <Button
          onClick={() => router.push("/login")}
          className="bg-[#E5A9FF] hover:bg-[#D68FFF] text-[#0E0A1F] btn-glow"
        >
          Back to Login
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-[#0E0A1F] border-[#2A1F3C] focus:border-[#E5A9FF] h-12"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-[#E5A9FF] hover:bg-[#D68FFF] text-[#0E0A1F] h-10 mt-4 btn-glow"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send Reset Link"}
      </Button>
    </form>
  )
}
