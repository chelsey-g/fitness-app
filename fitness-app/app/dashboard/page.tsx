"use client"

import { calculateDaysLeft, calculateWeightDifference } from "@/app/functions"
import useSWR from "swr"
import { GiStairsGoal } from "react-icons/gi"
import { HiOutlineLightBulb } from "react-icons/hi"
// import { FaRunning } from "react-icons/fa"
import { FaBarsProgress } from "react-icons/fa6"
import { IoMdAdd } from "react-icons/io"
import Link from "next/link"
// import CarouselOrientation from "@/components/CompetitionsCarousel"
import ProgressTracker from "@/components/ProgressTracker"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import InviteFriend from "@/components/InviteFriend"
import { FaFire } from "react-icons/fa"

type Competition = {
  id: string
  competition_id: string
  competitions: {
    name: string
    date_ending: string
  }
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

type Challenge = {
  id: string
  user_id: string
  tier: "Soft" | "Medium" | "Hard"
  start_date: string
  end_date: string
  rules: string[]
  is_active: boolean
  created_at: string
}

export default function UserDashboard() {
  const triviaFetcher = (url: string) =>
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY || "",
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch")
      }
      return res.json()
    })

  const { data: foodTrivia, error: foodError } = useSWR(
    "https://api.spoonacular.com/food/trivia/random",
    triviaFetcher
  )
  const supabase = createClient()
  const {
    data: user,
    error,
    isLoading,
  } = useSWR(
    "/user",
    async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = "/login"
        return null
      }
      return session.user
    },
    {
      revalidateOnFocus: false,
    }
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

  const profilesFetcher = async (url: string) => {
    const { data, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", identityId)

    if (profilesError) {
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
    const { data, error: goalsError } = await supabase
      .from("profile_goals")
      .select("*")
      .eq("profile_id", identityId)

    if (goalsError) {
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
    const { data, error: weightError } = await supabase
      .from("weight_tracker")
      .select("*")
      .eq("created_by", identityId)
      .order("created_at", { ascending: false })
      .limit(1)

    if (weightError) {
      throw error
    }

    return data
  }

  const { data: weights } = useSWR<Weight[]>(
    identityId ? "/weights/" + identityId : null,
    weightFetcher,
    { revalidateOnFocus: false }
  )

  const challengeFetcher = async (url: string) => {
    const { data, error: challengeError } = await supabase
      .from("challenges")
      .select("*")
      .eq("user_id", identityId)
      .eq("is_active", true)
      .single()

    if (challengeError && challengeError.code !== 'PGRST116') {
      throw challengeError
    }

    return data
  }

  const { data: activeChallenge } = useSWR<Challenge>(
    identityId ? "/challenge/" + identityId : null,
    challengeFetcher,
    { revalidateOnFocus: false }
  )

  const calculateChallengeProgress = (challenge: Challenge) => {
    const startDate = new Date(challenge.start_date)
    const today = new Date()
    
    const daysPassed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    
    return {
      currentDay: Math.max(1, Math.min(daysPassed, 75)),
      totalDays: 75,
      percentage: Math.min(100, Math.max(0, (daysPassed / 75) * 100))
    }
  }

  if (!user || !profiles) {
    return <div>Loading...</div>
  }

  const currentDate = new Date()

  return (
    <>
      <div className="flex-1 space-y-6 py-12 px-4 sm:px-6 md:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 tracking-tight text-center sm:text-left">
          {profiles[0].first_name}'s Dashboard
        </h2>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <Card className="col-span-1 sm:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Goals
                  </CardTitle>
                  <GiStairsGoal className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold text-center">
                    <p className="text-logo-green">
                      {calculateWeightDifference(
                        goals?.[0]?.goal_weight || 0,
                        weights?.[0]?.weight || 0
                      )}{" "}
                      lbs to go
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {calculateDaysLeft(goals?.[0]?.goal_date)} days left to
                    achieve your goal!
                  </p>
                  <div className="flex justify-center mt-4">
                    <Link
                      href="/goals"
                      className="w-full sm:w-auto text-center px-4 py-2 bg-logo-green text-white text-sm font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition"
                    >
                      Set a Goal
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* <Card className="col-span-1 sm:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Competitions
                  </CardTitle>
                  <FaRunning className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="m-2">
                  <div className="overflow-x-auto">
                    <CarouselOrientation competitions={competitions || []} />
                  </div>
                </CardContent>
              </Card> */}
                            <Card className="col-span-1 sm:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    75 Day Challenge
                  </CardTitle>
                  <FaFire className="h-5 w-5 text-orange-500" />
                </CardHeader>
                <CardContent className="px-4 py-6">
                  {activeChallenge ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          Day {calculateChallengeProgress(activeChallenge).currentDay}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          of 75 - {activeChallenge.tier} Challenge
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calculateChallengeProgress(activeChallenge).percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/challenges/${activeChallenge.id}/daily`}
                          className="flex-1 text-center px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
                        >
                          Today's Tasks
                        </Link>
                        <Link
                          href={`/challenges/${activeChallenge.id}`}
                          className="flex-1 text-center px-3 py-2 border border-orange-500 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition"
                        >
                          View Progress
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="text-gray-600">
                        <FaFire className="mx-auto text-3xl text-orange-500 mb-2" />
                        <p className="text-sm">Ready for a challenge?</p>
                        <p className="text-xs text-muted-foreground">
                          Transform your habits over 75 days
                        </p>
                      </div>
                      <Link
                        href="/challenges"
                        className="inline-block px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-orange-600 transition"
                      >
                        Start 75 Day Challenge
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-1 sm:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Progress Tracker
                  </CardTitle>
                  <FaBarsProgress className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="m-2">
                  <div className="overflow-x-auto">
                    <ProgressTracker />
                  </div>
                  <div className="block text-center text-xs text-gray-500 mt-2">
                    This chart shows the days you've tracked your weight over
                    the last 30 days.
                  </div>
                  <div className="flex justify-center mt-4">
                    <Link
                      href="/tracker"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-logo-green text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm text-sm"
                    >
                      <IoMdAdd className="w-4 h-4" />
                      Add Weight
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1 sm:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Did you know?
                  </CardTitle>
                  <HiOutlineLightBulb className="h-5 w-5 text-muted-foreground text-yellow-400" />
                </CardHeader>
                <CardContent className="px-4 py-6">
                  {foodTrivia ? (
                    <div className="text-gray-600 leading-relaxed text-center sm:text-left">
                      {foodTrivia.text}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-20">
                      <p className="text-gray-500 italic">Loading trivia...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <InviteFriend />
        </div>
      </div>
    </>
  )
}
