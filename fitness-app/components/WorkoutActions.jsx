"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { FaEllipsisH } from "react-icons/fa"
import { createClient } from "@/utils/supabase/client"

export function DropdownMenuDemo({ workoutId, listData }) {
  const supabase = createClient()
  async function handleDeleteWorkout(id) {
    const { data, error } = await supabase
      .from("workouts_lists")
      .delete()
      .eq("workout_id", workoutId)

    if (error) {
      console.log("Error deleting workout!", error)
    } else {
      console.log("Workout deleted!")
    }
  }
  console.log("workoutId", workoutId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-snd-bkg hover:text-red-900 rounded-full p-2 bg-gray-200 hover:bg-gray-300 transition-colors duration-150 ease-in-out">
          <FaEllipsisH />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto min-w-full bg-white shadow-lg rounded-md overflow-hidden border border-gray-200">
        <DropdownMenuGroup className="py-1">
          <DropdownMenuItem
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 ease-in-out"
            onClick={() => handleDeleteWorkout(workoutId)}
          >
            Delete Workout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownMenuDemo
