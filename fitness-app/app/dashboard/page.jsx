"use client"

import { calculateDaysLeft, calculateWeightDifference } from "@/app/functions"
import { useEffect, useState } from "react"

import Link from "next/link"
import Navigation from "@/components/Navigation"
import ProgressTracker from "@/components/ProgressTracker"
import { createClient } from "@/utils/supabase/client"
import { handleDate } from "@/app/functions"
import useSWR from "swr"

export default function UserDashboard() {
  const [quote, setQuote] = useState(null)

  const fetchQuote = async () => {
    try {
      const response = await fetch("https://type.fit/api/quotes")
      const data = await response.json()

      const randomQuote = data[Math.floor(Math.random() * data.length)]

      const cleanAuthor = randomQuote.author
        ? randomQuote.author.split(",")[0]
        : "Unknown"
      const cleanQuote = { text: randomQuote.text, author: cleanAuthor }

      setQuote(cleanQuote)
    } catch (error) {
      console.error("Error fetching quote:", error)
    }
  }

  useEffect(() => {
    fetchQuote()
  }, [])
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
    identityId ? "/competitions/" + identityId : null,
    () =>
      supabase
        .from("competitions_players")
        .select("*")
        .eq("player_id", identityId)
        .then((res) => res.data),
    { revalidateOnFocus: false }
  )

  const { data: profiles } = useSWR(
    identityId ? "/profiles/" + identityId : null,
    () =>
      supabase
        .from("profiles")
        .select("*")
        .eq("id", identityId)
        .then((res) => res.data),
    { revalidateOnFocus: false }
  )

  const { data: goals } = useSWR(
    identityId ? "/profile_goals/" + identityId : null,
    () =>
      supabase
        .from("profile_goals")
        .select("*")
        .eq("profile_id", identityId)
        .then((res) => res.data),
    { revalidateOnFocus: false }
  )

  const { data: weights } = useSWR(
    identityId ? "/weights/" + identityId : null,
    () =>
      supabase
        .from("weight_tracker")
        .select("*")
        .eq("created_by", identityId)
        .order("created_at", { ascending: false })
        .limit(1)
        .then((res) => res.data),
    { revalidateOnFocus: false }
  )

  if (!user) {
    return (
      <div>
        Please <Link href="/login">login</Link> to view your dashboard.
      </div>
    )
  }

  if (!profiles) return <div>Loading...</div>

  const currentDate = new Date()
  const activeGoals = goals?.filter(
    (goal) => new Date(goal.goal_date) >= currentDate
  )

  return (
    <div>
      <Navigation />

      <div className="bg-white rounded-lg container mx-auto my-8 p-4 max-w-xl shadow-md">
        <h1 className="text-4xl font-semibold text-gray-800 mb-4 text-center">
          Welcome back, {profiles[0]?.first_name}!
        </h1>
        {quote && (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md my-4 mx-auto max-w-md">
            <blockquote className="text-xl italic font-semibold text-center text-gray-900">
              "{quote.text}"
            </blockquote>
            <p className="text-right mt-4 text-lg text-gray-600">
              - {quote.author}
            </p>
          </div>
        )}

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
                    {activeGoals?.map((goal) => (
                      <li key={goal.id} className="mb-1">
                        {handleDate(goal.goal_date)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Goal Weight</h4>
                  <ul>
                    {activeGoals?.map((goal) => (
                      <li key={goal.id} className="mb-1">
                        {goal.goal_weight} lbs
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Weight Remaining</h4>
                  <ul>
                    {activeGoals?.map((goal) => (
                      <li key={goal.id} className="mb-1">
                        {calculateWeightDifference(
                          goal.goal_weight,
                          weights?.[0]?.weight || 0
                        )}{" "}
                        lbs
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Days Left</h4>
                  <ul>
                    {activeGoals?.map((goal) => (
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
