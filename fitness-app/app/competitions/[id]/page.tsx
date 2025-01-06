"use client"

import { getAwardColor, getOrdinalSuffix } from "@/app/functions"

import BackButton from "@/components/BackButton"
import Navigation from "@/components/Navigation"
import { TbAwardFilled } from "react-icons/tb"
import { createClient } from "@/utils/supabase/client"
import { handleDate } from "@/app/functions"
import useSWR from "swr"

export default function CompetitionPage(props: any) {
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

  const handleDaysLeft = (date: any | number | Date) => {
    const today = new Date()
    const competitionEndDate: any = new Date(date)
    const timeDifference = competitionEndDate.getTime() - today.getTime()
    const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24))
    return daysLeft
  }

  function getInitialWeight(player: any, competitionData: any) {
    if (!player?.profiles?.weight_tracker?.length) {
      return 0
    }
    const closestInitialDate = player.profiles.weight_tracker.reduce(
      (a: any, b: any) =>
        Math.abs(
          new Date(b.date_entry).getTime() -
            new Date(competitionData.date_ending).getTime()
        ) <
        Math.abs(
          new Date(a.date_entry).getTime() -
            new Date(competitionData.date_started).getTime()
        )
          ? a
          : b
    )
    return closestInitialDate.weight
  }

  function getCurrentWeight(player: any, competitionData: any) {
    if (!player?.profiles?.weight_tracker?.length) {
      return 0
    }
    const closestCurrentDate = player.profiles.weight_tracker.reduce(
      (a: any, b: any) =>
        Math.abs(
          new Date(b.date_entry).getTime() -
            new Date(competitionData.date_started).getTime()
        ) <
        Math.abs(
          new Date(a.date_entry).getTime() -
            new Date(competitionData.date_ending).getTime()
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
        const initialWeight = getInitialWeight(player, competition)
        const currentWeight = getCurrentWeight(player, competition)
        let percentageChange

        if (initialWeight === 0 || currentWeight === 0) {
          percentageChange = "No weight logged"
        } else {
          const weightChange = currentWeight - initialWeight
          percentageChange =
            ((weightChange / initialWeight) * 100).toFixed(2) + "%"
        }

        difference.push({
          player: player.profiles.first_name + " " + player.profiles.last_name,
          percentageChange: percentageChange,
          playerId: player.profiles.id,
        })
      })
    })
  }

  if (error) return <div className="text-center mt-20">Failed to load</div>
  if (isLoading)
    return (
      <div className="text-center mt-20">
        <span className="text-gray-700">Loading competition...</span>
      </div>
    )

  return (
    <div className="w-full">
      <Navigation />
      <div className="max-w-5xl mx-auto mt-6 bg-white rounded-lg shadow-lg p-6">
        {competitionData?.map((competition, index) => (
          <div key={index} className="border-b-2 pb-6 mb-6">
            <BackButton />
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-extrabold text-nav-bkg tracking-tight">
                {competition.name}
              </h1>
            </div>
            <div className="text-lg text-gray-700 mb-4">
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
            <p
              className={`text-center mb-6 font-bold text-2xl py-4 px-6 rounded-lg shadow-lg transition-transform duration-800 ${
                handleDaysLeft(competition.date_ending) <= 0
                  ? "bg-red-500 text-white animate-bounce"
                  : "bg-snd-bkg text-white animate-pulse"
              }`}
            >
              {handleDaysLeft(competition.date_ending) <= 0
                ? "This competition has ended!"
                : `Only ${handleDaysLeft(
                    competition.date_ending
                  )} days left of the competition`}
            </p>

            <h2 className="text-xl font-semibold text-center mb-4">
              Overall Competition Stats
            </h2>
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-700">Rank</th>
                    <th className="px-4 py-3 text-left text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-gray-700">
                      % Change
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {difference
                    .sort(
                      (a: any, b: any) =>
                        b.percentageChange - a.percentageChange
                    )
                    .map((player, playerIndex) => (
                      <tr
                        key={playerIndex}
                        className={`${
                          playerIndex % 2 === 0 ? "bg-gray-100" : "bg-white"
                        }`}
                      >
                        <td className="border px-4 py-3 flex items-center">
                          {playerIndex < 3 ? (
                            <TbAwardFilled
                              className={`mr-2 ${getAwardColor(
                                playerIndex + 1
                              )}`}
                            />
                          ) : null}
                          {getOrdinalSuffix(playerIndex + 1)}
                        </td>
                        <td className="border px-4 py-3">{player.player}</td>
                        <td className="border px-4 py-3">
                          {player.percentageChange}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {competition.rules && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Rules</h3>
                <div className="bg-gray-100 p-4 rounded-md">
                  <pre className="text-sm text-gray-800">
                    {competition.rules}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
