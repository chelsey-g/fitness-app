"use client"

import { useState, useEffect, Suspense } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"

function InvitationForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    username: "",
    password: "",
  })

  const competitionId = searchParams?.get("competitionId")

  useEffect(() => {
    const email = searchParams?.get("email")
    const competition = searchParams?.get("competition")
    const competitionId = searchParams?.get("competitionId")

    console.log("Invitation page params:", {
      email,
      competition,
      competitionId: typeof competitionId,
      rawCompetitionId: competitionId,
    })

    if (email) {
      setFormData((prev) => ({ ...prev, email }))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      console.log("Starting signup process with competition ID:", competitionId)

      // First sign up the user
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              username: formData.username,
            },
            emailRedirectTo: `${
              window.location.origin
            }/auth/callback?competitionId=${competitionId}&redirectTo=${encodeURIComponent(
              `/competitions/${competitionId}`
            )}`,
          },
        })

      if (signUpError || !signUpData.user) {
        console.error("Error signing up:", signUpError)
        return
      }

      console.log("User signed up successfully:", signUpData.user.id)

      // Create their profile
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: signUpData.user.id,
        username: formData.username,
        first_name: formData.firstName,
      })

      if (profileError) {
        console.error("Error creating profile:", profileError)
        return
      }

      console.log("Profile created successfully")

      // Don't try to add them to competition here - we'll do it after email confirmation
      alert(
        "Account created! Please check your email to confirm your registration."
      )
      router.push("/competitions")
    } catch (error) {
      console.error("Error in signup process:", error)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Join HabitKick</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            readOnly
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-logo-green focus:border-logo-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-logo-green focus:border-logo-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-logo-green focus:border-logo-green"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-logo-green hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-logo-green"
        >
          Create Account & Join Competition
        </button>
      </form>
    </div>
  )
}

export default function InvitationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvitationForm />
    </Suspense>
  )
}
