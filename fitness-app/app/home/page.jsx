"use client"

import Link from "next/link"
import Navigation from "@/components/Navigation"
import ProgressCircle from "@/components/ProgressCircle"
import ProgressTracker from "@/components/ProgressTracker"
import { createClient } from "@/utils/supabase/client"
import useSWR from "swr"

export default function HomePage() {
  const supabase = createClient()
  const {
    data: user,
    error,
    isLoading,
  } = useSWR("/user", () =>
    supabase.auth.getUser().then((res) => res.data.user)
  )

  let identityId = user?.identities?.[0]?.id || null

  console.log("user", user)

  const { data: competitions } = useSWR(
    () => (identityId ? "/competitions/" + identityId : null),
    () =>
      supabase
        .from("competitions_players")
        .select("*")
        .eq("player_id", identityId)
        .then((res) => res.data)
  )
  console.log("competitions", competitions)

  const { data: profiles } = useSWR(
    identityId ? "/profiles/" + identityId : null,
    () =>
      supabase
        .from("profiles")
        .select("*")
        .eq("id", identityId)
        .then((res) => res.data)
  )
  console.log("profiles", profiles)

  if (!profiles) return

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
        {competitions && (
          <div className="text-gray-700 text-lg mt-5 text-center text-sm">
            <span>
              You are currently involved in {competitions.length} active
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
