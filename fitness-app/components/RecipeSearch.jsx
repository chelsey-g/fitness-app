"use client"

import React, { useEffect, useState } from "react"

import { AiOutlineClockCircle } from "react-icons/ai"
import { GiForkKnifeSpoon } from "react-icons/gi"
import { IoIosClose } from "react-icons/io"
import { useRouter } from "next/navigation"

export default function RecipeSearch() {
  const [recipes, setRecipes] = useState([])
  const [query, setQuery] = useState("chicken")
  const [searchValue, setSearchValue] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchRecipes = async () => {
      const id = "11503409"
      const key = process.env.NEXT_PUBLIC_RECIPE_API_KEY
      if (!key) {
        console.error("API key is not set")
        return
      }
      const response = await fetch(
        `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${id}&app_key=${key}`
      )
      if (!response.ok) {
        console.error("Error fetching data", response.status)
        return
      }
      const data = await response.json()
      setRecipes(data.hits)
    }

    fetchRecipes()
  }, [query])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchValue) {
      setQuery(searchValue)
    }
  }

  const handleClearSearch = () => {
    setSearchValue("")
    setRecipes([])
  }

  const handleSearchClick = (recipe) => {
    router.push(recipe.recipe.url, { shallow: true })
  }

  console.log(recipes)

  return (
    <div className="p-4 rounded-lg">
      <div className="mb-4 text-center relative">
        <div className="flex justify-center items-center relative w-full mx-auto">
          <input
            className="w-full p-2 border border-gray-300 rounded-md text-center text-black hover:border-gray-500 focus:outline-none focus:border-snd-bkg focus:ring-white"
            type="text"
            placeholder="Search for recipes..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {recipes.length > 0 && (
            <button
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
        <div className="mx-auto mt-5 grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-2 gap-4">
          {recipes.map((recipe, index) => (
            <div
              key={index}
              className="bg-white shadow-md p-4 mb-4 rounded-lg cursor-pointer flex justify-between items-center"
              onClick={() => handleSearchClick(recipe)}
            >
              <div className="flex-grow">
                <h2 className="text-lg font-bold text-gray-800">
                  {recipe.recipe.label}
                </h2>
                <div className="flex items-center my-2">
                  <GiForkKnifeSpoon className="text-gray-600 mr-2" />
                  <p className="text-gray-600 text-sm">
                    {recipe.recipe.dietLabels.join(", ")}
                  </p>
                </div>
                <div className="flex items-center">
                  <AiOutlineClockCircle className="text-gray-600 mr-2" />
                  <p className="text-gray-600 text-sm">
                    {recipe.recipe.totalTime} minutes
                  </p>
                </div>
              </div>
              <img
                src={recipe.recipe.image}
                alt={recipe.recipe.label}
                className="h-24 w-24 object-cover rounded ml-4"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
