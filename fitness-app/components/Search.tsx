import React, { useEffect, useState } from "react"

import DifficultyFilter from "@/components/DifficultyFilter"
import { IoIosClose } from "react-icons/io"
import { useRouter } from "next/navigation"

export default function SearchBar({
  onResultsChange,
}: {
  onResultsChange: any
}) {
  const [searchValue, setSearchValue] = useState("")
  const [results, setResults] = useState<result[]>([])
  const [difficulty, setDifficulty] = useState("")
  const [type, setType] = useState("")
  const router = useRouter()

  type result = {
    name: string
    type: string
    difficulty: string
  }

  const handleSearch = () => {
    if (searchValue) {
      searchExercise(searchValue)
    }
  }

  const searchExercise = (searchValue: string) => {
    let url = `https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises?name=${searchValue}`
    if (difficulty) {
      url += `&difficulty=${difficulty}`
    }
    if (type) {
      url += `&type=${type}`
    }
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "89714174d5mshc26bac9205ea4bfp12ab1ejsnf3c87cc1e15a",
        "X-RapidAPI-Host": "exercises-by-api-ninjas.p.rapidapi.com",
      },
    }

    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        setResults(data || [])
        console.log(data, "hi")
      })
      .catch((error) => {
        console.error("Error:", error)
        setResults([])
      })
  }

  useEffect(() => {
    if (searchValue) {
      searchExercise(searchValue)
    }
  }, [difficulty, type])

  useEffect(() => {
    onResultsChange(results)
  }, [results, onResultsChange])

  const handleSearchClick = (result: any) => {
    router.push(`/workouts/exercise/${result}`)
  }

  const handleDifficultyChange = (difficulty: any) => {
    setDifficulty(difficulty)
  }

  const handleTypeChange = (type: any) => {
    setType(type)
  }

  const handleClearSearch = () => {
    setSearchValue("")
    setResults([])
  }

  return (
    <div className="p-4 rounded-lg">
      <div className="mb-4 text-center relative">
        <div className="flex justify-center items-center relative w-full sm:w-3/4 mx-auto">
          <input
            className="w-full p-2 border border-gray-300 rounded-md text-center text-black hover:border-gray-500 focus:outline-none focus:border-snd-bkg focus:ring-white"
            type="text"
            placeholder="Search Exercise"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {results.length > 0 && (
            <button
              aria-label="Close"
              className="absolute inset-y-0 right-20 flex items-center pr-3 text-gray-500"
              onClick={handleClearSearch}
            >
              <IoIosClose size={24} />
            </button>
          )}
          <button
            className="ml-2 py-2 px-4 bg-snd-bkg text-white rounded-md focus:outline-none"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        {results.length > 0 && (
          <DifficultyFilter
            difficulty={difficulty}
            onChange={handleDifficultyChange}
          />
        )}
        <div className="container mx-auto">
          {results.map((result: result, index) => (
            <div
              key={index}
              className="bg-white shadow-md p-4 mb-4 rounded-lg mt-5 cursor-pointer"
              onClick={() => handleSearchClick(result)}
            >
              <h2 className="text-2xl font-bold text-gray-800">
                {result.name}
              </h2>
              <div className="flex">
                <div className="w-1/2">
                  <h3 className="text-gray-600 font-bold">Type:</h3>
                </div>
                <div className="w-1/2">
                  <h3 className="text-gray-600 font-bold">Difficulty:</h3>
                </div>
              </div>
              <div className="flex">
                <div className="w-1/2">
                  <p className="text-gray-600">{result.type}</p>
                </div>
                <div className="w-1/2">
                  <p className="text-gray-600">{result.difficulty}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
