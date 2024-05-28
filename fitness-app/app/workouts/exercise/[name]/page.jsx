"use client"

import React, { useEffect, useState } from "react"

import BackButton from "@/components/BackButton"
import Navigation from "@/components/Navigation"
import WorkOutModal from "@/components/WorkOutModal"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function ExercisePage(props) {
  const supabase = createClient()

  const [exerciseData, setExerciseData] = useState([])
  const [workouts, setWorkouts] = useState([])
  const [isWorkOutModalVisible, setIsWorkOutModalVisible] = useState(false)

  const router = useRouter()

  const exercises = (searchValue) => {
    const url = `https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises?name=${searchValue}`
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "89714174d5mshc26bac9205ea4bfp12ab1ejsnf3c87cc1e15a",
        "X-RapidAPI-Host": "exercises-by-api-ninjas.p.rapidapi.com",
      },
    }

    let res = fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        setExerciseData(data || [])
        console.log(data, "hi")
      })
      .catch((error) => {
        console.error("Error:", error)
        setExerciseData([])
      })
  }

  useEffect(() => {
    exercises(props.params.name)
  }, [props.params.name])

  const handleAddWorkout = async (event) => {
    event.preventDefault()
    const { data, error } = await supabase
      .from("workouts")
      .insert([{ name: exerciseData[0]?.name }])
    router.push("/workouts")

    if (error) {
      console.error("Error adding workout!", error)
    } else {
      setWorkouts(exerciseData.name)
    }
  }

  const handleOkButton = () => {
    setIsWorkOutModalVisible(false)
  }

  return (
    <>
      <Navigation />
      <div className="w-1/2 p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <h1 className="text-sm font-semibold text-gray-800 mb-2">
              {exerciseData[0]?.name} ({exerciseData[0]?.difficulty})
            </h1>
            <div className="mb-4">
              <h2 className="text-xs font-medium text-gray-700">
                Equipment required:{" "}
                <span className="text-gray-600">
                  {exerciseData[0]?.equipment}
                </span>
              </h2>
            </div>
            <div className="mb-4">
              <h2 className="text-xs font-medium text-gray-700">
                Primary Muscle Groups:{" "}
                <span className="text-gray-600">{exerciseData[0]?.muscle}</span>
              </h2>
            </div>
          </div>
          <div className="md:w-1/2 text-center">
            <p className="text-gray-600">{exerciseData[0]?.instructions}</p>
          </div>
        </div>
        <WorkOutModal
          className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:outline-none mt-5 text-center"
          isWorkOutModalVisible={isWorkOutModalVisible}
          handleOkButton={handleOkButton}
          handleAddWorkout={handleAddWorkout}
          exerciseData={exerciseData}
        />
        <BackButton />
      </div>
    </>
  )
}
