import { FaDumbbell, FaWeightHanging } from "react-icons/fa"
import { useEffect, useState } from "react"

import Link from "next/link"

export default function BrowseExercises() {
  type exercise = {
    name: string
    difficulty: string
  }

  const fetchExercises = async () => {
    const url = "https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises"
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "89714174d5mshc26bac9205ea4bfp12ab1ejsnf3c87cc1e15a",
        "X-RapidAPI-Host": "exercises-by-api-ninjas.p.rapidapi.com",
      },
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error:", error)
      return []
    }
  }

  const getRandomExercises = (exercises: any, count: any) => {
    const shuffled = exercises.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  const [exercises, setExercises] = useState<exercise[]>([])

  useEffect(() => {
    const loadExercises = async () => {
      const allExercises = await fetchExercises()
      const randomExercises = getRandomExercises(allExercises, 10)
      setExercises(randomExercises)
    }

    loadExercises()
  }, [])

  const [searchResults, setSearchResults] = useState([])

  const handleSearchResults = (results: any) => {
    setSearchResults(results)
  }

  return (
    <div className="bg-white rounded pt-1 pb-4 px-4">
      <div className="container mx-auto">
        {exercises.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {exercises.map((exercise, index) => (
              <div
                key={index}
                role="article"
                className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition duration-300 ease-in-out"
              >
                <div className="flex items-center">
                  <FaDumbbell className="text-nav-bkg mr-2" />
                  <h2 className="text-lg font-bold text-gray-800 cursor-pointer hover:opacity-80 transition duration-300 ease-in-out">
                    <Link href={`exercise/${exercise.name}`}>
                      {exercise.name}
                    </Link>
                  </h2>
                </div>
                <div className="flex mt-4 items-center">
                  <FaWeightHanging className="text-logo-green mr-2" />
                  <div className="flex">
                    <h3 className="text-gray-600 font-bold mr-2">
                      Difficulty:
                    </h3>
                    <p className="text-gray-600">{exercise.difficulty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-600 mt-2">Loading...</p>
          </div>
        )}
      </div>
    </div>
  )
}
