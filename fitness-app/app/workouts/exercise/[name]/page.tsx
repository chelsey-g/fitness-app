"use client"

import React, { useEffect, useState } from "react"

import BackButton from "@/components/BackButton"
import Navigation from "@/components/Navigation"
import WorkOutModal from "@/components/WorkOutModal"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function ExercisePage(props: any) {
  const supabase = createClient()

  type ExerciseData = {
    exerciseData: {
      name: string

      muscle: string

      difficulty: string

      equipment: string

      instructions: string
    }[]
  }

  const [exerciseData, setExerciseData] = useState<
    {
      name: string
      muscle: string
      difficulty: string
      equipment: string
      instructions: string
    }[]
  >([])
  const [workouts, setWorkouts] = useState<string>("")
  const [isWorkOutModalVisible, setIsWorkOutModalVisible] = useState(false)

  const router = useRouter()

  const exercises = (searchValue: any) => {
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

  const handleAddWorkout = async (event: any) => {
    event.preventDefault()
    const { data, error } = await supabase
      .from("workouts")
      .insert([{ name: exerciseData[0]?.name }])
    router.push("/workouts")

    if (error) {
      console.error("Error adding workout!", error)
    } else {
      setWorkouts(exerciseData[0]?.name)
    }
  }

  const handleOkButton = () => {
    setIsWorkOutModalVisible(false)
  }

  return (
    <div>
      <Navigation />
      <div className="p-6 rounded-lg container mx-auto m-4 p-4 max-w-xl">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
          <BackButton />
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
                  <span className="text-gray-600">
                    {exerciseData[0]?.muscle}
                  </span>
                </h2>
              </div>
            </div>
            <div className="md:w-1/2 text-center">
              <p className="text-gray-600">{exerciseData[0]?.instructions}</p>
            </div>
          </div>
          <div className="flex justify-center mt-5">
            <WorkOutModal
              className="py-2 px-4 bg-snd-bkg hover:bg-snd-bkg-hover text-white rounded-md focus:outline-none text-center"
              isWorkOutModalVisible={isWorkOutModalVisible}
              handleOkButton={handleOkButton}
              handleAddWorkout={handleAddWorkout}
              exerciseData={exerciseData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
