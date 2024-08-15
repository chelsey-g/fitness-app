"use client"

import useSWR, { Fetcher } from "swr"

import CreateWorkout from "@/components/CreateWorkout"
import DeleteWorkoutAlert from "@/components/DeleteWorkoutAlert"
import Link from "next/link"
import SubmitWorkoutAlert from "@/components/SubmitWorkoutAlert"
import { WorkoutDropdown } from "@/components/WorkoutListActions"
import { createClient } from "@/utils/supabase/client"
import { getRandomColor } from "@/app/functions"
import { useRouter } from "next/navigation"
import { useState } from "react"

// type WorkoutList = {
//   id: string
//   name: string
//   created_at: string
//   workouts_lists: {
//     workouts: {
//       count: number
//     }[]
//   }
// }

export default function WorkoutLists() {
  const [showCreateAlert, setShowCreateAlert] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const fetcher: Fetcher = (url: string) =>
    supabase
      .from("lists")
      .select(`id, name, created_at, workouts_lists(workouts(count))`)
      .order("created_at", { ascending: false })
      .then((res) => res.data)

  const {
    data: listData,
    error,
    isLoading,
  } = useSWR("/workouts", fetcher) as {
    data: any[]
    error: any
    isLoading: boolean
  }

  if (error) return <div>Failed to load</div>

  if (isLoading) return <div>Loading...</div>

  const getTotalExerciseCount = (exercises: any) => {
    return exercises.reduce(
      (total: number, exercise: any) => total + exercise.workouts.count,
      0
    )
  }
  const handleDeleteWorkoutList = async (id: number) => {
    const { error } = await supabase.from("lists").delete().eq("id", id)

    if (error) {
      console.log("Error deleting workout list!", error)
    } else {
      console.log("Workout list deleted!")
      router.refresh()
    }
  }

  const handleCreateAlert = () => {
    setShowCreateAlert(true)
    setTimeout(() => setShowCreateAlert(false), 3000)
    router.refresh()
  }

  const handleDeleteAlert = () => {
    setShowDeleteAlert(true)
    setTimeout(() => setShowDeleteAlert(false), 3000)
  }

  return (
    <div className="space-x-0.5">
      {showCreateAlert && <SubmitWorkoutAlert />}
      {showDeleteAlert && <DeleteWorkoutAlert />}
      <div>
        <h1 className="p-4 text-2xl font-semibold text-white">My Workouts</h1>
        <div className="p-4">
          {listData?.map((list: any, index: number) => (
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
                  className="ml-3 text-black hover:text-prm-bkg font-bold"
                >
                  {list.name}
                </Link>
              </div>
              <div className="flex items-center text-black font-bold pl-4">
                {getTotalExerciseCount(list.workouts_lists)} exercises
                <div className="pl-4">
                  <WorkoutDropdown
                    deleteWorkout={() => handleDeleteWorkoutList(list.id)}
                    showAlert={handleDeleteAlert}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-center">
            <CreateWorkout showAlert={handleCreateAlert} />
          </div>
        </div>
      </div>
    </div>
  )
}
