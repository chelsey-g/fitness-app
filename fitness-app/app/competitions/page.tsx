"use client"

import useSWR, { Fetcher } from "swr"

import DeleteCompetition from "@/components/CompetitionsActions"
import { IoIosAdd } from "react-icons/io"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import { createClient } from "@/utils/supabase/client"
import { getRandomColor } from "@/app/functions"
import { useRouter } from "next/navigation"

export default function CompetitionsPage() {
  const supabase = createClient()
  const router = useRouter()

  interface Competition {
    name: string
    id: string
    date_started: string
    date_ending: string
  }

  const fetcher: Fetcher<Competition[], string> = async (url: string) => {
    const today = new Date()
    const { data, error } = await supabase
      .from("competitions")
      .select(`name, id, date_started, date_ending`)
      .order("date_ending", { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return data.filter((comp) => new Date(comp.date_ending) > today)
  }

  const {
    data: competitions,
    error,
    isLoading,
  } = useSWR<Competition[]>("/competitions", fetcher)

  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>

  const handleCreateCompetition = () => {
    router.push("/competitions/create")
  }

  const handleDeleteCompetition = async (id: string) => {
    let { error } = await supabase.from("competitions").delete().eq("id", id)
    if (error) {
      console.log("error", error)
    }
  }

  const handleExpiredCompetition = (endDate: string) => {
    const endDateTime = new Date(endDate).getTime()
    return endDateTime < new Date().getTime()
  }

  const handleShowExpiredCompetitions = () => {
    router.push("/competitions/history")
  }
  return (
    <div className="w-full">
      <Navigation />

      <div className="max-w-5xl mx-auto mt-6 bg-white rounded-lg">
        {competitions?.length > 0 && (
          <div className="border-b-2 border-snd-bkg pb-4 m-6 pt-6">
            <h1 className="text-4xl font-extrabold text-nav-bkg mb-2 tracking-tight">
              Active Competitions
            </h1>
            <p className="text-lg text-gray-700">
              You currently have{" "}
              <span className="text-snd-bkg font-semibold">
                {competitions?.length || 0}
              </span>{" "}
              active competitions.
            </p>
          </div>
        )}
        <div className="flex justify-end p-5">
          <button
            className="bg-button-bkg text-nav-bkg font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center"
            onClick={handleCreateCompetition}
          >
            <IoIosAdd className="mr-2 text-lg" />
            Create
          </button>
        </div>

        <div className="p-4">
          {competitions?.map((result, index) => (
            <div
              key={index}
              className="flex items-center justify-between mb-4 p-2 pr-5 bg-white rounded-lg hover:bg-gray-100 group"
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
                  className={`ml-3 text-black hover:text-snd-bkg font-medium ${
                    handleExpiredCompetition(result.date_ending)
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  {result.name}
                  {handleExpiredCompetition(result.date_ending) && (
                    <span className="text-xs ml-2">
                      (This competition has ended)
                    </span>
                  )}
                </Link>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <DeleteCompetition
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

          <div className="flex justify-center border-t border-gray-100">
            <button
              className="mt-5 relative bg-button-bkg text-nav-bkg font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              onClick={handleShowExpiredCompetitions}
            >
              Competition History
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
