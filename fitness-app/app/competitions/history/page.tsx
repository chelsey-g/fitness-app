"use client"

import useSWR, { Fetcher } from "swr"

import DropdownMenuDemo from "@/components/CompetitionsActions"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function CompetitionHistoryPage() {
  const supabase = createClient()
  const router = useRouter()

  interface CompetitionHistory {
    name: string
    id: string
    date_started: string
    date_ending: string
  }

  const fetcher: Fetcher<CompetitionHistory[], string> = async (
    url: string
  ) => {
    const today = new Date()
    const { data, error } = await supabase
      .from("competitions")
      .select(`name, id, date_started, date_ending`)
      .order("date_ending", { ascending: false })
    if (error) {
      throw new Error(error.message)
    }
    return data.filter((comp) => new Date(comp.date_ending) < today)
  }

  const {
    data: competitions,
    error,
    isLoading,
  } = useSWR<CompetitionHistory[]>("/competitionHistory", fetcher)
  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>

  function getRandomColor() {
    const colors = ["bg-snd-bkg", "bg-trd-bkg", "bg-nav-bkg"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const handleDeleteCompetition = async (id: string) => {
    let { error } = await supabase.from("competitions").delete().eq("id", id)
    if (error) {
      console.log("error", error)
    }
  }

  const handleShowActiveCompetitions = () => {
    router.push("/competitions")
  }

  return (
    <div>
      <Navigation />
      <h1 className="p-4 text-2xl font-semibold text-white">
        Competition History
      </h1>
      <div className="p-4">
        {competitions?.map((result, index) => (
          <div
            key={index}
            className="flex items-center justify-between mb-4 p-2 pr-5 bg-white shadow-md rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${getRandomColor()}`}
              >
                <span className="text-white text-sm font-semibold">
                  {result.name.charAt(0).toUpperCase()}
                </span>
              </div>

              <Link
                href={`/competitions/${result.name}`}
                className="ml-3 text-black hover:text-blue-800 font-medium flex items-center"
              >
                {result.name}
                <div className="text-gray-500 text-sm ml-4">
                  (Ended on: {new Date(result.date_ending).toLocaleDateString()}
                  )
                </div>
              </Link>
            </div>
            <DropdownMenuDemo
              deleteCompetition={() => handleDeleteCompetition(result.id)}
            />
          </div>
        ))}
        <div className="flex justify-center">
          <button
            className="bg-snd-bkg hover:opacity-90 text-white font-bold py-2 px-4 mb-10 mt-5 rounded flex items-center"
            onClick={handleShowActiveCompetitions}
          >
            View Active Competitions
          </button>
        </div>
      </div>
    </div>
  )
}
