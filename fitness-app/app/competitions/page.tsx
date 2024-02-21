"use client"

import { IoIosAdd } from "react-icons/io"
import { IoIosInformationCircleOutline } from "react-icons/io"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default async function CompetitionsPage() {
  const supabase = createClient()
  const router = useRouter()

  let { data: competitions, error } = await supabase
    .from("competitions")
    .select(`name`)

  if (error) {
    console.log("error", error)
  }

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
            <Link
              href={`/competitions/${result.name}`}
              className="ml-3 text-black hover:text-blue-800 font-medium"
            >
              {result.name}
            </Link>
            <button className="float-right">
              <IoIosInformationCircleOutline />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
