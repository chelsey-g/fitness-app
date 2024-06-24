"use client"

import CreateWorkout from "@/components/CreateWorkout"
import { DropdownMenuDemo } from "@/components/WorkoutListActions"
import Link from "next/link"
import SubmitWorkoutAlert from "@/components/SubmitWorkoutAlert"
import { createClient } from "@/utils/supabase/client"
import { getRandomColor } from "@/app/functions"
import useSWR from "swr"
import { useState } from "react"

export default function WorkoutLists() {
  const [showAlert, setShowAlert] = useState(false)
  const supabase = createClient()

  const {
    data: listData,
    error,
    isLoading,
  } = useSWR("/workouts", () =>
    supabase
      .from("lists")
      .select(`id, name, created_at, workouts_lists(workouts(count))`)
      .order("created_at", { ascending: false })
      .then((res) => res.data)
  )

  if (error) return <div>Failed to load</div>

  if (isLoading) return <div>Loading...</div>

  const getTotalExerciseCount = (exercises) => {
    return exercises.reduce(
      (total, exercise) => total + exercise.workouts.count,
      0
    )
  }
  const handleDeleteWorkoutList = async (id) => {
    const { error } = await supabase.from("lists").delete().eq("id", id)

    if (error) {
      console.log("Error deleting workout list!", error)
    } else {
      console.log("Workout list deleted!")
    }
  }

  const handleShowAlert = () => {
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 2000)
  }

  return (
    <div className="space-x-0.5">
      {showAlert && <SubmitWorkoutAlert />}
      <div>
        <h1 className="p-4 text-2xl font-semibold text-white">My Workouts</h1>
        <div className="p-4">
          {listData?.map((list, index) => (
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
              <div className="flex items-center text-black font-bold pl-4">
                {getTotalExerciseCount(list.workouts_lists)} exercises
                <div className="pl-4">
                  <DropdownMenuDemo
                    deleteWorkoutList={() => handleDeleteWorkoutList(list.id)}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-center">
            <CreateWorkout showAlert={handleShowAlert} />
          </div>
        </div>
      </div>
    </div>
  )
}
