"use client"

import { useEffect, useState } from "react"

import InfoDropdown from "@/components/InfoDropdown"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"

export default function WorkoutLists() {
  const [lists, setLists] = useState([])
  const supabase = createClient()

  const fetchLists = async () => {
    const { data, error } = await supabase
      .from("lists")
      .select(`id, name, created_at, workouts_lists(workouts(count))`)

    if (error) {
      console.log("Error fetching lists!", error)
      return
    }

    setLists(data)
  }

  console.log(lists, "lists")

  useEffect(() => {
    fetchLists()
  }, [])

  const getTotalExerciseCount = (exercises) => {
    return exercises.reduce(
      (total, exercise) => total + exercise.workouts.count,
      0
    )
  }

  function getRandomColor() {
    const colors = ["bg-snd-bkg", "bg-trd-bkg", "bg-nav-bkg"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

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
              <div className="flex items-center text-black font-bold">
                {getTotalExerciseCount(list.workouts_lists)} exercises
                <InfoDropdown listData={lists} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
