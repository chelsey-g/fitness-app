import { IoIosInformationCircleOutline, IoMdTrash } from "react-icons/io"

import { GrFormEdit } from "react-icons/gr"
import { createClient } from "@/utils/supabase/client"
import { useState } from "react"

export default function InfoDropdown({ listData }) {
  const supabase = createClient()
  const [isInfoOpen, setIsInfoOpen] = useState(false)

  const handleInfoDropdown = () => {
    setIsInfoOpen(!isInfoOpen)
  }

  console.log(listData, "listDataaaaa")

  const handleDeleteWorkout = async (id) => {
    const { error } = await supabase.from("lists").delete().eq("id", id)

    if (error) {
      console.log("Error deleting workout!", error)
    } else {
      console.log("Workout deleted!")
    }
  }

  const formatDate = (date) => {
    const newDate = new Date(date)
    return newDate.toLocaleDateString()
  }

  return (
    <div className="relative inline-block text-left">
      <button onClick={handleInfoDropdown} className="focus:outline-none">
        <IoIosInformationCircleOutline className="ml-4" />
      </button>
      {isInfoOpen && (
        <div className="absolute left-2 z-20 w-64 mt-2 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 transition duration-300 ease-in-out">
          <div className="px-4 py-2">
            <div className="flex space-x-2 justify-center">
              <button
                onClick={() => handleDeleteWorkout(listData[0].id)}
                className="flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              >
                <IoMdTrash className="mr-2" />
                Delete
              </button>
              <button
                // onClick={() => handleDeleteWorkout(listData.id)}
                className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              >
                <GrFormEdit className="mr-2" />
                Edit
              </button>
            </div>
            {listData && listData.length > 0 && (
              <div className="flex justify-center items-center mt-2">
                <p className="text-sm text-gray-500">
                  Created on: {formatDate(listData[0].created_at)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
