"use client"

import React, { useEffect, useState } from "react"

import AddPlayers from "@/components/AddPlayers"
import Navigation from "./Navigation"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import BackButton from "./BackButton"

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
  const [user, setUser] = useState<any | null>(null)

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

  const handleSelectPlayers = (selectedPlayers: any) => {
    setSelectedPlayerIds(selectedPlayers)
  }

  const handleChange = (e: any) => {
    setCompetitionData({ ...competitionData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
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
          created_by: user.id,
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

  const handleAddPlayers = (e: any) => {
    setAddPlayers(e.target.value === "yes")
  }

  return (
    <div className="w-full">
      <Navigation />
      <div className="max-w-5xl mx-auto">
        <div className="max-w-5xl mx-auto mt-6 bg-white rounded-lg relative">
          <BackButton />
          <div className="border-b-2 border-snd-bkg pb-4 m-6 pt-6">
            <h2 className="text-4xl font-extrabold text-nav-bkg mb-2 tracking-tight">
              Create Competition
            </h2>
            <p className="text-lg text-gray-700">
              Set up a new competition and invite players to join the fun.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1" htmlFor="name">
                Name of Competition
              </label>
              <input
                type="text"
                id="name"
                placeholder="Competition Name"
                name="name"
                value={competitionData.name}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 mb-1">Select Players</label>
              <div className="flex items-center">
                <label className="flex items-center mr-4">
                  <input
                    type="radio"
                    name="selectPlayers"
                    value="yes"
                    onChange={handleAddPlayers}
                    checked={addPlayers === true}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="selectPlayers"
                    value="no"
                    onChange={handleAddPlayers}
                    checked={addPlayers === false}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            {addPlayers && (
              <div className="mb-4" data-testid="add-players">
                <AddPlayers selectPlayers={handleSelectPlayers} />
              </div>
            )}

            <div className="flex flex-col">
              <label className="text-gray-600 mb-1" htmlFor="date_started">
                Start Date
              </label>
              <input
                type="date"
                id="date_started"
                name="date_started"
                value={competitionData.date_started}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 mb-1" htmlFor="date_ending">
                End Date
              </label>
              <input
                type="date"
                id="date_ending"
                name="date_ending"
                value={competitionData.date_ending}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 mb-1" htmlFor="rules">
                Rules
              </label>
              <textarea
                id="rules"
                name="rules"
                value={competitionData.rules}
                onChange={handleChange}
                rows={4}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="relative bg-button-bkg text-nav-bkg font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Create Competition
                <div className="absolute inset-0 rounded-lg bg-button-hover opacity-0 hover:opacity-20 transition duration-300"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
