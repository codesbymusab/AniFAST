import Link from "next/link"
import { SignUpForm } from "@/components/sign-up-form"
import { NavBar } from "@/components/nav-bar"
import { IconOnly } from "@/components/logo"

export default function SignUpPage() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="flex justify-center items-center min-h-[calc(100vh-64px)] p-4">
        <div className="w-full max-w-md p-8">
          <div className="flex flex-col items-center mb-6">
            <IconOnly />
            <h1 className="text-2xl font-medium text-center mt-4">Sign up to aniFAST</h1>
          </div>
          <SignUpForm />
          <div className="mt-6 text-center text-sm text-gray-400">
            <Link href="/login" className="hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
