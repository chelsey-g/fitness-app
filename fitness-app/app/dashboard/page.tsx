"use client"

import { calculateDaysLeft, calculateWeightDifference } from "@/app/functions"
import useSWR from "swr"
import { GiStairsGoal } from "react-icons/gi"
import { FaBarsProgress } from "react-icons/fa6"
import { IoMdTrendingDown, IoMdTrendingUp, IoMdAdd } from "react-icons/io"
import { FaFire, FaCalendarAlt, FaWeight, FaCalendarCheck, FaTrophy } from "react-icons/fa"
import Link from "next/link"
import ProgressTracker from "@/components/ProgressTracker"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import InviteFriend from "@/components/InviteFriend"
import { goalService } from "@/app/services/GoalService"
import { profileService } from "@/app/services/ProfileService"
import { AuthService } from "@/app/services/AuthService"
import { weightService, WeightEntry } from "@/app/services/WeightService"
import { challengeService, Challenge } from "@/app/services/ChallengeService"
import { createClient } from "@/utils/supabase/client"

const supabase = createClient();
const authService = new AuthService(supabase);

type Profile = {
  id: string
  first_name: string
  last_name?: string
}

type Goal = {
  id: number
  goal_date: string
  goal_weight: number
}

// type Weight = {
//   created_by: number
//   weight: number
//   created_at: string
// }


export default function UserDashboard() {
  const { data: user, isLoading: userLoading } = useSWR("/users", () => 
    authService.getUser());

  let identityId = user?.id || null

  // const competitionFetcher = async (url: string) => {
  //   const { data, error } = await competitionService.getCompetitions()
  //   return data
  // }
  
  // const { data: competitions } = useSWR<Competition[]>(
  //   identityId ? "/competitions/" + identityId : null,
  //   competitionFetcher,
  //   { revalidateOnFocus: false }
  // )

  const profilesFetcher = async () => {
    const data = await profileService.getProfile(identityId as string)
    return data
  }

  const { data: profiles } = useSWR<Profile[]>(
    identityId ? "/profiles/" + identityId : null,
    profilesFetcher,
    { revalidateOnFocus: false }
  )
  
  const goalsFetcher = async () => {
    const data = await goalService.getGoals(identityId as string)

    return data
  }

  const { data: goals } = useSWR<Goal[]>(
    identityId ? "/profile_goals/" + identityId : null,
    goalsFetcher,
    { revalidateOnFocus: false }
  )

  const weightFetcher = async () => {
    const data = await weightService.getWeightEntries(identityId as string)
    return data
  }

  const { data: weights } = useSWR<WeightEntry[]>(
    identityId ? "/weights/" + identityId : null,
    weightFetcher,
    { revalidateOnFocus: false }
  )

  const challengeFetcher = async () => {
    const data = await challengeService.getChallenges(identityId as string)
    return data
  }

  const { data: challenges } = useSWR<Challenge[]>(
    identityId ? "/challenge/" + identityId : null,
    challengeFetcher,
    { revalidateOnFocus: false }
  )

  const activeChallenge = challenges?.find(challenge => challenge.is_active)

  const calculateChallengeProgress = (challenge: Challenge) => {
    const startDate = new Date(challenge.start_date + 'T00:00:00')
    const today = new Date()
    
    // Set today to start of day for consistent comparison
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    
    const daysPassed = Math.ceil((todayStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    
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

  if (userLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-logo-green border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user?.id) {
    return null
  }

  if (!profiles) {
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

  const getCurrentActiveGoal = () => {
    if (!goals || goals.length === 0) return null;
    
    const currentDate = new Date();
    const activeGoals = goals.filter(goal => new Date(goal.goal_date) >= currentDate);
    
    if (activeGoals.length === 0) return null;
    
    return activeGoals.sort((a, b) => new Date(a.goal_date).getTime() - new Date(b.goal_date).getTime())[0];
  };

  const currentActiveGoal = getCurrentActiveGoal();

  return (
    <>
      <div className="flex-1 space-y-6 py-8 px-4 sm:px-6 md:px-8 min-h-screen">
        <div className="text-center mb-8 relative">
          {/* Main content container */}
          <div className="relative bg-black rounded-3xl p-12 shadow-2xl">
            {/* Main greeting */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-white via-logo-green to-white bg-clip-text text-transparent">
                Welcome back, {profiles[0].first_name}!
              </span>
            </h1>
            
            {/* Stats preview */}
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
              <div className="text-center bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-black mb-1">
                  {weights?.[0]?.weight || "—"}
                </div>
                <div className="text-xs text-gray-500 font-medium">Current Weight</div>
              </div>
              <div className="text-center bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-black mb-1">
                  {goals ? goals.filter(goal => new Date(goal.goal_date) >= new Date()).length : 0}
                </div>
                <div className="text-xs text-gray-500 font-medium">Active Goals</div>
              </div>
              <div className="text-center bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-black mb-1">
                  {activeChallenge ? calculateChallengeProgress(activeChallenge).currentDay : 0}
                </div>
                <div className="text-xs text-gray-500 font-medium">Challenge Day</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-logo-green/30">
            <div className="absolute inset-0 bg-gradient-to-br from-logo-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-logo-green to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaWeight className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {weights?.[0]?.weight || "—"}
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">Current Weight</p>
              {weightTrend && (
                <div className="flex items-center justify-center">
                  {weightTrend.isDecreasing ? (
                    <IoMdTrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  ) : weightTrend.isIncreasing ? (
                    <IoMdTrendingUp className="h-4 w-4 text-red-500 mr-1" />
                  ) : null}
                  <span className={`text-xs font-medium ${weightTrend.isDecreasing ? 'text-green-500' : 'text-red-500'}`}> 
                    {weightTrend.difference.toFixed(1)} lbs
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-logo-green/30">
            <div className="absolute inset-0 bg-gradient-to-br from-logo-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-logo-green to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaCalendarCheck className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {weeklyLogs || 0}
              </div>
              <p className="text-sm font-medium text-gray-600">Logs This Week</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-logo-green/30">
            <div className="absolute inset-0 bg-gradient-to-br from-logo-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-logo-green to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <GiStairsGoal className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {goals ? goals.filter(goal => new Date(goal.goal_date) >= new Date()).length : 0}
              </div>
              <p className="text-sm font-medium text-gray-600">Active Goals</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-logo-green/30">
            <div className="absolute inset-0 bg-gradient-to-br from-logo-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-logo-green to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaTrophy className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {activeChallenge ? calculateChallengeProgress(activeChallenge).currentDay : 0}
              </div>
              <p className="text-sm font-medium text-gray-600">Challenge Days</p>
            </div>
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
                  {currentActiveGoal ? (
                    <>
                      <div className="text-center p-4 bg-mint-cream rounded-xl">
                        <div className="text-3xl font-bold text-logo-green mb-1">
                          {calculateWeightDifference(
                            currentActiveGoal.goal_weight || 0,
                            weights?.[0]?.weight || 0
                          )} lbs
                        </div>
                        <p className="text-sm text-gray-600">to reach your goal</p>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Target: {currentActiveGoal.goal_weight} lbs</span>
                        <span className="text-gray-600">{calculateDaysLeft(currentActiveGoal.goal_date)} days left</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-logo-green h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min(100, Math.max(0, ((weights?.[0]?.weight || 0) / (currentActiveGoal.goal_weight || 1)) * 100))}%` 
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
                    {currentActiveGoal ? "Manage Goals" : "Set Your First Goal"}
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

