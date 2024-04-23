"use client"

import { useEffect, useState } from "react"

import Link from "next/link"
import Navigation from "@/components/Navigation"
import ProgressCircle from "@/components/ProgressCircle"
import ProgressTracker from "@/components/ProgressTracker"
import { createClient } from "@/utils/supabase/client"
import useSWR from "swr"

export default function HomePage() {
  const supabase = createClient()
  const [user, setUser] = useState(null)
  const [competitionData, setCompetitionData] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    const fetchCompetitionData = async () => {
      const { data: competitionData, error } = await supabase
        .from("competitions_players")
        .select("*")
        .eq("player_id", user.identities[0].id)

      if (error) {
        console.error("Error fetching competition data", error)
      }

      setCompetitionData(competitionData)
    }

    if (user) {
      fetchCompetitionData()
    }
  }, [user])

  console.log(competitionData)

  const {
    data: profiles,
    error,
    isLoading,
  } = useSWR("/profiles", () =>
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.identities[0].id)
      .then((res) => res.data)
  )
  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <Navigation />

      <div className="bg-white rounded-lg container mx-auto my-8 p-4 max-w-xl shadow-md">
        <h1 className="text-4xl font-semibold text-gray-800 mb-4 text-center">
          Welcome back, {profiles[0]?.first_name}!
        </h1>
        <div className="text-gray-700 text-sm text-center">
          <ProgressTracker />
          Check your progress{" "}
          <Link
            href="/tracker/chart"
            className="inline-block font-bold rounded mt-5"
          >
            here
          </Link>
        </div>
        {competitionData && (
          <div className="text-gray-700 text-lg mt-5 text-center text-sm">
            <span>
              You are currently involved in {competitionData.length} active
              competitions:
            </span>
            <div className="mt-5 mx-auto" style={{ maxWidth: "fit-content" }}>
              <Link
                href="/competitions"
                className="inline-block bg-snd-bkg text-white font-bold py-2 px-4 rounded"
              >
                View Active Competitions
              </Link>
            </div>
            <div className="mt-5 text-sm">
              Personal Loss Goal Progress:
              <ProgressCircle profileInfo={user} />
            </div>
          </div>
        )}
      </div>

      <footer className="py-4">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} HabitKick. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
