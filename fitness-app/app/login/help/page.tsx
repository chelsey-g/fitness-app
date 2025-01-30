"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import Navigation from "@/components/Navigation"
import Link from "next/link"

export default function ResetPasswordRequest() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const supabase = createClient()

  // const handleSubmit = async (e: { preventDefault: () => void }) => {
  //   e.preventDefault()
  //   try {
  //     setLoading(true)
  //     const { error } = await supabase.auth.resetPasswordForEmail(email, {
  //       redirectTo: "http://example.com/account/update-password", // Replace with your actual URL
  //     })

  //     if (error) throw error
  //     setMessage("Check your email for the password reset link")
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       setMessage("Error: " + error.message)
  //     } else {
  //       setMessage("An unknown error occurred")
  //     }
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  return (
    <>
      <Navigation />
      <div className="max-w-md mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <span className="text-sm text-gray-500">
              Enter your email and we'll send you a password reset link.
            </span>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border p-2"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-logo-green dark:bg-snd-bkg rounded-md py-2 px-4 hover:bg-logo-green hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          {message && (
            <p
              className={`text-sm ${
                message.includes("Error") ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
        <div className="flex justify-center mt-4">
          <Link href="/login" className="hover:text-gray-300">
            Return to Login
          </Link>
        </div>
      </div>
    </>
  )
}
