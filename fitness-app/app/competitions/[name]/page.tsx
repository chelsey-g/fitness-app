import BackButton from "@/components/BackButton"
// import BackButton from "@/components/BackButton"
import Navigation from "@/components/Navigation"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

export default async function CompetitionPage(props) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  let { data: competitionData, error } = await supabase
    .from("competitions")
    .select(`*, competitions_players (*, profiles:profiles (first_name))`)
    .eq("name", props.params.name)
  if (error) {
    console.error("Error fetching data:", error)
  } else {
    console.log("hello", competitionData)
  }

  let { data: playerData, error: playerError } = await supabase
    .from("players_weight")
    .select("*")
  if (playerError) {
    console.error("Error fetching data:", playerError)
  }

  console.log("playerData", playerData)

  const handleDate = (date) => {
    const newDate = new Date(date)
    return newDate.toDateString()
  }

  const handleWeightPercentage = (startWeight, currentWeight) => {
    const percentage = ((startWeight - currentWeight) / startWeight) * 100
    return percentage
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
          <h2 className="text-xl font-semibold text-head-clr mb-4 text-center">
            {competition.name}
          </h2>
          <h3 className="text-md font-semibold text-trd-bkg mb-4 text-center">
            {competition.competitions_players.length} Players
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <p className="text-md">
              Start Date:{" "}
              <span className="font-semibold">
                {handleDate(competition.date_started)}
              </span>
            </p>
            <p className="text-md">
              End Date:{" "}
              <span className="font-semibold">
                {handleDate(competition.date_ending)}
              </span>
            </p>
          </div>
          <div className="mt-4">
            {competition.competitions_players.map(
              (comp_players, playerIndex) => (
                <div
                  key={playerIndex}
                  className="border-b border-gray-200 py-2"
                >
                  <p className="text-md text-gray-700">
                    Player Name:{" "}
                    <span className="font-semibold">
                      {comp_players.profiles.first_name}
                    </span>
                  </p>
                  {/* only an admin to the comp can see the weight */}
                  <p className="text-md text-red-600">
                    Starting Weight: 150 pounds
                  </p>
                  {/* only an admin to the comp can see the weight */}
                  <p className="text-md text-green-600">
                    Current Weight: 140 pounds
                  </p>
                  {/* all players can see this */}
                  <p className="text-md text-gray-700">
                    % Lost: <span className="font-semibold">-10%</span>
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
