"use client"
import SearchComponent from "@/components/Search"
import Navigation from "@/components/Navigation"
import WorkoutLists from "@/components/WorkoutLists"
import { useState, useEffect } from "react"

export default function WorkoutsPage() {
  const [searchResults, setSearchResults] = useState([])
  const [showWorkouts, setShowWorkouts] = useState(true)

  useEffect(() => {
    setShowWorkouts(searchResults.length === 0)
  }, [searchResults])

  const handleSearchResults = (results) => {
    setSearchResults(results)
  }

  return (
    <div className="p-space-x-0.5">
      <Navigation />
      <SearchComponent handleSearchResults={handleSearchResults} />
      <div>{showWorkouts && <WorkoutLists />}</div>
    </div>
  )
}
