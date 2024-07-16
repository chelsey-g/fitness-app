"use client"

import {
  AiFillHeart,
  AiOutlineClockCircle,
  AiOutlineHeart,
} from "react-icons/ai"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import React, { useEffect, useState } from "react"

import { AiOutlineEye } from "react-icons/ai"
import { GiForkKnifeSpoon } from "react-icons/gi"
import { HiOutlineSave } from "react-icons/hi"
import { IoIosClose } from "react-icons/io"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import useSWR from "swr"

export default function RecipeSearch() {
  const [recipes, setRecipes] = useState([])
  const [query, setQuery] = useState("chicken")
  const [searchValue, setSearchValue] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const { data: user } = useSWR("/user", () =>
    supabase.auth.getUser().then((res) => res.data.user)
  )

  let identityId = user?.identities?.[0]?.id || null

  console.log(user, "hi")

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
    window.open(recipe.recipe.url, "_blank")
  }

  console.log(recipes)

  const { data: recipeList } = useSWR(
    identityId ? "/recipes/" + identityId : null,
    () =>
      supabase
        .from("recipes")
        .select("*")
        .eq("created_by", identityId)
        .then((res) => res.data)
  )

  const handleAddRecipe = async (recipe) => {
    const { data, error } = await supabase
      .from("recipes")
      .insert([
        {
          title: recipe.recipe.label,
          url: recipe.recipe.url,
          image: recipe.recipe.image,
        },
      ])
      .select()
    if (error) {
      console.error("Error adding recipe:", error.message)
    } else {
      console.log("Recipe added successfully:", data)
    }
  }

  console.log(recipeList, "recipe list")

  const isRecipeInUserList = (recipe) => {
    return recipeList.some(
      (userRecipe) => userRecipe.title === recipe.recipe.label
    )
  }

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
        <div className="mx-auto mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recipes.map((recipe, index) => (
            <Popover key={index}>
              <PopoverTrigger>
                <div className="bg-white shadow-md p-2 mb-4 rounded-lg cursor-pointer flex items-center max-w-xs">
                  <div className="flex-grow">
                    <h2 className="text-md font-bold text-gray-800">
                      {recipe.recipe.label}
                    </h2>
                    <div className="flex items-center my-1">
                      <GiForkKnifeSpoon className="text-gray-600 mr-2" />
                      <p className="text-gray-600 text-sm">
                        {recipe.recipe.dietLabels.join(", ")}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <AiOutlineClockCircle className="text-gray-600 mr-2" />
                      <div className="text-gray-600 text-sm">
                        {recipe.recipe.totalTime} minutes
                      </div>
                      {isRecipeInUserList(recipe) ? (
                        <AiFillHeart className="text-red-500 ml-5" size={24} />
                      ) : null}
                    </div>
                  </div>
                  <img
                    src={recipe.recipe.image}
                    alt={recipe.recipe.label}
                    className="h-24 w-24 object-cover rounded"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="relative bg-white p-4 rounded-lg shadow-lg max-w-xs -top-4">
                <div className="flex flex-col items-start space-y-4 items-center">
                  <button
                    onClick={() => handleSearchClick(recipe)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    <AiOutlineEye size={20} />
                    <span>View Recipe</span>
                  </button>
                  <button
                    onClick={() => handleAddRecipe(recipe)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    <HiOutlineSave size={20} />
                    <span>Save Recipe</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </div>
    </div>
  )
}
