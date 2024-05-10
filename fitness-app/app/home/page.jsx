"use client"

import Link from "next/link"
import Navigation from "@/components/Navigation"
import ProgressTracker from "@/components/ProgressTracker"
import { createClient } from "@/utils/supabase/client"
import { handleDate } from "@/app/functions"
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

  const { data: competitions } = useSWR(
    () => (identityId ? "/competitions/" + identityId : null),
    () =>
      supabase
        .from("competitions_players")
        .select("*")
        .eq("player_id", identityId)
        .then((res) => res.data)
  )

  const { data: profiles } = useSWR(
    identityId ? "/profiles/" + identityId : null,
    () =>
      supabase
        .from("profiles")
        .select("*")
        .eq("id", identityId)
        .then((res) => res.data)
  )

  const { data: goals } = useSWR(
    () => (identityId ? "/profile_goals/" + identityId : null),
    () =>
      supabase
        .from("profile_goals")
        .select("*")
        .eq("profile_id", identityId)
        .then((res) => res.data)
  )

  const { data: weights } = useSWR(
    () => (identityId ? "/weights/" + identityId : null),
    () =>
      supabase
        .from("weight_tracker")
        .select("*")
        .eq("created_by", identityId)
        .order("created_at", { ascending: false })
        .limit(1)
        .then((res) => res.data)
  )
  console.log(weights, "weights")

  if (!profiles) return

  const calculateWeightDifference = (goalWeight, currentWeight) => {
    return goalWeight - currentWeight
  }

  const calculateDaysLeft = (date) => {
    const goalDate = new Date(date)
    const today = new Date()
    const differenceInTime = goalDate.getTime() - today.getTime()
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24))
    return differenceInDays
  }

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
              <h3 className="text-lg font-semibold mb-2">Active Goals</h3>
              <div className="flex justify-around">
                <div>
                  <h4 className="font-semibold mb-1">Goal Date</h4>
                  <ul>
                    {goals.map((goal) => (
                      <li key={goal.id} className="mb-1">
                        {handleDate(goal.goal_date)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Goal Weight</h4>
                  <ul>
                    {goals.map((goal) => (
                      <li key={goal.id} className="mb-1">
                        {goal.goal_weight} lbs
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Weight Remaining</h4>
                  <ul>
                    {goals.map((goal) => (
                      <li key={goal.id} className="mb-1">
                        {calculateWeightDifference(
                          goal.goal_date,
                          weights[0].id
                        )}{" "}
                        lbs
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Days Left</h4>
                  <ul>
                    {goals.map((goal) => (
                      <li key={goal.id} className="mb-1">
                        {calculateDaysLeft(goal.goal_date)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
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
