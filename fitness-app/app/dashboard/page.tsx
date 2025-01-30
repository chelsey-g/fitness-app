"use client"

import {
  calculateDaysLeft,
  calculateWeightDifference,
  calculateWeightDifferenceSinceMonthStart,
} from "@/app/functions"
import useSWR from "swr"
import { GiStairsGoal } from "react-icons/gi"
import { HiOutlineLightBulb } from "react-icons/hi"
import { FaRunning } from "react-icons/fa"
import Link from "next/link"
import CarouselOrientation from "@/components/CompetitionsCarousel"
import ProgressTracker from "@/components/ProgressTracker"
import { createClient } from "@/utils/supabase/client"
import { handleDate } from "@/app/functions"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UserDashboard() {
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

  console.log(goals, "goals")

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

  console.log(weights, "weights")

  if (!user || !profiles) {
    return <div>Loading...</div>
  }

  const currentDate = new Date()
  const activeGoals = goals?.filter(
    (goal) => new Date(goal.goal_date) >= currentDate
  )

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

              <Card className="col-span-1 sm:col-span-2">
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
              </Card>

              <Card className="col-span-1 sm:col-span-4">
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
      </div>
    </>
  )
}
