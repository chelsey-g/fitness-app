"use client"

import { IoIosAdd } from "react-icons/io"
import Navigation from "@/components/Navigation"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default async function CompetitionsPage() {
  const supabase = createClient()
  const router = useRouter()

  let { data: competitions, error } = await supabase
    .from("competitions")
    .select(`name`)

  const handleCreateCompetition = () => {
    router.push("/competitions/create")
  }

  return (
    <div>
      <Navigation />
      <h1 className="p-4 text-2xl font-semibold text-white">
        Current Competitions
      </h1>
      <div className="p-4">
        <button
          className="bg-snd-bkg hover:opacity-90 text-white font-bold py-2 px-4 mb-10 rounded flex items-center"
          onClick={handleCreateCompetition}
        >
          <IoIosAdd className="mr-2" />
          Create
        </button>
        {competitions?.map((result, index) => (
          <div
            key={index}
            className="p-4 mb-4 mt-4 bg-white shadow-md rounded-lg"
          >
            <h2 className="text-2xl font-bold text-gray-800 cursor-pointer">
              {result.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  )
}
