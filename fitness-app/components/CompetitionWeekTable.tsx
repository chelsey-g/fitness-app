import { getAwardColor, getOrdinalSuffix } from "@/app/functions"

import { TbAwardFilled } from "react-icons/tb"
import dayjs from "dayjs"

export default function CompetitionWeekTable({
  competitionData,
}: {
  competitionData: any
}) {
  const startOfWeek = dayjs().startOf("week").format("YYYY-MM-DD")
  const endOfWeek = dayjs().endOf("week").format("YYYY-MM-DD")

  type differenceType = {
    player: string
    percentageChange: number
  }

  type profiles = {
    first_name: string
    last_name: string
  }

  function getInitialWeight(player: any) {
    const closestInitialDate = player.profiles.weight_tracker.reduce(
      (a: any, b: any) =>
        Math.abs(
          new Date(b.date_entry).getTime() - new Date(endOfWeek).getTime()
        ) <
        Math.abs(
          new Date(a.date_entry).getTime() - new Date(startOfWeek).getTime()
        )
          ? b
          : a
    )
    return closestInitialDate.weight
  }

  function getCurrentWeight(player: any) {
    const closestCurrentDate = player.profiles.weight_tracker.reduce(
      (a: any, b: any) =>
        Math.abs(
          new Date(a.date_entry).getTime() - new Date(endOfWeek).getTime()
        ) <
        Math.abs(
          new Date(b.date_entry).getTime() - new Date(startOfWeek).getTime()
        )
          ? a
          : b
    )

    return closestCurrentDate.weight
  }

  const difference: differenceType[] = []
  if (competitionData) {
    competitionData.forEach((competition: any) => {
      competition.competitions_players.forEach((player: any) => {
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

  console.log(competitionData)

  return (
    <div className="my-4 mx-auto max-w-screen-md">
      <h2 className="text-2xl font-bold mb-4">Current Week</h2>
      <table className="table-auto w-full">
        <tbody>
          {competitionData.flatMap((competition: any) =>
            competition.competitions_players
              .slice(0, 3)
              .map((player: any, index: any) => (
                <tr key={index}>
                  <td className="px-2 py-3 text-gray-700 font-semibold flex items-center">
                    <div
                      className={`mr-2 ${getAwardColor(
                        index + 1
                      )} rounded-full h-6 w-6 flex items-center justify-center`}
                    >
                      <TbAwardFilled className="h-4 w-4" />
                    </div>
                    <span className="mr-2">{getOrdinalSuffix(index + 1)}</span>
                    <span className="text-gray-700 font-semibold mr-2">
                      {player.profiles.first_name}
                    </span>
                    <span className="text-gray-700 font-semibold">
                      {difference
                        .sort((a, b) => b.percentageChange - a.percentageChange)
                        [index].percentageChange.toFixed(2)}
                      %
                    </span>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  )
}
