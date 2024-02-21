"use client"

import React, { useState } from "react"

import { IoClose } from "react-icons/io5"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function TrackerPage() {
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10))
  const [weight, setWeight] = useState("")
  const [submittedData, setSubmittedData] = useState(null)

  const supabase = createClient()

  const router = useRouter()

  const handleSubmit = async (event) => {
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

      const { data1, error1 } = await supabase.from("profiles_weight").insert([
        {
          date_entry: date,
          profiles_weight: weight,
        },
      ])
      if (error1) {
        console.error("Error inserting data into profiles_weight:", error1)
      } else {
        console.log("Data inserted successfully into profiles_weight:", data1)
      }
    }
  }

  const handleChartButton = () => {
    router.push("/tracker/chart")
  }

  return (
    <div className="container mx-auto p-4">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <div className="bg-white rounded-lg p-8 shadow-lg relative">
          <IoClose
            className="text-gray-600 hover:text-gray-800 cursor-pointer absolute top-0 right-0 mt-2 mr-2"
            onClick={handleChartButton}
          />
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
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-full focus:outline-none"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
