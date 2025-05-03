"use client"

import type React from "react"
import { signIn } from "next-auth/react";
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export function LoginForm() {
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
   
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    console.log(result);
    if (result?.error) {
      alert("Incorrect Username or Password");
    } else {
      window.location.href = "/home"; 
    }
    setIsLoading(false);
  };

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
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-[#0E0A1F] border-[#2A1F3C] focus:border-[#E5A9FF] h-12"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            className="border-[#E5A9FF] data-[state=checked]:bg-[#E5A9FF] data-[state=checked]:text-[#0E0A1F]"
          />
          <label htmlFor="remember" className="text-sm text-gray-300">
            Remember me
          </label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#E5A9FF] hover:bg-[#D68FFF] text-[#0E0A1F] h-10 mt-4 btn-glow"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  )
}



