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
    <div className="p-6 min-h-screen">
      <Navigation />
      <div className="p-6 mb-6 rounded-lg mt-5 bg-white shadow-lg">
        <SearchBar onResultsChange={handleSearchResults} />
        {searchResults.length === 0 && <BrowseExercises />}
      </div>
    </div>
  )
}
