"use client"

import {
  calculateDaysLeft,
  calculateWeightDifference,
  calculateWeightDifferenceSinceMonthStart,
} from "@/app/functions"
import useSWR from "swr"
import { GiBodyHeight, GiStairsGoal } from "react-icons/gi"
import { HiOutlineLightBulb } from "react-icons/hi"
import { IoFootstepsOutline } from "react-icons/io5"
import { LuAward } from "react-icons/lu"
import { LuGlassWater } from "react-icons/lu"
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
      <div className="flex-1 space-y-4 py-16 px-8">
        <h2 className="text-4xl font-extrabold mb-2 tracking-tight">
          {profiles[0].first_name}'s Dashboard
        </h2>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* goals card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Goals
                  </CardTitle>
                  <GiStairsGoal className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <p className="text-logo-green">
                      {calculateWeightDifference(
                        goals?.[0]?.goal_weight || 0,
                        weights?.[0]?.weight || 0
                      )}{" "}
                      lbs to go
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {calculateDaysLeft(goals?.[0]?.goal_date)} days left to
                    achieve your goal!
                  </p>
                  <div className="flex justify-center">
                    <Link
                      href="/goals"
                      className=" mt-7 px-4 py-2 bg-logo-green text-white text-sm font-semibold rounded-lg shadow-md hover:bg-opacity-90 focus:outline-none focus:ring focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                    >
                      Set a Goal
                    </Link>
                  </div>
                </CardContent>
              </Card>
              {/* competitions card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Competitions
                  </CardTitle>
                  <FaRunning className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="m-2">
                  <CarouselOrientation competitions={competitions} />
                </CardContent>
              </Card>
              {/* weight card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Calories to Burn Today
                  </CardTitle>
                  <IoFootstepsOutline className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-logo-green">
                    {calculateWeightDifferenceSinceMonthStart(
                      goals?.[0]?.goal_weight || 0,
                      weights?.[0]?.weight || 0
                    )}{" "}
                    lbs
                  </div>
                  <p className="text-xs text-muted-foreground">
                    -20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Today's Badges Earned
                  </CardTitle>
                  <LuAward className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {/* Badge 1 */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-logo-green text-white rounded-full flex items-center justify-center shadow-md">
                        🏅
                      </div>
                      <p className="text-xs mt-2 text-muted-foreground">
                        Workout Master
                      </p>
                    </div>
                    {/* Badge 2 */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md">
                        💧
                      </div>
                      <p className="text-xs mt-2 text-muted-foreground">
                        Hydration Hero
                      </p>
                    </div>
                    {/* Badge 3 */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center shadow-md">
                        🥗
                      </div>
                      <p className="text-xs mt-2 text-muted-foreground">
                        Nutrition Champ
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    Great work! Keep earning badges to track your progress.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    In the last 30 days, you tracked your weight on the
                    following days:
                  </CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ProgressTracker />
                </CardContent>
              </Card>
              <Card className="col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Water Intake
                  </CardTitle>
                  <LuGlassWater className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2350</div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Did you know?
                  </CardTitle>
                  <HiOutlineLightBulb className="h-4 w-4 text-muted-foreground text-yellow-400" />
                </CardHeader>
                <CardContent className="px-4 py-6">
                  {foodTrivia ? (
                    <div className="space-y-4">
                      <p className="text-justify text-gray-600 leading-relaxed pl-2">
                        {foodTrivia.text}
                      </p>
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
