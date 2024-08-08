"use client"

import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa"
import { calculateDaysLeft, calculateWeightDifference } from "@/app/functions"
import { useEffect, useState } from "react"
import useSWR, { Fetcher } from "swr"

import { FaCalculator } from "react-icons/fa"
import { GiBodyHeight } from "react-icons/gi"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import ProgressTracker from "@/components/ProgressTracker"
import { createClient } from "@/utils/supabase/client"
import { handleDate } from "@/app/functions"

export default function UserDashboard() {
  const [quote, setQuote] = useState<any | null>(null)

  type Competition = {
    id: number
  }

  type Profile = {
    id: number
    first_name: string
  }

  type Goals = {
    id: number
    goal_date: string
    goal_weight: number
  }

  type Weight = {
    created_by: number
    weight: number
  }

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

  const competitionFetcher = async (url: string) => {
    const { data, error } = await supabase
      .from("competitions_players")
      .select("*")
      .eq("player_id", identityId)

    if (error) {
      throw error
    }

    return data
  }
  const { data: competitions } = useSWR<Competition[]>(
    identityId ? "/competitions/" + identityId : null,
    competitionFetcher,
    { revalidateOnFocus: false }
  )

  const profilesFetcher = async (url: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", identityId)

    if (error) {
      throw error
    }

    return data
  }

  const { data: profiles } = useSWR<Profile[]>(
    identityId ? "/profiles/" + identityId : null,
    profilesFetcher,
    { revalidateOnFocus: false }
  )

  const goalsFetcher = async (url: string) => {
    const { data, error } = await supabase
      .from("profile_goals")
      .select("*")
      .eq("profile_id", identityId)

    if (error) {
      throw error
    }

    return data
  }

  const { data: goals } = useSWR<Goals[]>(
    identityId ? "/profile  goals/" + identityId : null,
    goalsFetcher,
    { revalidateOnFocus: false }
  )

  const weightFetcher = async (url: string) => {
    const { data, error } = await supabase
      .from("weight_tracker")
      .select("*")
      .eq("created_by", identityId)
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      throw error
    }

    return data
  }

  const { data: weights } = useSWR<Weight[]>(
    identityId ? "/weights/" + identityId : null,
    weightFetcher,
    { revalidateOnFocus: false }
  )

  if (!user) {
    return <div>Loading...</div>
  }

  if (!profiles) return <div>Loading...</div>

  const currentDate = new Date()
  const activeGoals = goals?.filter(
    (goal) => new Date(goal.goal_date) >= currentDate
  )

  return (
    <div>
      <Navigation />

      <div className="bg-white rounded-lg container mx-auto my-8 p-4 shadow-md">
        {profiles[0].first_name && (
          <h1 className="text-4xl font-semibold text-gray-800 mb-4 text-center">
            Welcome back, {profiles[0]?.first_name}!
          </h1>
        )}
        {quote && (
          <div className="bg-white p-6 rounded-lg opacity-90 my-4 mx-auto max-w-md flex flex-col items-center">
            <div className="flex items-center">
              <FaQuoteLeft className="text-lg text-gray-500 mr-2" />
              <blockquote className="text-sm italic font-semibold text-center text-gray-900">
                {quote.text}
              </blockquote>
              <FaQuoteRight className="text-lg text-gray-500 ml-2" />
            </div>
            <p className="text-right mt-4 text-md text-gray-600">
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
        {!competitions?.length && !activeGoals?.length && (
          <div className="text-center mt-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Stay Motivated!
            </h3>
            <p className="text-gray-600 mb-4">
              Set your fitness goals to start your journey towards a healthier
              lifestyle.
            </p>
            <Link
              href="/goals"
              className="bg-snd-bkg hover:bg-opacity-90 text-white font-bold py-2 px-6 rounded items-center transition duration-300 ease-in-out mb-4"
            >
              Set a New Goal
            </Link>
            <p className="text-gray-600 mt-4 mb-4">
              Join a competition to challenge yourself and stay motivated.
            </p>
            <Link
              href="/competitions/create"
              className="bg-snd-bkg hover:bg-opacity-90 text-white font-bold py-2 px-6 rounded items-center transition duration-300 ease-in-out mt-4"
            >
              Create a Competition
            </Link>
          </div>
        )}

        {((goals?.length ?? 0) > 0 && (
          <div className="mt-5 text-sm text-center">
            <h3 className="text-2xl font-semibold mb-5">Active Goals</h3>
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
        )) || (
          <div className="text-center mt-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Stay Motivated!
            </h3>
            <p className="text-gray-600 mb-4">
              Set your fitness goals to start your journey towards a healthier
              lifestyle.
            </p>
            <Link
              href="/goals"
              className="bg-snd-bkg hover:bg-opacity-90 text-white font-bold py-2 px-6 rounded items-center transition duration-300 ease-in-out mb-4 mt-4"
            >
              Set a New Goal
            </Link>
          </div>
        )}

        <div className="max-w-4xl mx-auto mt-10">
          <h2 className="text-2xl font-bold text-center mb-5 text-gray-800">
            Explore More Tools
          </h2>
          <div className="flex justify-around p-5">
            <Link href="/calculator">
              <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition duration-300 ease-in-out cursor-pointer ml-5">
                <GiBodyHeight className="text-2xl text-blue-500 mx-auto mb-4" />
                <h3 className="text-md font-bold">BMI Calculator</h3>
              </div>
            </Link>
            <Link href="/calculator/calorie">
              <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition duration-300 ease-in-out cursor-pointer">
                <FaCalculator className="text-2xl text-green-500 mx-auto mb-4" />
                <h3 className="text-md font-bold">Calorie Calculator</h3>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <footer className="py-4">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} HabitKick. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
