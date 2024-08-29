"use client"

import Link from "next/link"
import Navigation from "@/components/Navigation"
import RecipeSearch from "@/components/RecipeSearch"
export default function RecipeSearchPage() {
  return (
    <div>
      <Navigation />
      <div className="w-full flex flex-col items-center mt-8">
        <Link
          href="/recipes/saved"
          className="inline-block font-bold rounded bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition duration-300 ease-in-out mb-5"
        >
          View Saved Recipes
        </Link>
        <RecipeSearch />
      </div>
    </div>
  )
}
