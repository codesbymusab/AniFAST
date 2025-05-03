import Link from "next/link"
import { NavBar } from "@/components/nav-bar"
import { IconOnly } from "@/components/logo"
import { ForgotPasswordForm } from "@/components/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0E0A1F] text-white">
      <NavBar />
      <main className="flex justify-center items-center min-h-[calc(100vh-64px)] p-4">
        <div className="w-full max-w-md bg-[#13102A] rounded-md p-8">
          <div className="flex flex-col items-center mb-6">
            <IconOnly />
            <h1 className="text-2xl font-medium text-center mt-4">Reset Password</h1>
            <p className="text-center text-gray-400 mt-2">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
          <ForgotPasswordForm />
          <div className="mt-6 text-center text-sm text-gray-400">
            <Link href="/login" className="text-[#E5A9FF] hover:underline">
              Back to Login
            </Link>
            {" • "}
            <Link href="/" className="text-[#E5A9FF] hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
