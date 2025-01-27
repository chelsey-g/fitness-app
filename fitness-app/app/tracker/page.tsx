"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import BackButton from "@/components/BackButton"

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

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto mt-6 bg-white rounded-lg relative">
        <BackButton />

        <div className="border-b-2 border-snd-bkg pb-4 m-6 pt-6">
          <h2 className="text-4xl font-extrabold text-nav-bkg mb-2 tracking-tight dark:text-black">
            Record Weight
          </h2>
          <p className="text-lg text-gray-700">
            Track your progress and review your past entries to stay on top of
            your fitness goals.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
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
              className="relative bg-logo-green dark:bg-snd-bkg py-3 px-6 rounded-lg hover:opacity-90"
            >
              Add Weight
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
