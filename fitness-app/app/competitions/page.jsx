"use client"

import DropdownMenuDemo from "@/components/CompetitionsActions"
import { IoIosAdd } from "react-icons/io"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import useSWR from "swr"

export default function CompetitionsPage() {
  const supabase = createClient()
  const router = useRouter()

  const {
    data: competitions,
    error,
    isLoading,
  } = useSWR("/competitions", () =>
    supabase
      .from("competitions")
      .select(`name, id`)
      .then((res) => res.data)
  )

  if (error) return <div>Failed to load</div>

  if (isLoading) return <div>Loading...</div>

  const handleCreateCompetition = () => {
    router.push("/competitions/create")
  }

  const handleDeleteCompetition = async (id) => {
    let { error } = await supabase.from("competitions").delete().eq("id", id)
    if (error) {
      console.log("error", error)
    }
  }

  function getRandomColor() {
    const colors = ["bg-snd-bkg", "bg-trd-bkg", "bg-nav-bkg"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return (
    <div>
      <Navigation />
      <h1 className="p-4 text-2xl font-semibold text-white">
        Current Competitions
      </h1>
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
                href={`/competitions/${result.name}`}
                className="ml-3 text-black hover:text-blue-800 font-medium"
              >
                {result.name}
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
            onClick={handleCreateCompetition}
          >
            <IoIosAdd className="mr-2" />
            Create Competition
          </button>
        </div>
      </div>
    </div>
  )
}
