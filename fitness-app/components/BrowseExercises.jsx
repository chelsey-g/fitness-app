import { useEffect, useState } from "react"

import Link from "next/link"

export default function BrowseExercises() {
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

  const getRandomExercises = (exercises, count) => {
    const shuffled = exercises.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  const [exercises, setExercises] = useState([])

  useEffect(() => {
    const loadExercises = async () => {
      const allExercises = await fetchExercises()
      const randomExercises = getRandomExercises(allExercises, 10)
      setExercises(randomExercises)
    }

    loadExercises()
  }, [])

  const [searchResults, setSearchResults] = useState([])

  const handleSearchResults = (results) => {
    setSearchResults(results)
  }

  return (
    <div className="bg-white rounded pt-1 pb-4 px-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Browse Exercises</h1>
        <p className="text-lg text-gray-600 mt-2">
          Explore the exercises below to get started, or use the search to find
          specific ones!
        </p>
      </div>
      <div className="container mx-auto">
        {exercises.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {exercises.map((exercise, index) => (
              <div
                key={index}
                className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition duration-300 ease-in-out"
              >
                <div>
                  <h2 className="flex justify-between items-center text-lg font-bold text-gray-800 cursor-pointer hover:opacity-80 transition duration-300 ease-in-out">
                    <Link href={`exercise/${exercise.name}`}>
                      {exercise.name}
                    </Link>
                  </h2>
                </div>
                <div className="flex mt-4">
                  <div className="flex pl-4">
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
