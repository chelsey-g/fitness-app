"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { weightService } from "@/app/services/WeightService"

export default function TrackerPage() {
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10))
  const [weight, setWeight] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const { user } = useAuth()

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      if (!user?.id) {
        throw new Error("User not authenticated")
      }
      await weightService.addWeightEntry(user.id, date, Number(weight))

      router.push("/weight-chart")
    } catch (err) {
      console.error("Error inserting data:", err)
      setError("Failed to save weight. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full px-4 sm:px-6">
      <div className="max-w-5xl mx-auto mt-4 sm:mt-6 bg-white rounded-lg">
        <div className="border-b-2 border-snd-bkg pb-4 m-4 sm:m-6 pt-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-nav-bkg mb-2 tracking-tight dark:text-black">
            Record Weight
          </h2>
          <p className="text-base sm:text-lg text-gray-700">
            Ready to check in? Let's see what the scale has to say today!
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6"
        >
          <div className="flex flex-col">
            <label
              htmlFor="date"
              className="text-gray-600 mb-1 text-sm sm:text-base"
            >
              Date:
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:border-logo-green text-sm sm:text-base text-black"
              max={new Date().toISOString().substr(0, 10)}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="weight"
              className="text-gray-600 mb-1 text-sm sm:text-base"
            >
              Weight (lbs):
            </label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:border-logo-green text-sm sm:text-base text-black"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto relative bg-logo-green dark:bg-snd-bkg py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:opacity-90 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Add Weight"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
