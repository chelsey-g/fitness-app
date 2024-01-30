// import BackButton from "@/components/BackButton"
import Navigation from "@/components/Navigation"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

export default async function CompetitionPage(props) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  let { data: competitionData, error } = await supabase
    .from("competitions")
    .select(`*, competitions_players (*, players:players (first_name))`)
    .eq("name", props.params.name)
  if (error) {
    console.error("Error fetching data:", error)
  } else {
    console.log("hello", competitionData)
  }

  const handleDate = (date) => {
    const newDate = new Date(date)
    return newDate.toDateString()
  }

  return (
    <div className="p-4">
      <Navigation />
      <div className="bg-trd-bkg">
        {competitionData?.map((competition, index) => (
          <div
            key={index}
            className="bg-white shadow-md p-4 mb-4 rounded-lg mt-5"
          >
            <h2 className="text-x text-trd-bkg font-bold mb-3 align-center">
              {competition.name}
            </h2>

            {competition.competitions_players.map(
              (comp_players, playerIndex) => (
                <div key={playerIndex} className="mb-2">
                  <p className="text-sm text-blue-800">
                    Player Name: {comp_players.players.first_name}
                  </p>
                  {/* only an admin to the comp can see the weight */}
                  <p className="text-red-500"> Starting Weight: 150 pounds</p>
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
