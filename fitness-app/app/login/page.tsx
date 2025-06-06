"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { IoIosLock } from "react-icons/io"
import { createClient } from "@/utils/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { refreshAuth } = useAuth()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      if (data.session) {
        // Refresh auth state to update the navigation
        await refreshAuth()
        // Navigate to dashboard
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="px-2 py-4 sm:max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="p-4 rounded-lg flex flex-col gap-2 text-foreground">
          <div className="flex items-center space-x-2 mb-4">
            <h1 className="text-2xl font-semibold">Log in to your account</h1>
            <IoIosLock className="text-2xl text-logo-green" />
          </div>
          <p className="text-sm text-foreground">
            Don't have an account?{" "}
            <Link
              className="text-foreground font-medium underline"
              href="/signup"
            >
              Sign up
            </Link>
          </p>
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-3"
            type="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="text-right mb-3">
            <Link
              href="/login/forgot-password"
              className="text-sm text-logo-green hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-logo-green hover:opacity-90 rounded-md px-4 py-2 mb-2 dark:bg-snd-bkg disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}
