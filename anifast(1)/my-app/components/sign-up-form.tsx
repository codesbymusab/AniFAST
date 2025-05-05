"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

export function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      alert("You must agree to the terms of service");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call the API route to sign up the new user.
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });
      console.log("Fetch call executed");
      
      const data = await res.json();
      console.log("Received response:", data);
      console.log("Response status:", res.status);

      if (!res.ok) {
        // If the API returns an error, throw it.
        throw new Error(data.error || "Sign up failed");
      }

      // Redirect to login page after a successful sign-up.
      router.push("/login");
    } catch (error: any) {
      console.error("Sign up failed:", error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
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

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="agree"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="border-[#E5A9FF] data-[state=checked]:bg-[#E5A9FF] data-[state=checked]:text-[#0E0A1F]"
          />
          <label htmlFor="agree" className="text-sm text-gray-300">
            I agree to the{" "}
            <Link href="/terms">
              <span className="underline">terms of service</span>
            </Link>
          </label>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Button
        type="submit"
        className="w-full bg-[#E5A9FF] hover:bg-[#D68FFF] text-[#0E0A1F] h-10 mt-4 btn-glow"
        disabled={isLoading}
      >
        {isLoading ? "Signing up..." : "Sign Up"}
      </Button>
    </form>
  );
}
