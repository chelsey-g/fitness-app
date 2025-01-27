"use client"

import useSWR, { Fetcher } from "swr"

import DropdownMenuDemo from "@/components/CompetitionsActions"
import Link from "next/link"
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
    <>
      <div className="max-w-5xl mx-auto mt-6 bg-white dark:text-black rounded-lg shadow-md relative">
        <div className="absolute top-6 right-6">
          <button
            className="relative flex items-center px-4 py-2 rounded-md bg-logo-green dark:bg-snd-bkg text-black dark:text-white font-medium hover:opacity-90"
            onClick={handleShowActiveCompetitions}
          >
            Active Competitions
          </button>
        </div>

        <div className="border-b-2 border-snd-bkg pb-4 m-6 pt-6">
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
            Competition History
          </h1>
          <p className="text-lg text-gray-700">
            Review your past competitions and see how far you've come.
          </p>
        </div>

        <div className="p-4">
          {competitions?.map((result, index) => (
            <div
              key={index}
              className={`flex items-center justify-between mb-4 p-2 pr-5 bg-white rounded-lg hover:bg-gray-100 group ${
                competitions.length > 1 && index !== competitions.length - 1
                  ? "border-b pb-4"
                  : ""
              }`}
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
                  href={`/competitions/${result.id}`}
                  className="ml-3 text-black hover:text-snd-bkg font-medium"
                >
                  {result.name}
                </Link>
              </div>
              <span className="text-gray-500 text-sm ml-auto text-right">
                End Date: {new Date(result.date_ending).toLocaleDateString()}
              </span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center ml-4">
                <DropdownMenuDemo
                  deleteCompetition={() => handleDeleteCompetition(result.id)}
                />
              </div>
            </div>
          ))}

          {competitions?.length === 0 && (
            <div className="text-center py-10">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                No Active Competitions
              </h2>
              <p className="text-gray-500 text-lg mb-6">
                You haven’t joined or created any competitions yet. Start one
                today to stay motivated!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
