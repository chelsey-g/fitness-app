"use client"

import BackButton from "@/components/BackButton"
import Navigation from "@/components/Navigation"
import { ProgressBar } from "@/components/ProgressBar"
import { TbAwardFilled } from "react-icons/tb"
import { createClient } from "@/utils/supabase/client"
import dayjs from "dayjs"
import useSWR from "swr"

export default function CompetitionPage(props) {
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
      .eq("name", props.params.name)
      .then((res) => res.data)
  )
  if (error) return <div>failed to load</div>
  if (isLoading)
    return (
      <div>
        {/* <ProgressBar /> */}
        <span className="text-gray-700">Loading competition...</span>
      </div>
    )

  if (error) {
    console.error("Error fetching data:", error)
  } else {
    console.log("competitionData", competitionData)
  }

  function handleDate(date) {
    return dayjs(date).format("MM/DD/YYYY")
  }

  const handleDaysLeft = (date) => {
    const today = new Date()
    const competitionEndDate = new Date(date)
    const timeDifference = competitionEndDate - today
    const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24))
    return daysLeft
  }

  function getOrdinalSuffix(number) {
    const suffixes = ["th", "st", "nd", "rd"]
    const v = number % 100
    return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
  }

  function getAwardColor(position) {
    if (position === 1) {
      return "text-yellow-500"
    } else if (position === 2) {
      return "text-gray-500"
    } else if (position === 3) {
      return "text-yellow-800"
    }
  }

  function getInitialWeight(player) {
    const closestInitialDate = player.profiles.weight_tracker.reduce((a, b) =>
      Math.abs(new Date(b.date_entry) - new Date(competitionData.date_ending)) <
      Math.abs(new Date(a.date_entry) - new Date(competitionData.date_started))
        ? a
        : b
    )
    return closestInitialDate.weight
  }

  function getCurrentWeight(player) {
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
        const initialWeight = getInitialWeight(player)
        const currentWeight = getCurrentWeight(player)
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
            <div className="flex items-center text-xs italic">
              Only {handleDaysLeft(competition.date_ending)} days left of the
              competition! Keep pushing!
            </div>
          </div>

          <div className="overflow-x-auto">
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
            <div className="align-right mt-6">
              <div className="italic">
                * Only the top 3 competitors will be awarded
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button className="bg-snd-bkg hover:opacity-90 text-white font-bold py-2 px-4 mt-5 rounded flex items-center">
              Quit
            </button>
          </div>
        </div>
      ))}
      <div className="font-bold text-center text-xs">
        Updated {handleDate(new Date())}
      </div>
    </div>
  )
}
