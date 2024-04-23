"use client"

import { getAwardColor, getOrdinalSuffix } from "@/app/functions"

import BackButton from "@/components/BackButton"
import CompetitionWeekTable from "@/components/CompetitionWeekTable"
import Navigation from "@/components/Navigation"
import { TbAwardFilled } from "react-icons/tb"
import { createClient } from "@/utils/supabase/client"
import { handleDate } from "@/app/functions"
import useSWR from "swr"
import { useState } from "react"

export default function CompetitionPage(props) {
  const [showQuitButton, setShowQuitButton] = useState(false)
  const supabase = createClient()
  const {
    data: competitionData,
    error,
    isLoading,
  } = useSWR("/competitions/name", () =>
    supabase
      .from("competitions")
      .select(
        "*, competitions_players(*, profiles(id,first_name, last_name, weight_tracker(weight, date_entry)))"
      )
      .eq("id", props.params.id)
      .then((res) => res.data)
  )

  if (error) return <div>failed to load</div>
  if (isLoading)
    return (
      <div>
        <span className="text-gray-700">Loading competition...</span>
      </div>
    )

  const handleDaysLeft = (date) => {
    const today = new Date()
    const competitionEndDate = new Date(date)
    const timeDifference = competitionEndDate - today
    const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24))
    return daysLeft
  }

  function getInitialWeight(player, competitionData) {
    const closestInitialDate = player.profiles.weight_tracker.reduce((a, b) =>
      Math.abs(new Date(b.date_entry) - new Date(competitionData.date_ending)) <
      Math.abs(new Date(a.date_entry) - new Date(competitionData.date_started))
        ? a
        : b
    )
    return closestInitialDate.weight
  }

  function getCurrentWeight(player, competitionData) {
    const closestCurrentDate = player.profiles.weight_tracker.reduce((a, b) =>
      Math.abs(
        new Date(b.date_entry) - new Date(competitionData.date_started)
      ) <
      Math.abs(new Date(a.date_entry) - new Date(competitionData.date_ending))
        ? b
        : a
    )
    return closestCurrentDate.weight
  }

  const difference = []
  if (competitionData) {
    competitionData.forEach((competition) => {
      competition.competitions_players.forEach((player) => {
        const initialWeight = getInitialWeight(player, competitionData)
        const currentWeight = getCurrentWeight(player, competitionData)
        const weightChange = currentWeight - initialWeight
        const percentageChange = (weightChange / initialWeight) * 100

        difference.push({
          player: player.profiles.first_name + " " + player.profiles.last_name,
          percentageChange: percentageChange,
        })
      })
    })
  } else {
    console.log("No player data found")
  }

  function handleRemovePlayer(player) {
    const { error } = supabase.from("competitions_players").delete()
    // .eq("player_id", .competitions_players[0].profiles.id)
    if (error) {
      console.error("Error removing player:", error)
    }
  }

  if (competitionData.date_ending > new Date()) {
    setShowQuitButton(true)
  }

  return (
    <div className="p-4">
      <Navigation />

      {competitionData?.map((competition, index) => (
        <div
          key={index}
          className="bg-white shadow-lg p-6 mb-6 rounded-lg mt-6"
        >
          <BackButton />
          <h2 className="text-3xl font-bold">{competition.name}</h2>
          <h3 className="text-xl font-semibold text-trd-bkg mb-6">
            {competition.competitions_players.length} Competitors
          </h3>
          <div className="flex justify-center text-gray-700 mb-6 flex-col items-center">
            <div className="flex align-center">
              <p className="text-lg font-semibold mr-5">
                Start Date:{" "}
                <span className="font-medium">
                  {handleDate(competition.date_started)}
                </span>
              </p>
              <p className="text-lg font-semibold">
                End Date:{" "}
                <span className="font-medium">
                  {handleDate(competition.date_ending)}
                </span>
              </p>
            </div>
            <div className="flex items-center text-xs italic text-green-500">
              {handleDaysLeft(competition.date_ending) <= 0 ? (
                <div className="text-red-500">This competition has ended!</div>
              ) : (
                <div>
                  Only {handleDaysLeft(competition.date_ending)} days left of
                  the competition! Keep pushing!
                </div>
              )}
            </div>
            <CompetitionWeekTable competitionData={competitionData} />
          </div>

          <div className="overflow-x-auto">
            <h3 className="text-xl font-semibold">Overall Competition Stats</h3>

            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-lg font-medium">
                    Ranking
                  </th>
                  <th className="px-4 py-3 text-left text-lg font-medium">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-lg font-medium">
                    % Lost/Gain
                  </th>
                </tr>
              </thead>
              <tbody>
                {competition.competitions_players.map(
                  (comp_players, playerIndex) => (
                    <tr
                      key={playerIndex}
                      className={
                        playerIndex % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }
                    >
                      <td className="border px-4 py-3 text-gray-700 font-semibold flex items-center ">
                        {playerIndex < 3 ? (
                          <>
                            <TbAwardFilled
                              className={`mr-2 justify-center ${getAwardColor(
                                playerIndex + 1
                              )} rounded-full`}
                            />
                            {getOrdinalSuffix(playerIndex + 1)}
                          </>
                        ) : (
                          getOrdinalSuffix(playerIndex + 1)
                        )}
                      </td>
                      <td className="border px-4 py-3 text-gray-700 font-semibold">
                        {
                          difference.sort((a, b) =>
                            a.player.localeCompare(b.player)
                          )[playerIndex]?.player
                        }
                      </td>
                      <td className="border px-4 py-3 text-gray-700 font-semibold">
                        {difference
                          .sort(
                            (a, b) => a.percentageChange - b.percentageChange
                          )
                          [playerIndex]?.percentageChange.toFixed(2) + "%"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            {competition.rules && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Rules</h3>
                <div className="bg-gray-100 rounded-lg p-4">
                  <pre className="text-sm text-gray-800 font-sans overflow-auto">
                    {competition.rules}
                  </pre>
                </div>
              </div>
            )}
          </div>
          {showQuitButton && (
            <div className="flex justify-center">
              <button
                className="bg-snd-bkg hover:opacity-90 text-white font-bold py-2 px-4 mt-5 rounded flex items-center"
                onClick={() => handleRemovePlayer()}
              >
                Quit
              </button>
            </div>
          )}
        </div>
      ))}
      <div className="font-bold text-center text-xs">
        Updated {handleDate(new Date())}
      </div>
    </div>
  )
}
