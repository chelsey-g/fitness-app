"use client"

import useSWR, { Fetcher } from "swr"

import Link from "next/link"
import { MdDeleteForever } from "react-icons/md"
import Navigation from "@/components/Navigation"
import { createClient } from "@/utils/supabase/client"

export default function SavedRecipes() {
  const supabase = createClient()

  type recipe = {
    id: number
    title: string
    image: string
    url: string
  }

  const { data: user } = useSWR("/user", () =>
    supabase.auth.getUser().then((res) => res.data.user)
  )
  let identityId = user?.identities?.[0]?.id || null

  const recipeFetcher: Fetcher<recipe[]> = async () => {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("created_by", identityId)

    if (error) {
      throw new Error(error.message)
    }

    return data || []
  }

  const { data: recipeList = [] } = useSWR<recipe[]>(
    identityId ? `/recipes/${identityId}` : null,
    recipeFetcher,
    { revalidateOnFocus: false }
  )

  const handleDeleteRecipe = async (recipeId: number) => {
    await supabase.from("recipes").delete().eq("id", recipeId)
  }

  function capitalizeTitle(title: string) {
    return title
      .split(" ")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1)
      })
      .join(" ")
  }

  const handleSavedClick = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <div>
      <Navigation />
      <div className="p-4 bg-white rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Saved Recipes
        </h1>
        {recipeList && recipeList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recipeList.map((recipe, index) => (
              // <button onClick={handleSavedClick(recipe.url)}>
              <div
                key={index}
                className="bg-white shadow-md p-4 rounded-lg cursor-pointer relative flex justify-between "
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="h-24 w-24 object-cover rounded mb-2"
                />
                <h2 className="text-md font-bold text-gray-800 mb-2">
                  {capitalizeTitle(recipe.title)}
                </h2>
                <button onClick={() => handleDeleteRecipe(recipe.id)}>
                  <MdDeleteForever className="text-red-600" />
                </button>
              </div>
              // </button>
            ))}
          </div>
        ) : (
          <p>No saved recipes found.</p>
        )}
      </div>
    </div>
  )
}
