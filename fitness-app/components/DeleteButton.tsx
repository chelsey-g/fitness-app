"use client"

import { IoMdTrash } from "react-icons/io"
import { createClient } from "@/utils/supabase/client"

export default function DeleteButton({ listData }) {
  const supabase = createClient()

  console.log("listData", listData)

  const handleDelete = async () => {
    const { error } = await supabase
      .from("workouts_lists")
      .delete()
      .eq("workout_id", listData[0].id)

    if (error) {
      console.log("Error deleting workout!", error)
    } else {
      console.log("Workout deleted!")
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
    >
      <IoMdTrash className="mr-2" />
      Delete
    </button>
  )
}
