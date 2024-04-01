import BackButton from "@/components/BackButton"
import DropdownMenuDemo from "@/components/WorkoutActions"
import { IoIosAdd } from "react-icons/io"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import React from "react"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

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
        <div className="flex justify-start mb-4">
          {" "}
          <BackButton />
        </div>
        {listData && listData.length > 0 ? (
          listData.map((result, index) => (
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
                  <p className="text-gray-600">
                    {result.workouts.details.type}
                  </p>
                </div>
                <div className="w-1/2">
                  <h3 className="text-gray-600 font-bold">Difficulty:</h3>
                  <p className="text-gray-600">
                    {result.workouts.details.difficulty}
                  </p>
                </div>
                <div className="pr-4">
                  <DropdownMenuDemo
                    workoutId={result.workouts.id}
                    listData={listData}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg mt-5 shadow-md text-center text-gray-600 p-8">
            <h1 className="text-3xl font-bold mb-4">Your list is empty!</h1>
            <p className="text-lg mb-6">Add a workout now to get started.</p>
            <div className="flex justify-center">
              <Link href="/workouts">
                <button className="bg-snd-bkg hover:bg-opacity-90 text-white font-bold py-2 px-6 rounded flex items-center transition duration-300 ease-in-out">
                  <IoIosAdd className="text-xl mr-2" />
                  Browse Exercises
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
