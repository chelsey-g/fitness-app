"use client"

import { useState } from "react"
import Navigation from "@/components/Navigation"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function TrackerPage() {
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10))
  const [weight, setWeight] = useState("")
  const [submittedData, setSubmittedData] = useState(null)

  const supabase = createClient()

  const router = useRouter()

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    const { data, error } = await supabase.from("weight_tracker").insert([
      {
        date_entry: date,
        weight,
      },
    ])

    if (error) {
      console.error("Error inserting data into Supabase:", error)
    } else {
      console.log("Data inserted successfully:", data)
      setSubmittedData(data)
      router.push("/tracker/chart")
    }
  }

  const handleChartButton = () => {
    router.push("/tracker/chart")
  }

  return (
    <div className="w-full">
      <Navigation />
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-8 shadow-lg mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-black mb-2">
            Weight Tracker
          </h2>
          <h3 className="text-sm font-semibold text-gray-600">
            Submitting will automatically update your progress in any ongoing
            competitions.
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="date" className="text-gray-600 mb-1">
              Date:
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="weight" className="text-gray-600 mb-1">
              Weight (lbs):
            </label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="relative bg-button-bkg text-nav-bkg font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Add Weight
              <div className="absolute inset-0 rounded-lg bg-button-hover opacity-0 hover:opacity-20 transition duration-300"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
