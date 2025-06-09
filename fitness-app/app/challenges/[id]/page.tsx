"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FaFire, FaCalendarAlt, FaCheckCircle, FaArrowLeft, FaTimes } from "react-icons/fa"
import { IoMdCamera, IoMdSettings } from "react-icons/io"
import Link from "next/link"
import useSWR from "swr"

interface Challenge {
  id: string
  user_id: string
  tier: "Soft" | "Medium" | "Hard"
  start_date: string
  end_date: string
  rules: string[]
  is_active: boolean
  created_at: string
  custom_rules?: string[]
}

interface DailyProgress {
  id: string
  challenge_id: string
  date: string
  completed_rules: number[]
  is_complete: boolean
  notes?: string
  progress_photo_url?: string
}

const CHALLENGE_TIERS = {
  Soft: { name: "Soft", icon: "🌱", color: "bg-green-100 text-green-800" },
  Medium: { name: "Medium", icon: "💪", color: "bg-yellow-100 text-yellow-800" },
  Hard: { name: "Hard", icon: "🔥", color: "bg-red-100 text-red-800" },
}

export default function ChallengeDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const supabase = createClient()

  const challengeFetcher = async () => {
    if (!user) return null
    
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (error) throw error
    return data
  }

  const progressFetcher = async () => {
    if (!user) return null
    
    const { data, error } = await supabase
      .from("daily_progress")
      .select("*")
      .eq("challenge_id", params.id)
      .order("date", { ascending: true })

    if (error) throw error
    return data
  }

  const { data: challenge } = useSWR(
    user ? `challenge-${params.id}` : null,
    challengeFetcher
  )

  const { data: progressHistory } = useSWR(
    user ? `progress-history-${params.id}` : null,
    progressFetcher
  )

  const calculateProgress = (challenge: Challenge) => {
    const startDate = new Date(challenge.start_date)
    const endDate = new Date(challenge.end_date)
    const today = new Date()
    
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const daysPassed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    
    return {
      currentDay: Math.max(1, Math.min(daysPassed, totalDays)),
      totalDays,
      percentage: Math.min(100, Math.max(0, (daysPassed / totalDays) * 100)),
      daysRemaining: Math.max(0, totalDays - daysPassed)
    }
  }

  const generateCalendarDays = (challenge: Challenge) => {
    const startDate = new Date(challenge.start_date)
    const days = []
    
    for (let i = 0; i < 75; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      const dateString = currentDate.toISOString().split('T')[0]
      
      const dayProgress = progressHistory?.find((p: DailyProgress) => p.date === dateString)
      
      days.push({
        day: i + 1,
        date: dateString,
        isComplete: dayProgress?.is_complete || false,
        completedRules: dayProgress?.completed_rules?.length || 0,
        totalRules: challenge.rules.length,
        hasNotes: !!dayProgress?.notes,
        hasPhoto: !!dayProgress?.progress_photo_url,
        isPast: currentDate < new Date(),
        isToday: dateString === new Date().toISOString().split('T')[0]
      })
    }
    
    return days
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to access challenges</h2>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Challenge not found</h2>
          <Link href="/challenges">
            <Button className="bg-background text-white hover:opacity-90">Back to Challenges</Button>
          </Link>
        </div>
      </div>
    )
  }

  const progress = calculateProgress(challenge)
  const tierInfo = CHALLENGE_TIERS[challenge.tier as keyof typeof CHALLENGE_TIERS]
  const calendarDays = generateCalendarDays(challenge)
  const completedDays = progressHistory?.filter((p: DailyProgress) => p.is_complete).length || 0
  const totalCompletionRate = progressHistory?.length ? (completedDays / progressHistory.length) * 100 : 0

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col gap-4 mb-8 sm:hidden">
        <div className="flex items-center justify-between">
          <Link href="/challenges">
            <Button className="bg-background text-white hover:opacity-90">
              <FaArrowLeft className="mr-2" />
              Back
            </Button>
          </Link>
          <Link href={`/challenges/${challenge.id}/settings`}>
            <Button className="bg-background text-white hover:opacity-90">
              <IoMdSettings className="mr-2" />
              Settings
            </Button>
          </Link>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <span className="text-xl">{tierInfo.icon}</span>
            {challenge.tier} Challenge
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            {new Date(challenge.start_date).toLocaleDateString()} - {new Date(challenge.end_date).toLocaleDateString()}
          </p>
        </div>
        {challenge.is_active && (
          <div className="flex justify-center">
            <Link href={`/challenges/${challenge.id}/daily`}>
              <Button className="bg-green-600 hover:bg-green-700 w-full max-w-xs">
                <FaCheckCircle className="mr-2" />
                Today's Tasks
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Desktop Header - Horizontal Layout */}
      <div className="hidden sm:flex items-center gap-4 mb-8">
        <Link href="/challenges">
          <Button className="bg-background text-white hover:opacity-90">
            <FaArrowLeft className="mr-2" />
            Back to Challenges
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="text-2xl">{tierInfo.icon}</span>
            {challenge.tier} Challenge
          </h1>
          <p className="text-gray-600 mt-1">
            {new Date(challenge.start_date).toLocaleDateString()} - {new Date(challenge.end_date).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          {challenge.is_active && (
            <Link href={`/challenges/${challenge.id}/daily`}>
              <Button className="bg-green-600 hover:bg-green-700">
                <FaCheckCircle className="mr-2" />
                Today's Tasks
              </Button>
            </Link>
          )}
          <Link href={`/challenges/${challenge.id}/settings`}>
            <Button className="bg-background text-white hover:opacity-90">
              <IoMdSettings className="mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Current Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Day {progress.currentDay}</div>
            <p className="text-xs text-gray-600">of {progress.totalDays} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Days Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.daysRemaining}</div>
            <p className="text-xs text-gray-600">days left</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Perfect Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedDays}</div>
            <p className="text-xs text-gray-600">100% completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalCompletionRate)}%</div>
            <p className="text-xs text-gray-600">overall completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="mb-8">
        <CardHeader>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-orange-600">Overall Progress</h3>
                <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-lg font-bold">
                  {Math.round(progress.percentage)}%
                </div>
              </div>
              <Progress value={progress.percentage} className="h-4" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Challenge Rules:</h4>
                <ul className="space-y-2">
                  {challenge.rules.map((rule: string, index: number) => {
                    // Get today's progress to check if this rule is completed
                    const today = new Date().toISOString().split('T')[0]
                    const todayProgress = progressHistory?.find((p: DailyProgress) => p.date === today)
                    const isRuleCompleted = todayProgress?.completed_rules?.includes(index) || false
                    
                    return (
                      <li key={index} className="text-sm flex items-center gap-2">
                        {isRuleCompleted ? (
                          <FaCheckCircle className="text-green-500 text-xs" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border-2 border-gray-400 text-xs"></div>
                        )}
                        {rule}
                      </li>
                    )
                  })}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Challenge Status:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge className={challenge.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {challenge.is_active ? "Active" : "Completed"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tier:</span>
                    <Badge className={tierInfo.color}>{challenge.tier}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Start Date:</span>
                    <span className="text-sm font-medium">{new Date(challenge.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">End Date:</span>
                    <span className="text-sm font-medium">{new Date(challenge.end_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle>75-Day Progress Grid</CardTitle>
          <p className="text-sm text-gray-600">Track your daily progress</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-x-0.5 gap-y-1 mb-6 justify-items-center">
            {calendarDays.map((day) => (
              <div
                key={day.day}
                className={`
                  w-8 h-8 sm:w-10 sm:h-10 rounded border text-center text-xs font-medium flex items-center justify-center
                  ${day.isToday ? 'ring-2 ring-orange-500' : ''}
                  ${day.isComplete ? 'bg-green-100 border-green-300 text-green-800' : 
                    day.completedRules > 0 ? 'bg-yellow-100 border-yellow-300 text-yellow-800' :
                    day.isPast ? 'bg-red-50 border-red-200 text-red-600' : 
                    'bg-gray-50 border-gray-200 text-gray-500'}
                `}
              >
                <div className="font-semibold">{day.day}</div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>Perfect Day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
              <span>Partial Completion</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
              <span>Missed Day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
              <span>Future Day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-orange-500 rounded"></div>
              <span>Today</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 