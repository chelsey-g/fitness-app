"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"

export default function WorkoutLists() {
  const [lists, setLists] = useState([])

  const supabase = createClient()

  useEffect(() => {
    fetchLists()
  }, [])

  const fetchLists = async () => {
    const { data, error } = await supabase.from("lists").select("id, name")

    if (error) {
      console.log("Error fetching lists!", error)
      return
    }

    setLists(data)
  }

  const handleDeleteWorkout = async (id) => {
    const { error } = await supabase.from("lists").delete().eq("id", id)

    if (error) {
      console.log("Error deleting workout!", error)
    } else {
      fetchLists()
      console.log("Workout deleted!")
    }
  }

  return (
    <div className="p-space-x-0.5">
      <div>
        <h1 className="p-4 text-2xl">Workouts</h1>
        <div className="p-4">
          {lists.map((list, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <Link href={`/workouts/list/${list.name}`}>
                <p className="text-blue-600 hover:text-blue-800 visited:text-purple-600">
                  {list.name}
                </p>
              </Link>
              <button
                onClick={() => handleDeleteWorkout(list.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
