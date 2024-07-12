"use client"

import Navigation from "../../../components/Navigation"
import RecipeSearch from "@/components/RecipeSearch"

export default function RecipeSearchPage() {
  return (
    <div>
      <Navigation />
      <div className="w-full flex justify-center">
        <RecipeSearch />
      </div>
    </div>
  )
}
