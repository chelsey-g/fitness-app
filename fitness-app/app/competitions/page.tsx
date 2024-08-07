"use client"

import useSWR, { Fetcher } from "swr"

import DropdownMenuDemo from "@/components/CompetitionsActions"
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

  const handleExpiredCompeition = (endDate: string) => {
    const endDateTime = new Date(endDate).getTime()
    return endDateTime < new Date().getTime()
  }

  const handleShowExpiredCompetitions = () => {
    router.push("/competitions/history")
  }

  return (
    <div>
      <Navigation />
      <h1 className="p-4 text-2xl font-semibold text-white">
        Active Competitions ({competitions?.length})
      </h1>
      <div className="flex justify-center">
        <button
          className="bg-snd-bkg hover:opacity-90 text-white font-bold py-2 px-4 mt-5 rounded flex items-center"
          onClick={handleCreateCompetition}
        >
          <IoIosAdd className="mr-2" />
          Create Competition
        </button>
      </div>
      <div className="p-4">
        {competitions?.map((result, index) => (
          <div
            key={index}
            className="flex items-center justify-between mb-4 p-2 pr-5 bg-white shadow-md rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${getRandomColor()} }`}
              >
                <span className="text-white text-sm font-semibold">
                  {result.name.charAt(0).toUpperCase()}
                </span>
              </div>

              <Link
                href={`/competitions/${result.id}`}
                className={`ml-3 text-black hover:text-snd-bkg font-medium ${
                  handleExpiredCompeition(result.date_ending)
                    ? "text-red-500"
                    : ""
                }`}
              >
                {result.name}
                {handleExpiredCompeition(result.date_ending) && (
                  <span className="text-xs ml-2">
                    (This competition has ended)
                  </span>
                )}
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
            onClick={handleShowExpiredCompetitions}
          >
            View Competition History
          </button>
        </div>
      </div>
    </div>
  )
}
