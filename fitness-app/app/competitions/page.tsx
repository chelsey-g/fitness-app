"use client"

import useSWR, { Fetcher } from "swr"

import DeleteCompetition from "@/components/CompetitionsActions"
import { IoIosAdd } from "react-icons/io"
import Link from "next/link"
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

  const handleShowExpiredCompetitions = () => {
    router.push("/competitions/history")
  }
  return (
    <>
      <div className="relative max-w-5xl mx-auto mt-6 bg-white rounded-lg dark:text-black">
        <button
          className="flex items-center absolute top-6 right-6 px-4 py-2 rounded-md bg-logo-green dark:bg-snd-bkg text-black dark:text-white font-medium hover:opacity-90"
          onClick={handleCreateCompetition}
        >
          <IoIosAdd className="mr-2" />
          Create
        </button>

        {(competitions?.length ?? 0) > 0 && (
          <div className="border-b-2 border-snd-bkg pb-4 m-6 pt-6">
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
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

        <div className="p-4 justify-center">
          {competitions?.map((result, index) => (
            <div
              key={index}
              className="flex items-center justify-between mb-4 p-2 pr-5 bg-white rounded-lg hover:bg-gray-100 group"
            >
              <div className="flex items-center justify-between w-full border-b pb-4">
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
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center ml-4">
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

          <div className="flex justify-center">
            <button
              className="px-4 py-2 rounded-md bg-logo-green dark:bg-snd-bkg text-black dark:text-white font-medium hover:opacity-90"
              onClick={handleShowExpiredCompetitions}
            >
              Competition History
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
