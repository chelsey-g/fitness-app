"use client"

import { getAwardColor, getOrdinalSuffix } from "@/app/functions"

import BackButton from "@/components/BackButton"
// import CompetitionWeekTable from "@/components/CompetitionWeekTable"
import Navigation from "@/components/Navigation"
import { TbAwardFilled } from "react-icons/tb"
import { createClient } from "@/utils/supabase/client"
import { handleDate } from "@/app/functions"
import useSWR from "swr"
import { useState } from "react"

export default function CompetitionPage(props: any) {
  // const [showQuitButton, setShowQuitButton] = useState(false)

  const supabase = createClient()
  const {
    data: competitionData,
    error,
    isLoading,
  } = useSWR("/competitions/name", async () => {
    const { data } = await supabase
      .from("competitions")
      .select(
        "*, competitions_players(*, profiles(id,first_name, last_name, weight_tracker(weight, date_entry)))"
      )
      .eq("id", props.params.id)
    return data
  })

  console.log(competitionData, "hi")

  if (error) return <div>Failed to load</div>
  if (isLoading)
    return (
      <div className="text-center mt-20">
        <span className="text-gray-700">Loading competition...</span>
      </div>
    )

  const handleDaysLeft = (date: any | number | Date) => {
    const today = new Date()
    const competitionEndDate: any = new Date(date)
    const timeDifference = (competitionEndDate as any) - (today as any)
    const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24))
    return daysLeft
  }

  function getInitialWeight(player: any, competitionData: any) {
    const closestInitialDate = player?.profiles.weight_tracker.reduce(
      (a: any, b: any) =>
        Math.abs(
          (new Date(b.date_entry) as any) -
            (new Date(competitionData.date_ending) as any)
        ) <
        Math.abs(
          (new Date(a.date_entry) as any) -
            (new Date(competitionData.date_started) as any)
        )
          ? a
          : b
    )
    return closestInitialDate.weight
  }

  function getCurrentWeight(player: any, competitionData: any) {
    const closestCurrentDate = player.profiles.weight_tracker.reduce(
      (a: any, b: any) =>
        Math.abs(
          (new Date(b.date_entry) as any) -
            (new Date(competitionData.date_started) as any)
        ) <
        Math.abs(
          (new Date(a.date_entry) as any) -
            (new Date(competitionData.date_ending) as any)
        )
          ? b
          : a
    )
    return closestCurrentDate.weight
  }

  const difference: any | null = []
  if (competitionData) {
    competitionData.forEach((competition) => {
      competition.competitions_players.forEach((player: any | null) => {
        const initialWeight = getInitialWeight(player, competitionData)
        const currentWeight = getCurrentWeight(player, competitionData)
        const weightChange = currentWeight - initialWeight
        const percentageChange = (weightChange / initialWeight) * 100

        difference.push({
          player: player.profiles.first_name + " " + player.profiles.last_name,
          percentageChange: percentageChange,
          playerId: player.profiles.id,
        })
      })
    })
  }

  function handleRemovePlayer(playerId: number | null) {
    supabase
      .from("competitions_players")
      .delete()
      .eq("player_id", playerId)
      .then(({ error }) => {
        if (error) {
          console.error("Error removing player:", error)
        } else {
          console.log("Player removed successfully")
        }
      })
  }

  return (
    <div className="p-4 min-h-screen">
      <Navigation />

      {competitionData?.map((competition, index) => (
        <div
          key={index}
          className="bg-white shadow-lg p-8 mb-8 rounded-lg mt-6 mx-auto max-w-5xl"
        >
          <div className="flex justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {competition.name}
            </h2>
            <BackButton />
          </div>
          <h3 className="text-xl font-semibold text-trd-bkg mb-6">
            {competition.competitions_players.length}{" "}
            {competition.competitions_players.length === 1
              ? "Competitor"
              : "Competitors"}
          </h3>

          <div className="flex flex-col items-center text-gray-700 mb-6">
            <div className="flex justify-around w-full text-lg font-semibold mb-2">
              <p>
                Start Date:{" "}
                <span className="font-medium">
                  {handleDate(competition.date_started)}
                </span>
              </p>
              <p>
                End Date:{" "}
                <span className="font-medium">
                  {handleDate(competition.date_ending)}
                </span>
              </p>
            </div>
            <div className="text-xs italic text-green-500">
              {handleDaysLeft(competition.date_ending) <= 0 ? (
                <div className="text-red-500">This competition has ended!</div>
              ) : (
                <div>
                  Only {handleDaysLeft(competition.date_ending)} days left of
                  the competition
                </div>
              )}
            </div>
            {/* <CompetitionWeekTable competitionData={competitionData} /> */}
          </div>

          <div className="overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Overall Competition Stats
            </h3>

            <div className="flex justify-center">
              <table className="table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-3 text-left text-lg font-medium text-gray-700">
                      Ranking
                    </th>
                    <th className="px-4 py-3 text-left text-lg font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-lg font-medium text-gray-700">
                      % Lost/Gain
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {difference
                    .sort(
                      (a: any, b: any) =>
                        b.percentageChange - a.percentageChange
                    )
                    .map((player: any, playerIndex: any) => (
                      <tr
                        key={playerIndex}
                        className={
                          playerIndex % 2 === 0 ? "bg-gray-100" : "bg-white"
                        }
                      >
                        <td className="border px-4 py-3 text-gray-700 font-semibold flex items-center">
                          {playerIndex < 3 ? (
                            <>
                              <TbAwardFilled
                                className={`mr-2 ${getAwardColor(
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
                          {player.player}
                        </td>
                        <td className="border px-4 py-3 text-gray-700 font-semibold">
                          {player.percentageChange.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="flex font-bold justify-center text-xs mt-4">
              Updated {handleDate(new Date())}
            </div>
            {competition.rules && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2 text-center">
                  Rules
                </h3>
                <div className="bg-gray-100 rounded-lg p-4">
                  <pre className="text-sm text-gray-800 font-sans overflow-auto">
                    {competition.rules}
                  </pre>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center"
              onClick={() =>
                handleRemovePlayer(
                  competition.competitions_players[0].profiles.id
                )
              }
            >
              Quit Competition
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
