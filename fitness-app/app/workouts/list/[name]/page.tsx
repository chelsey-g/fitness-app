import BackButton from "@/components/BackButton"
import { IoIosAdd } from "react-icons/io"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import React from "react"
import WorkoutActions from "@/components/WorkoutActions"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

export default async function ListPage(props: any) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  let { data: listData, error } = await supabase
    .from("workouts_lists")
    .select(`*, workouts ( * )`)
    .eq("list_id", props.params.name)
  if (error) {
    console.error("Error fetching data:", error)
  }

  let { data: listName, error: listError } = await supabase
    .from("lists")
    .select(`*`)
    .eq("id", props.params.name)
  if (listError) {
    console.error("Error fetching data:", listError)
  }

  return (
    <div className="p-6  min-h-screen">
      <Navigation />
      <div className="p-6 mb-6 rounded-lg mt-5 bg-white shadow-lg">
        <div className="bg-white rounded pt-1 pb-4 px-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {listName && listName[0]?.name}
            </h1>
            <BackButton />
          </div>
          {listData && listData.length > 0 ? (
            listData.map((result, index) => (
              <div
                key={index}
                className="bg-gray-50 shadow-md p-6 mb-6 rounded-lg hover:shadow-lg transition duration-300 ease-in-out"
              >
                <div>
                  <h2 className="flex justify-between items-center text-lg font-bold text-gray-800 cursor-pointer hover:text-snd-bkg transition duration-300 ease-in-out">
                    <Link
                      href={`/workouts/exercise/${result.workouts.details.name}`}
                    >
                      {result.workouts.details.name}
                    </Link>
                    <div className="ml-4">
                      <WorkoutActions
                        workoutId={result.workouts.id}
                        listData={listData}
                      />
                    </div>
                  </h2>
                </div>
                <div className="flex mt-4">
                  <div className="flex pr-4">
                    <h3 className="text-gray-600 font-bold mr-2">Type:</h3>
                    <p className="text-gray-600">
                      {result.workouts.details.type}
                    </p>
                  </div>
                  <div className="flex pl-4">
                    <h3 className="text-gray-600 font-bold mr-2">
                      Difficulty:
                    </h3>
                    <p className="text-gray-600">
                      {result.workouts.details.difficulty}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg mt-5 text-center text-gray-600 p-8">
              <h1 className="text-3xl font-bold mb-4">Your list is empty!</h1>
              <p className="text-lg mb-6">Add a workout now to get started.</p>
              <div className="flex justify-center">
                <Link href="/workouts/browse">
                  <button className="bg-snd-bkg hover:opacity-90 text-white font-bold py-2 px-6 rounded flex items-center transition duration-300 ease-in-out">
                    <IoIosAdd className="text-xl mr-2" />
                    Browse Exercises
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
