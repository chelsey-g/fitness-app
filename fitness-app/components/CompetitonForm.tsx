"use client"

import React, { useState } from "react"

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
  })
  const [addPlayers, setAddPlayers] = useState(false)
  const [players, setPlayers] = useState([{ first_name: "", last_name: "" }])

  const handleChange = (e) => {
    setCompetitionData({ ...competitionData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { data: competitions, error: competitionError } = await supabase
      .from("competitions")
      .insert([competitionData])

    console.log("Competition inserted successfully:", competitions)
    const playersData = players.map((player) => ({
      ...player,
    }))
    const { data: playersInfo, error: playersError } = await supabase
      .from("players")
      .insert(playersData)

    console.log("Players inserted successfully:", playersInfo)

    router.push("/competitions")
  }

  const handleAddPlayers = (e) => {
    e.target.value === "yes" ? setAddPlayers(true) : setAddPlayers(false)
  }
  const handlePlayersChange = (index, e) => {
    const updatedPlayers = players.map((player, playerIndex) => {
      if (index === playerIndex) {
        return { ...player, [e.target.name]: e.target.value }
      }
      return player
    })
    setPlayers(updatedPlayers)
  }

  //remove and add player fields
  const addPlayerFields = () => {
    setPlayers([...players, { first_name: "", last_name: "" }])
  }
  const removePlayerFields = (index) => {
    setPlayers(players.filter((_, playerIndex) => index !== playerIndex))
  }

  return (
    <>
      <Navigation />
      <div className="p-4 mb-5 mt-8 rounded-lg">
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
              htmlFor="players"
            >
              Adding Players?
            </label>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <input
                className="mr-2"
                type="radio"
                name="players"
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
                name="players"
                value="no"
                onChange={handleAddPlayers}
                checked={addPlayers === false}
              />
              No
            </label>
          </div>
          {addPlayers &&
            players.map((player, index) => (
              <div key={index} className="mb-4">
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="First Name"
                  name="first_name"
                  value={player.first_name}
                  onChange={(e) => handlePlayersChange(index, e)}
                />
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Last Name"
                  name="last_name"
                  value={player.last_name}
                  onChange={(e) => handlePlayersChange(index, e)}
                />
                {players.length > 1 && (
                  <button
                    type="button"
                    className="bg-snd-bkg hover:opacity-90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => removePlayerFields(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          {addPlayers && (
            <button
              type="button"
              onClick={addPlayerFields}
              className="bg-snd-bkg hover:opacity-90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-3"
            >
              Add More Players
            </button>
          )}
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
