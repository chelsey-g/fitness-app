"use client"

import React, { useEffect, useState } from "react"

import AddPlayers from "@/components/AddPlayers"
import BackButton from "@/components/BackButton"
import Navigation from "./Navigation"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function CompetitionForm() {
  const supabase = createClient()
  const router = useRouter()

  const [competitionData, setCompetitionData] = useState({
    name: "",
    date_started: "",
    date_ending: "",
    rules: "",
  })
  const [addPlayers, setAddPlayers] = useState(false)
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error("Error getting user:", error)
      } else {
        setUser(data.user)
      }
    }

    getUser()
  }, [])

  const handleSelectPlayers = (selectedPlayers) => {
    setSelectedPlayerIds(selectedPlayers)
  }

  const handleChange = (e) => {
    setCompetitionData({ ...competitionData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      console.error("User is not authenticated")
      return
    }

    const { data: competitionInfo, error: insertError } = await supabase
      .from("competitions")
      .insert([
        {
          name: competitionData.name,
          date_started: competitionData.date_started,
          date_ending: competitionData.date_ending,
          rules: competitionData.rules,
          created_by: user.id, // Assuming you have a created_by column
        },
      ])
      .select()

    if (insertError) {
      console.error("Error inserting competition:", insertError)
      return
    }

    const competitionId = competitionInfo?.[0]?.id

    if (!competitionId) {
      console.error("Competition ID not found after insertion")
      return
    }

    const { data: playerInsertData, error: playerInsertError } = await supabase
      .from("competitions_players")
      .insert(
        selectedPlayerIds.map((playerId) => ({
          player_id: playerId,
          competition_id: competitionId,
        }))
      )

    if (playerInsertError) {
      console.error("Error inserting competition players:", playerInsertError)
      return
    }

    console.log("Competition and players inserted successfully!")
    router.push("/competitions")
  }

  const handleAddPlayers = (e) => {
    setAddPlayers(e.target.value === "yes")
  }

  return (
    <>
      <div className="p-4 mb-5 mt-8 rounded-lg">
        <Navigation />
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <BackButton />
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name of Competition
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Competition Name"
              name="name"
              value={competitionData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="selectPlayers"
            >
              Select Players
            </label>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <input
                className="mr-2"
                type="radio"
                name="selectPlayers"
                value="yes"
                onChange={handleAddPlayers}
                checked={addPlayers === true}
              />
              Yes
            </label>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <input
                className="mr-2"
                type="radio"
                name="selectPlayers"
                value="no"
                onChange={handleAddPlayers}
                checked={addPlayers === false}
              />
              No
            </label>
          </div>
          {addPlayers && (
            <div className="mb-4">
              <AddPlayers selectPlayers={handleSelectPlayers} />
            </div>
          )}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 mt-4"
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
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="rules"
            >
              Rules
            </label>
            <textarea
              className="shadow appearance-none border rounded w-3/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="rules"
              name="rules"
              value={competitionData.rules}
              onChange={handleChange}
              rows={4}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-snd-bkg hover:opacity-90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
