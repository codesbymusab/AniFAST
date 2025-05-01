"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export function SignUpForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreedToTerms) {
      alert("You must agree to the terms of service")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      // Simulate sign up process
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log({ email, username, password, confirmPassword, agreedToTerms })

      // Redirect to login page after successful sign up
      router.push("/login")
    } catch (error) {
      console.error("Sign up failed:", error)
    } finally {
      setIsLoading(false)
    }
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

      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="bg-[#0E0A1F] border-[#2A1F3C] focus:border-[#E5A9FF] h-12"
        />
      </div>

      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-[#0E0A1F] border-[#2A1F3C] focus:border-[#E5A9FF] h-12"
        />
      </div>

      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="bg-[#0E0A1F] border-[#2A1F3C] focus:border-[#E5A9FF] h-12"
        />
      </div>

      <div className="flex items-start space-x-2 pt-2">
        <Checkbox
          id="terms"
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          className="border-[#E5A9FF] data-[state=checked]:bg-[#E5A9FF] data-[state=checked]:text-[#0E0A1F]"
        />
        <label htmlFor="terms" className="text-sm text-gray-300">
          You agree to our{" "}
          <Link href="/terms" className="text-[#E5A9FF] hover:underline">
            terms of service
          </Link>
        </label>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#E5A9FF] hover:bg-[#D68FFF] text-[#0E0A1F] h-10 mt-4 btn-glow"
        disabled={isLoading}
      >
        {isLoading ? "Signing up..." : "Sign up"}
      </Button>
    </form>
  )
}
