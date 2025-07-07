"use client"

import { calculateDaysLeft, calculateWeightDifference } from "@/app/functions"
import useSWR from "swr"
import { GiStairsGoal } from "react-icons/gi"
import { FaBarsProgress } from "react-icons/fa6"
import { IoMdAdd, IoMdTrendingUp, IoMdTrendingDown } from "react-icons/io"
import { FaFire, FaCalendarCheck, FaWeight, FaTrophy, FaCalendarAlt } from "react-icons/fa"
import Link from "next/link"
import ProgressTracker from "@/components/ProgressTracker"
import { createClient } from "@/utils/supabase/client"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import InviteFriend from "@/components/InviteFriend"

// type Competition = {
//   id: string
//   competition_id: string
//   competitions: {
//     name: string
//     date_ending: string
//   }
// }

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
  created_at: string
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
  const supabase = createClient()
  const {
    data: user,
    error,
    isLoading,
  } = useSWR(
    "/user",
    async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = "/login"
        return null
      }
      return user
    },
    {
      revalidateOnFocus: false,
    }
  )

  let identityId = user?.identities?.[0]?.id || null

  // const competitionFetcher = async (url: string) => {
  //   const { data, error } = await supabase
  //     .from("competitions_players")
  //     .select(
  //       `
  //     *,
  //     competitions (
  //       name,
  //       date_started,
  //       date_ending,
  //       created_by
  //     )
  //   `
  //     )
  //     .eq("player_id", identityId)
  //
  //   if (error) {
  //     console.error("Error fetching competitions:", error.message)
  //     throw error
  //   }
  //   return data
  // }
  //
  // const { data: competitions } = useSWR<Competition[]>(
  //   identityId ? "/competitions/" + identityId : null,
  //   competitionFetcher,
  //   { revalidateOnFocus: false }
  // )

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
    identityId ? "/profile_goals/" + identityId : null,
    goalsFetcher,
    { revalidateOnFocus: false }
  )

  const weightFetcher = async (url: string) => {
    const { data, error: weightError } = await supabase
      .from("weight_tracker")
      .select("*")
      .eq("created_by", identityId)
      .order("created_at", { ascending: false })
      .limit(10)

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

  const calculateWeightTrend = () => {
    if (!weights || weights.length < 2) return null
    
    const recent = weights[0]?.weight || 0
    const previous = weights[1]?.weight || 0
    const difference = recent - previous
    
    return {
      difference: Math.abs(difference),
      isIncreasing: difference > 0,
      isDecreasing: difference < 0
    }
  }

  const getWeeklyProgress = () => {
    if (!weights || weights.length === 0) return null
    
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const recentWeights = weights.filter(w => new Date(w.created_at) >= oneWeekAgo)
    return recentWeights.length
  }

  const getWeeklySummary = () => {
    if (!weights || weights.length === 0) return null
    
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const thisWeekWeights = weights.filter(w => new Date(w.created_at) >= oneWeekAgo)
    const logsThisWeek = thisWeekWeights.length
  

    let weeklyChange = 0
    if (thisWeekWeights.length >= 2) {
      const newest = thisWeekWeights[0]?.weight || 0
      const oldest = thisWeekWeights[thisWeekWeights.length - 1]?.weight || 0
      weeklyChange = newest - oldest
    }
    
    // Calculate goal progress this week
    let goalProgress = 0
    if (goals && goals.length > 0 && weights.length > 0) {
      const currentWeight = weights[0]?.weight || 0
      const goalWeight = goals[0]?.goal_weight || 0
      const startWeight = weights[weights.length - 1]?.weight || currentWeight
      
      if (startWeight !== goalWeight) {
        goalProgress = ((startWeight - currentWeight) / (startWeight - goalWeight)) * 100
      }
    }
    
    return {
      logsThisWeek,
      weeklyChange,
      goalProgress: Math.min(100, Math.max(0, goalProgress))
    }
  }

  if (!user || !profiles) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-logo-green border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const weightTrend = calculateWeightTrend();
  const weeklyLogs = getWeeklyProgress();
  const weeklySummary = getWeeklySummary();

  return (
    <>
      <div className="flex-1 space-y-6 py-8 px-4 sm:px-6 md:px-8 min-h-screen">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight">
            Welcome back, {profiles[0].first_name}!
          </h2>
          <p className="text-gray-600">Here's your fitness journey at a glance</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-lg shadow-sm border bg-white p-4 text-center">
            <FaWeight className="h-8 w-8 text-logo-green mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {weights?.[0]?.weight || "—"}
            </div>
            <p className="text-xs text-gray-600">Current Weight</p>
            {weightTrend && (
              <div className="flex items-center justify-center mt-1">
                {weightTrend.isDecreasing ? (
                  <IoMdTrendingDown className="h-4 w-4 text-green-500 mr-1" />
                ) : weightTrend.isIncreasing ? (
                  <IoMdTrendingUp className="h-4 w-4 text-red-500 mr-1" />
                ) : null}
                <span className={`text-xs ${weightTrend.isDecreasing ? 'text-green-500' : 'text-red-500'}`}> 
                  {weightTrend.difference.toFixed(1)} lbs
                </span>
              </div>
            )}
          </div>

          <div className="rounded-lg shadow-sm border bg-white p-4 text-center">
            <FaCalendarCheck className="h-8 w-8 text-logo-green mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {weeklyLogs || 0}
            </div>
            <p className="text-xs text-gray-600">Logs This Week</p>
          </div>

          <div className="rounded-lg shadow-sm border bg-white p-4 text-center">
            <GiStairsGoal className="h-8 w-8 text-logo-green mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {goals?.length || 0}
            </div>
            <p className="text-xs text-gray-600">Active Goals</p>
          </div>

          <div className="rounded-lg shadow-sm border bg-white p-4 text-center">
            <FaTrophy className="h-8 w-8 text-logo-green mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {activeChallenge ? calculateChallengeProgress(activeChallenge).currentDay : 0}
            </div>
            <p className="text-xs text-gray-600">Challenge Days</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              <div className="col-span-1 md:col-span-2 lg:col-span-1 rounded-lg shadow-sm border bg-white p-6">
                <div className="flex flex-row items-center justify-between pb-3">
                  <h3 className="text-lg font-semibold text-logo-green">
                    Active Goals
                  </h3>
                  <div className="p-2 bg-logo-green/10 rounded-lg">
                    <GiStairsGoal className="h-5 w-5 text-logo-green" />
                  </div>
                </div>
                <div className="space-y-4">
                  {goals && goals.length > 0 ? (
                    <>
                      <div className="text-center p-4 bg-mint-cream rounded-xl">
                        <div className="text-3xl font-bold text-logo-green mb-1">
                          {calculateWeightDifference(
                            goals[0]?.goal_weight || 0,
                            weights?.[0]?.weight || 0
                          )} lbs
                        </div>
                        <p className="text-sm text-gray-600">to reach your goal</p>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Target: {goals[0]?.goal_weight} lbs</span>
                        <span className="text-gray-600">{calculateDaysLeft(goals[0]?.goal_date)} days left</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-logo-green h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min(100, Math.max(0, ((weights?.[0]?.weight || 0) / (goals[0]?.goal_weight || 1)) * 100))}%` 
                          }}
                        ></div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <GiStairsGoal className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 mb-4">No active goals yet</p>
                    </div>
                  )}
                  <Link
                    href="/goals"
                    className="w-full block text-center px-4 py-3 bg-logo-green text-white text-sm font-semibold rounded-lg hover:bg-logo-green/80 transition-all duration-300"
                  >
                    {goals && goals.length > 0 ? "Manage Goals" : "Set Your First Goal"}
                  </Link>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 lg:col-span-1 rounded-lg shadow-sm border bg-white p-6">
                <div className="flex flex-row items-center justify-between pb-3">
                  <h3 className="text-lg font-semibold text-logo-green">
                    75 Day Challenge
                  </h3>
                  <div className="p-2 bg-logo-green/10 rounded-lg">
                    <FaFire className="h-5 w-5 text-logo-green" />
                  </div>
                </div>
                <div className="space-y-4">
                  {activeChallenge ? (
                    <>
                      <div className="text-center p-4 bg-mint-cream rounded-xl">
                        <div className="text-3xl font-bold text-logo-green mb-1">
                          Day {calculateChallengeProgress(activeChallenge).currentDay}
                        </div>
                        <p className="text-sm text-gray-600">
                          of 75 - {activeChallenge.tier} Challenge
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-logo-green h-3 rounded-full transition-all duration-500"
                          style={{ width: `${calculateChallengeProgress(activeChallenge).percentage}%` }}
                        ></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          href={`/challenges/${activeChallenge.id}/daily`}
                          className="text-center px-3 py-2 bg-logo-green text-white text-sm font-semibold rounded-lg hover:bg-logo-green/80 transition-all duration-300"
                        >
                          Today's Tasks
                        </Link>
                        <Link
                          href={`/challenges/${activeChallenge.id}`}
                          className="text-center px-3 py-2 border-2 border-logo-green text-logo-green text-sm font-semibold rounded-lg hover:bg-logo-green hover:text-white transition-all duration-300"
                        >
                          View Progress
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <FaFire className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 mb-2">Ready for a challenge?</p>
                      <p className="text-xs text-gray-400 mb-4">
                        Transform your habits over 75 days
                      </p>
                      <Link
                        href="/challenges"
                        className="inline-block px-6 py-3 bg-logo-green text-white text-sm font-semibold rounded-lg hover:bg-logo-green/80 transition-all duration-300"
                      >
                        Start Challenge
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 lg:col-span-1 rounded-lg shadow-sm border bg-white p-6">
                <div className="flex flex-row items-center justify-between pb-3">
                  <h3 className="text-lg font-semibold text-logo-green">
                    Progress Tracker
                  </h3>
                  <div className="p-2 bg-logo-green/10 rounded-lg">
                    <FaBarsProgress className="h-5 w-5 text-logo-green" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <ProgressTracker />
                  </div>
                  <div className="text-center text-xs text-gray-500">
                    Your weight tracking activity over the last 30 days
                  </div>
                  <Link
                    href="/weight-log"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-logo-green text-white font-semibold rounded-lg hover:bg-logo-green/80 transition-all duration-300 text-sm"
                  >
                    <IoMdAdd className="w-4 h-4" />
                    Log Weight
                  </Link>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 lg:col-span-1 rounded-lg shadow-sm border bg-white p-6">
                <div className="flex flex-row items-center justify-between pb-3">
                  <h3 className="text-lg font-semibold text-logo-green">
                    Weekly Summary
                  </h3>
                  <div className="p-2 bg-logo-green/10 rounded-lg">
                    <FaCalendarAlt className="h-5 w-5 text-logo-green" />
                  </div>
                </div>
                <div className="space-y-4">
                  {weeklySummary ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-mint-cream rounded-lg">
                          <div className="text-xl font-bold text-logo-green">
                            {weeklySummary?.logsThisWeek ?? 0}
                          </div>
                          <p className="text-xs text-gray-600">Logs This Week</p>
                        </div>
                        <div className="text-center p-3 bg-mint-cream rounded-lg">
                          <div className="text-xl font-bold text-logo-green">
                            {weeklySummary?.weeklyChange && weeklySummary.weeklyChange > 0 ? '+' : ''}{weeklySummary?.weeklyChange?.toFixed(1) ?? '0.0'} lbs
                          </div>
                          <p className="text-xs text-gray-600">Weekly Change</p>
                        </div>
                      </div>
                      {goals && goals.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Goal Progress</span>
                            <span className="text-gray-600">{weeklySummary?.goalProgress?.toFixed(1) ?? '0.0'}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-logo-green h-2 rounded-full transition-all duration-500"
                              style={{ width: `${weeklySummary?.goalProgress ?? 0}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      <div className="text-center text-xs text-gray-500">
                        {weeklySummary?.weeklyChange !== undefined && weeklySummary.weeklyChange < 0 ? "Great progress this week! 🎉" : 
                          weeklySummary?.weeklyChange !== undefined && weeklySummary.weeklyChange > 0 ? "Keep pushing forward! 💪" : 
                          "Stay consistent! 📈"}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <FaCalendarAlt className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No data this week</p>
                      <p className="text-xs text-gray-400 mt-1">Start logging to see your weekly summary</p>
                    </div>
                  )}
                </div>
              </div>
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
