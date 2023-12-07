import DeleteButton from "@/components/DeleteButton"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import React from "react"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
// import BackButton from "@/components/BackButton"

export default async function ListPage(props) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  let { data: listData, error } = await supabase
    .from("workouts_lists")
    .select(`*, workouts ( * )`)
    .eq("list_id", props.params.name)
  if (error) {
    console.error("Error fetching data:", error)
  } else {
    console.log("hello", listData)
  }

  return (
    <div className="p-4">
      <Navigation />
      <div className="p-4 mb-4 rounded-lg mt-5">
        {listData?.map((result, index) => (
          <div
            key={index}
            className="bg-white shadow-md p-4 mb-4 rounded-lg mt-5"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-800 cursor-pointer">
                <Link
                  href={`/workouts/exercise/${result.workouts.details.name}`}
                >
                  {result.workouts.details.name}
                </Link>
              </h2>
            </div>
            <div className="flex">
              <div className="w-1/2">
                <h3 className="text-gray-600 font-bold">Type:</h3>
                <p className="text-gray-600">{result.workouts.details.type}</p>
              </div>
              <div className="w-1/2">
                <h3 className="text-gray-600 font-bold">Difficulty:</h3>
                <p className="text-gray-600">
                  {result.workouts.details.difficulty}
                </p>
              </div>
            </div>
            <DeleteButton listData={listData} />
            {/* <BackButton /> */}
          </div>
        ))}
      </div>
    </div>
  )
}
