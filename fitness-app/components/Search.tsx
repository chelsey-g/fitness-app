import React, { useEffect, useState } from "react"

import DifficultyFilter from "@/components/DifficultyFilter"
import { useRouter } from "next/navigation"

export default function SearchBar({ onResultsChange }) {
  const [searchValue, setSearchValue] = useState("")
  const [results, setResults] = useState([])
  const [difficulty, setDifficulty] = useState("")
  const [type, setType] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if (searchValue) {
      searchExercise(searchValue)
    }
  }

  const searchExercise = (searchValue) => {
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

  const handleSearchClick = (result) => {
    debugger
    router.push(`/workouts/exercise/${result.name}`)
  }

  const handleDifficultyChange = (difficulty) => {
    setDifficulty(difficulty)
  }

  const handleTypeChange = (type) => {
    setType(type)
  }

  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-md ">
      <div className="mb-4 text-center">
        <input
          className="w-5/6
         p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-center text-black"
          type="text"
          placeholder="Search Exercise"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button
          className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:outline-none ml-2 "
          onClick={() => {
            handleSearch()
          }}
        >
          Search
        </button>
        {results.length > 0 && (
          <DifficultyFilter
            difficulty={difficulty}
            onChange={handleDifficultyChange}
          />
        )}
        <div className="container mx-auto">
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-white shadow-md p-4 mb-4 rounded-lg mt-5"
              onClick={() => {
                handleSearchClick(result)
              }}
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
