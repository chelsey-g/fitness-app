"use client"

import useSWR, { Fetcher } from "swr"
import { useAuth } from "@/contexts/AuthContext"
import dayjs from "dayjs"

import DeleteDialog from "@/components/DeleteDialog"
import { IoIosAdd } from "react-icons/io"
import Link from "next/link"
import { getRandomColor } from "@/app/functions"
import { useRouter } from "next/navigation"
import { competitionService } from "@/app/services/CompetitionService"

interface Competition {
  name: string
  id: string
  date_started: string
  date_ending: string
  created_by: string
}

export default function CompetitionsPage() {
  const router = useRouter()
  const { user } = useAuth()

  const fetcher: Fetcher<Competition[], string> = async (url: string) => {
    if (!user) {
      throw new Error("User not authenticated")
    }

    const today = dayjs().startOf('day')
    const data = await competitionService.getCompetitions()
    return data?.filter((comp: Competition) => dayjs(comp.date_ending).isAfter(today))
  }

  const {
    data: competitions,
    error,
    isLoading,
    mutate
  } = useSWR<Competition[]>(user ? "/competitions" : null, fetcher)

  // if (!user) {
  //   router.push('/login')
  //   return null
  // }

  if (error) return (
    <div className="text-center py-10">
      <h2 className="text-2xl font-semibold text-red-600 mb-4">
        Failed to load competitions
      </h2>
      <p className="text-gray-500 text-lg">
        Please try refreshing the page
      </p>
    </div>
  )

  if (isLoading) return (
    <div className="text-center py-10">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Loading competitions...
      </h2>
    </div>
  )

  const handleCreateCompetition = () => {
    router.push("/competitions/create")
  }

  const handleDeleteCompetition = async (id: string) => {

      await competitionService.deleteCompetition(id, user?.id ?? "")
      mutate()
  }

  const handleShowExpiredCompetitions = () => {
    router.push("/competitions/history")
  }

  return (
    <div className="w-full px-4 sm:px-6">
      <div className="max-w-5xl mx-auto mt-4 sm:mt-6 bg-white rounded-lg dark:text-black">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-4 sm:p-6 pt-6">
          <div className="border-b-2 border-snd-bkg pb-4 flex-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight">
              Active Competitions
            </h1>
            {(competitions?.length ?? 0) > 0 && (
              <p className="text-base sm:text-lg text-gray-700" data-testid="competition-count">
                You currently have{" "}
                <span className="text-snd-bkg font-semibold">
                  {competitions?.length}
                </span>{" "}
                active competition{(competitions?.length ?? 0) > 1 ? "s" : ""}.
              </p>
            )}
          </div>
          <button
            className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-md bg-logo-green dark:bg-snd-bkg text-black dark:text-white font-medium hover:opacity-90 text-sm sm:text-base"
            onClick={handleCreateCompetition}
          >
            <IoIosAdd className="mr-2" />
            Create Competition
          </button>
        </div>

        <div className="p-4 sm:p-6 justify-center">
          {competitions?.map((competition) => (
            <div
              key={competition.id}
              className="flex items-center justify-between mb-4 p-3 sm:p-4 pr-3 sm:pr-5 bg-white rounded-lg hover:bg-gray-100 group"
            >
              <div className="flex items-center justify-between w-full border-b pb-4">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${getRandomColor()}`}
                  >
                    <span className="text-white text-sm sm:text-base font-semibold">
                      {competition.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col ml-3">
                    <Link
                      href={`/competitions/${competition.id}`}
                      className="text-black hover:text-snd-bkg font-medium text-sm sm:text-base"
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
                <span className="text-gray-500 text-xs sm:text-sm ml-auto text-right">
                  End Date: {dayjs(competition.date_ending).format("MMMM D, YYYY")}
                </span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center ml-4">
                {user.id === competition.created_by && (
                  <DeleteDialog
                    title="Delete Competition"
                    message="Are you sure you want to delete this competition?"
                    onDelete={() => handleDeleteCompetition(competition.id)}
                  />
                )}
              </div>
            </div>
          ))}

          {competitions?.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">📋</div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-3">
                No Active Competitions
              </h2>
              <p className="text-base sm:text-lg text-gray-500 mb-6 max-w-md mx-auto">
                Create or join a competition to get started.
              </p>
            </div>
          )}

          <div className="flex justify-center">
            <button
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-md bg-logo-green dark:bg-snd-bkg text-black dark:text-white font-medium hover:opacity-90 text-sm sm:text-base"
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
