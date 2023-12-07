"use client"

import { useEffect, useState } from "react"

import Link from "next/link"
import { createClient } from "@/utils/supabase/client"

export default function WorkoutLists() {
  const [lists, setLists] = useState([])
  const [workouts, setWorkouts] = useState([])

  const supabase = createClient()

  const fetchLists = async () => {
    const { data, error } = await supabase.from("lists").select("id, name")

    if (error) {
      console.log("Error fetching lists!", error)
      return
    }

    setLists(data)
  }

  useEffect(() => {
    fetchLists()
  }, [])

  const fetchWorkouts = async () => {
    const { data: workoutData, error } = await supabase
      .from("workouts_lists")
      .select(`*, workouts ( * )`)
      .eq("list_id", "workout_id")

    if (error) {
      console.log("Error fetching workouts!", error)
      return
    }

    setWorkouts(workoutData)
  }

  useEffect(() => {
    fetchWorkouts()
  }, [])

  console.log(lists, "lists")
  console.log(workouts, "workouts")

  function getRandomColor() {
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // const handleDeleteWorkout = async (id) => {
  //   const { error } = await supabase.from("lists").delete().eq("id", id)

  //   if (error) {
  //     console.log("Error deleting workout!", error)
  //   } else {
  //     fetchLists()
  //     console.log("Workout deleted!")
  //   }
  // }

  return (
    <div className="space-x-0.5">
      <div>
        <h1 className="p-4 text-2xl font-semibold text-white">My Workouts</h1>
        <div className="p-4">
          {lists.map((list, index) => (
            <div
              key={index}
              className="flex items-center justify-between mb-4 p-2 pr-5 bg-white shadow-md rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${getRandomColor()}`}
                >
                  <span className="text-white text-sm font-semibold">
                    {list.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <Link
                  href={`/workouts/list/${list.id}`}
                  className="ml-3 text-black hover:text-blue-800 font-medium"
                >
                  {list.name}
                </Link>
              </div>
              <div className="text-black font-bold">6 exercises</div>
              {/* <button
      onClick={() => handleDeleteWorkout(list.id)}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
    >
      Delete
    </button>  */}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
