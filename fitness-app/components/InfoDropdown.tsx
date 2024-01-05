import { IoIosInformationCircleOutline, IoMdTrash } from "react-icons/io"

import { GrFormEdit } from "react-icons/gr"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function InfoDropdown({ listData }) {
  const supabase = createClient()
  const router = useRouter()
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [selectedList, setSelectedList] = useState(null)

  const handleInfoDropdown = (listId) => {
    setIsInfoOpen(!isInfoOpen)
    setSelectedList(listId)
  }

  const handleDeleteWorkout = async (id) => {
    const { error } = await supabase
      .from("workouts_lists")
      .delete()
      .eq("list_id", selectedList)

    if (error) {
      console.log("Error deleting workout!", error)
    } else {
      console.log("Workout deleted!")
      setIsInfoOpen(false)
      router.refresh
    }
  }

  console.log(listData[0].id, "hello")

  return (
    <div className="relative inline-block text-left">
      <div>
        <button onClick={handleInfoDropdown} className="focus:outline-none">
          <IoIosInformationCircleOutline className="ml-4" />
        </button>
      </div>
      {isInfoOpen && (
        <div className="absolute left-2 z-20 w-64 mt-2 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 transition duration-300 ease-in-out">
          <div className="px-4 py-2">
            <div className="flex space-x-2 justify-center">
              <button
                onClick={handleDeleteWorkout}
                className="flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              >
                <IoMdTrash className="mr-2" />
                Delete
              </button>
              <button className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                <GrFormEdit className="mr-2" />
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
