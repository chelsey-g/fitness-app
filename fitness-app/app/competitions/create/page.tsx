"use client"

import { useState } from "react"

import AddPlayers from "@/components/AddPlayers"
import { useRouter } from "next/navigation"
import BackButton from "@/components/BackButton"
import { getOrdinalSuffix } from "@/app/functions"
import { AuthService } from "@/app/services/AuthService"
import { createClient } from "@/utils/supabase/client"


const supabase = createClient();
const authService = new AuthService(supabase);




export default function CreateCompetitionPage() {
  const router = useRouter()

  const [competitionData, setCompetitionData] = useState({
    name: "",
    date_started: "",
    date_ending: "",
    rules: "",
    has_prizes: false,
    prizes: [
      { place: 1, reward: "" },
      { place: 2, reward: "" },
      { place: 3, reward: "" },
    ],
  })
  const [addPlayers, setAddPlayers] = useState(false)
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([])



  const handleSelectPlayers = (selectedPlayers: any) => {
    setSelectedPlayerIds(selectedPlayers)
  }

  const handleChange = (e: any) => {
    setCompetitionData({ ...competitionData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const user = await authService.getUser()

    if (!user) {
      redirect("/sign-in")
    }

    if (!competitionData.name) {
      alert("Please enter a competition name")
      return false
    }

    if (!competitionData.date_started || !competitionData.date_ending) {
      alert("Please select both start and end dates")
      return
    }

    const competitionInfo = await competitionService.createCompetition({
      ...competitionData,
      created_by: user?.id,
      prizes: competitionData.has_prizes ? competitionData.prizes : null,
    })

    console.log('COMPETITION INFO', competitionInfo)

    if (competitionInfo && competitionInfo.length > 0) {
      router.push(`/competitions/${competitionInfo[0].id}`)
    } else {
      console.error('Failed to create competition')
      alert('Failed to create competition. Please try again.')
    }
  }

  const handleAddPlayers = (e: any) => {
    setAddPlayers(e.target.value === "yes")
  }

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <div className="max-w-5xl mx-auto mt-6 bg-white dark:text-black rounded-lg relative">
          <BackButton />
          <div className="border-b-2 border-snd-bkg pb-4 m-6 pt-6">
            <h2 className="text-4xl font-extrabold mb-2 tracking-tight">
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
                className="p-3 border border-gray-300 rounded-md focus:border-logo-green focus:ring focus:ring-logo-green"
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
                    className="mr-2 text-snd-bkg focus:border-snd-bkg focus:ring focus:ring-snd-bkg"
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
                    className="mr-2 text-snd-bkg focus:border-snd-bkg focus:ring focus:ring-snd-bkg"
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

            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-gray-600 mb-1">Include Prizes</label>
                <div className="flex items-center">
                  <label className="flex items-center mr-4">
                    <input
                      type="radio"
                      name="has_prizes"
                      value="yes"
                      onChange={(e) =>
                        setCompetitionData({
                          ...competitionData,
                          has_prizes: e.target.value === "yes",
                        })
                      }
                      checked={competitionData.has_prizes === true}
                      className="mr-2 text-snd-bkg focus:border-snd-bkg focus:ring focus:ring-snd-bkg"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="has_prizes"
                      value="no"
                      onChange={(e) =>
                        setCompetitionData({
                          ...competitionData,
                          has_prizes: e.target.value === "yes",
                        })
                      }
                      checked={competitionData.has_prizes === false}
                      className="mr-2 text-snd-bkg focus:border-snd-bkg focus:ring focus:ring-snd-bkg"
                    />
                    No
                  </label>
                </div>
              </div>

              {competitionData.has_prizes && (
                <div className="space-y-4 rounded-lg p-4">
                  {competitionData.prizes.map((prize, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-gray-600 mb-1">
                          {getOrdinalSuffix(prize.place)} Place
                        </label>
                        <input
                          type="text"
                          value={prize.reward}
                          onChange={(e) => {
                            const newPrizes = [...competitionData.prizes]
                            newPrizes[index].reward = e.target.value
                            setCompetitionData({
                              ...competitionData,
                              prizes: newPrizes,
                            })
                          }}
                          placeholder="Ex. $100, a trophy, etc."
                          className="p-3 border border-gray-300 rounded-md focus:border-logo-green focus:ring focus:ring-logo-green"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
                required
                className="p-3 border border-gray-300 rounded-md focus:border-logo-green focus:ring focus:ring-logo-green"
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
                required
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md focus:border-logo-green focus:ring focus:ring-logo-green"
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
                className="p-3 border border-gray-300 rounded-md focus:border-logo-green focus:ring focus:ring-logo-green"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-logo-green dark:bg-snd-bkg text-black dark:text-white font-medium hover:opacity-90"
              >
                Create Competition
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
