"use client"

import { SetStateAction, useState } from "react"

import BrowseExercises from "@/components/BrowseExercises"
import Navigation from "../../../components/Navigation"
import SearchBar from "@/components/Search"

export default function BrowseExercisePage() {
  const [searchResults, setSearchResults] = useState<string>("")

  const handleSearchResults = (results: SetStateAction<string>) => {
    setSearchResults(results)
  }
  return (
    <div className="w-full">
      <Navigation />
      <div className="max-w-5xl mx-auto mt-6 bg-white rounded-lg shadow-md">
        <div className="relative">
          <div className="border-b-2 border-snd-bkg pb-4 m-6 pt-6">
            <h1 className="text-4xl font-extrabold text-nav-bkg mb-2 tracking-tight">
              Browse Exercises
            </h1>
            <p className="text-lg text-gray-700">
              Search for exercises or browse our collection to find the perfect
              one for your workout.
            </p>
          </div>
          <div className="p-3">
            <SearchBar onResultsChange={handleSearchResults} />
            {searchResults.length === 0 && (
              <div className="mt-3">
                <BrowseExercises />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
