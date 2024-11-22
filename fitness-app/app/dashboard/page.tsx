"use client"

import { calculateDaysLeft, calculateWeightDifference } from "@/app/functions"
import useSWR from "swr"
import Footer from "@/components/Footer"
import { FaCalculator } from "react-icons/fa"
import { GiBodyHeight } from "react-icons/gi"
import { BiFoodMenu } from "react-icons/bi"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import ProgressTracker from "@/components/ProgressTracker"
import { createClient } from "@/utils/supabase/client"
import { handleDate } from "@/app/functions"

export default function UserDashboard() {
  type Competition = {
    competition_id: any
    id: number
    name: string
    date_started: string
    date_ending: string
    created_by: number
    created_at: string
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
      .select(
        `
      *,
      competitions (
        name,
        date_started,
        date_ending,
        created_by
      )
    `
      )
      .eq("player_id", identityId)

    if (error) {
      console.error("Error fetching competitions:", error.message)
      throw error
    }
    return data
  }

  const { data: competitions } = useSWR<Competition[]>(
    identityId ? "/competitions/" + identityId : null,
    competitionFetcher,
    { revalidateOnFocus: false }
  )

  console.log(competitions, "hi")

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

  console.log(weights, "weights")

  if (!user || !profiles) {
    return <div>Loading...</div>
  }

  const currentDate = new Date()
  const activeGoals = goals?.filter(
    (goal) => new Date(goal.goal_date) >= currentDate
  )

  return (
    <div className="w-full">
      <Navigation />
      <section className="py-12 bg-nav-bkg">
        {profiles[0]?.first_name && (
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold pt-10 mb-10 ml-20 text-center 
             text-header-text-bkg relative"
          >
            <span className="relative z-10">
              Welcome back,{" "}
              <span className="text-logo-green">
                {profiles[0]?.first_name}!
              </span>
            </span>
            <span
              className="absolute inset-0 blur-sm text-logo-green opacity-40"
              aria-hidden="true"
            >
              Welcome back, {profiles[0]?.first_name}!
            </span>
          </h1>
        )}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-button-text mb-6">
            Your Progress
          </h2>
          <div className="bg-gray-50 shadow-lg rounded-lg p-6">
            <ProgressTracker />
            <p className="text-sm text-gray-600 mt-4 text-center">
              Want to check detailed progress?{" "}
              <Link
                href="/tracker/chart"
                className="text-green-600 font-semibold hover:underline"
              >
                View charts here
              </Link>
            </p>
          </div>
        </div>
      </section>
      <section className="py-12 bg-nav-bkg">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <div className="flex flex-col">
              <h3 className="text-2xl font-semibold text-button-text mb-4">
                Active Goals
              </h3>
              <div className="flex-1">
                {activeGoals?.length ? (
                  <div className="grid grid-cols-1 gap-6">
                    {activeGoals.map((goal) => (
                      <div
                        key={goal.id}
                        className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300 flex flex-col h-full"
                      >
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">
                          {handleDate(goal.goal_date)}
                        </h4>
                        <p className="text-gray-600">
                          Goal Weight: {goal.goal_weight} lbs
                        </p>
                        <p className="text-gray-600">
                          Remaining:{" "}
                          {calculateWeightDifference(
                            goal.goal_weight,
                            weights?.[0]?.weight || 0
                          )}{" "}
                          lbs
                        </p>
                        <div className="mt-auto">
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-blue-500 rounded-full"
                              style={{
                                width: `${calculateDaysLeft(goal.goal_date)}%`,
                              }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            {calculateDaysLeft(goal.goal_date)} days left
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No active goals set.</p>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <h3 className="text-2xl font-semibold text-button-text mb-4">
                Active Competitions
              </h3>
              <div className="flex-1">
                {competitions?.length ? (
                  <div className="grid grid-cols-1 gap-6">
                    {competitions.map((competition) => (
                      <div
                        key={competition.id}
                        className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300 flex flex-col h-full"
                      >
                        <Link
                          className="text-lg font-semibold text-gray-700 mb-2"
                          href={`/competitions/${competition.competition_id}`}
                        >
                          {competition.competitions.name}
                        </Link>
                        <p className="text-gray-600">
                          Participants: {competitions.length}
                        </p>
                        <p className="text-gray-600">
                          End Date:{" "}
                          {handleDate(competition.competitions.date_ending)}
                        </p>
                        <div className="mt-auto">
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-blue-500 rounded-full"
                              style={{
                                width: `${
                                  100 -
                                  calculateDaysLeft(
                                    competition.competitions.date_ending
                                  )
                                }%`,
                              }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            {calculateDaysLeft(
                              competition.competitions.date_ending
                            )}{" "}
                            days left
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No active competitions joined.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-prm-bkg text-white py-16 overflow-hidden">
        <div className="relative max-w-6xl mx-auto flex flex-wrap justify-between items-center z-10">
          <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 text-shadow-xl">
              Stay Motivated!
            </h2>
            <p className="text-lg lg:text-xl font-light leading-relaxed">
              Set fitness goals and join competitions to stay on track with your
              health journey.
            </p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/goals"
              className="relative bg-white text-prm-bkg font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Set a New Goal
              <div className="absolute inset-0 rounded-lg bg-[#E8F5E9] opacity-0 hover:opacity-20 transition duration-300"></div>
            </Link>
            <Link
              href="/competitions/create"
              className="relative bg-white text-[#123438] font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Join a Competition
              <div className="absolute inset-0 rounded-lg bg-[#DFF3F6] opacity-0 hover:opacity-20 transition duration-300"></div>
            </Link>
          </div>
        </div>
      </section>
      <section className="py-12 bg-nav-bkg">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-button-text mb-8">
            Explore More Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <Link href="/calculator">
              <div className="bg-gray-50 rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300">
                <GiBodyHeight className="text-4xl text-logo-green mx-auto mb-4" />
                <h3 className="text-lg font-semibold">BMI Calculator</h3>
              </div>
            </Link>
            <Link href="/calculator/calorie">
              <div className="bg-gray-50 rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300">
                <FaCalculator className="text-4xl text-logo-green mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Calorie Calculator</h3>
              </div>
            </Link>
            <Link href="/recipes">
              <div className="bg-gray-50 rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300">
                <BiFoodMenu className="text-4xl text-logo-green mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Recipe Finder</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
