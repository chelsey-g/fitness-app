"use client"

import React, { useState } from "react"

import Navigation from "./Navigation"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

const CompetitionForm = () => {
  const supabase = createClient()
  const router = useRouter()
  const [competitionData, setCompetitionData] = useState({
    name: "",
    // numberOfPeople: "",
    date_started: "",
    date_ending: "",
  })

  const handleChange = (e) => {
    setCompetitionData({ ...competitionData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Competition Data:", competitionData)

    const { data, error } = await supabase
      .from("competitions")
      .insert([competitionData])

    if (error) {
      console.error("Error inserting data:", error)
    } else {
      console.log("Data inserted successfully:", data)
    }
    router.push("/competitions")
  }

  return (
    <>
      <Navigation />
      <div className="p-4 mb-5 mt-8 rounded-lg">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name of Competition
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Competition Name"
              name="name"
              value={competitionData.name}
              onChange={handleChange}
            />
          </div>
          {/* <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="numberOfPeople"
      >
        Number of People
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="numberOfPeople"
        type="number"
        placeholder="Number of People"
        name="numberOfPeople"
        value={competitionData.numberOfPeople}
        onChange={handleChange}
      />
    </div> */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="date_started"
            >
              Start Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="date_started"
              type="date"
              name="date_started"
              value={competitionData.date_started}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="date_ending"
            >
              End Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="date_ending"
              type="date"
              name="date_ending"
              value={competitionData.date_ending}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Create Competition
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default CompetitionForm
