"use client"

import useSWR, { Fetcher } from "swr"
import { useAuth } from "@/contexts/AuthContext"
import dayjs from "dayjs"

import DropdownMenuDemo from "@/components/CompetitionsActions"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { getRandomColor } from "@/app/functions"

interface CompetitionHistory {
  name: string
  id: string
  date_started: string
  date_ending: string
  created_by: string
}

export default function CompetitionHistoryPage() {
  const supabase = createClient()
  const router = useRouter()
  const { user } = useAuth()

  const fetcher: Fetcher<CompetitionHistory[], string> = async () => {
    const today = dayjs().startOf('day')
    const { data, error } = await supabase
      .from("competitions")
      .select(`name, id, date_started, date_ending, created_by`)
      .order("date_ending", { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    // Filter for expired competitions only
    return data.filter((comp) => dayjs(comp.date_ending).isBefore(today))
  }

  const {
    data: competitions,
    error,
    isLoading,
    mutate
  } = useSWR<CompetitionHistory[]>(user ? "/competitionHistory" : null, fetcher)

  if (!user) {
    router.push('/login')
    return null
  }

  if (error) return (
    <div className="text-center py-10">
      <h2 className="text-2xl font-semibold text-red-600 mb-4">
        Failed to load competition history
      </h2>
      <p className="text-gray-500 text-lg">
        Please try refreshing the page
      </p>
    </div>
  )

  if (isLoading) return (
    <div className="text-center py-10">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Loading competition history...
      </h2>
    </div>
  )

  const handleDeleteCompetition = async (id: string) => {
    try {
      const { error } = await supabase
        .from("competitions")
        .delete()
        .eq("id", id)
        .eq("created_by", user.id)

      if (error) {
        throw error
      }

      // Refresh the competitions list
      mutate()
    } catch (error) {
      console.error("Error deleting competition:", error)
      alert("Failed to delete competition. Please try again.")
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
          {competitions?.map((competition) => (
            <div
              key={competition.id}
              className={`flex items-center justify-between mb-4 p-2 pr-5 bg-white rounded-lg hover:bg-gray-100 group ${
                competitions.length > 1 && competition !== competitions[competitions.length - 1]
                  ? "border-b pb-4"
                  : ""
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${getRandomColor()}`}
                >
                  <span className="text-white text-sm font-semibold">
                    {competition.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col ml-3">
                  <Link
                    href={`/competitions/${competition.id}`}
                    className="text-black hover:text-snd-bkg font-medium"
                  >
                    {competition.name}
                  </Link>
                  {user.id === competition.created_by && (
                    <span className="text-xs text-logo-green font-medium">
                      Admin
                    </span>
                  )}
                </div>
              </div>
              <span className="text-gray-500 text-sm ml-auto text-right">
                End Date: {dayjs(competition.date_ending).format("MMMM D, YYYY")}
              </span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center ml-4">
                {user.id === competition.created_by && (
                  <DropdownMenuDemo
                    deleteCompetition={() => handleDeleteCompetition(competition.id)}
                  />
                )}
              </div>
            </div>
          ))}

          {competitions?.length === 0 && (
            <div className="text-center py-10">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                No Competition History
              </h2>
              <p className="text-gray-500 text-lg mb-6">
                You haven't completed any competitions yet. Join or create one today to start building your history!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
