"use client"

import React, { useState } from "react"

import Navigation from "@/components/Navigation"
import SearchBar from "@/components/Search"
import WorkoutLists from "@/components/WorkoutLists"

export default function WorkoutsPage() {
  const [searchResults, setSearchResults] = useState([])

  const handleSearchResults = (results) => {
    setSearchResults(results)
  }

  return (
    <div className="p-space-x-0.5">
      <Navigation />
      <SearchBar onResultsChange={handleSearchResults} />
      {searchResults.length === 0 && <WorkoutLists />}
    </div>
  )
}
