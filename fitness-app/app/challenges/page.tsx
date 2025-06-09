"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge, Tag } from "antd"
import { Progress } from "@/components/ui/progress"
import { FaFire, FaCalendarAlt, FaCheckCircle, FaPlus } from "react-icons/fa"
import { IoMdSettings } from "react-icons/io"
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
}

const CHALLENGE_TIERS = {
  Soft: {
    name: "Soft",
    icon: "🌱",
    badgeVariant: "green",
    rules: [
      "1x 30-minute workout",
      "Drink 1/2 gallon of water",
      "Read 5 pages of a book",
      "Take a progress photo",
      "Eat 3 healthy meals (no junk food)",
    ],
  },
  Medium: {
    name: "Medium",
    icon: "💪",
    badgeVariant: "orange",
    rules: [
      "2x 30-minute workouts (1 must be outdoors)",
      "Drink 3/4 gallon of water",
      "Read 7 pages of nonfiction",
      "Take a progress photo",
      "Follow a clean diet",
      "No alcohol or cheat meals",
    ],
  },
  Hard: {
    name: "Hard",
    icon: "🔥",
    badgeVariant: "red",
    rules: [
      "2x 45-minute workouts (1 outdoors, rain or shine)",
      "Drink 1 gallon of water",
      "Read 10 pages of nonfiction",
      "Take a progress photo",
      "Strict diet adherence",
      "No alcohol, no cheat meals",
      "No skipping or modifying rules",
    ],
  },
}

export default function ChallengesPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const challengeFetcher = async () => {
    if (!user) return null
    
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  const { data: challenges, mutate } = useSWR(
    user ? `challenges-${user.id}` : null,
    challengeFetcher
  )

  const activeChallenge = challenges?.find((c: Challenge) => c.is_active)

  const calculateProgress = (challenge: Challenge) => {
    const startDate = new Date(challenge.start_date)
    const endDate = new Date(challenge.end_date)
    const today = new Date()
    
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const daysPassed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    return {
      currentDay: Math.max(1, Math.min(daysPassed, totalDays)),
      totalDays,
      percentage: Math.min(100, Math.max(0, (daysPassed / totalDays) * 100))
    }
  }

  const handleCreateChallenge = async (tier: keyof typeof CHALLENGE_TIERS, startDate: string, customRules?: string[]) => {
    if (!user) return

    const start = new Date(startDate)
    const end = new Date(start)
    end.setDate(start.getDate() + 74)

    const rules = customRules || CHALLENGE_TIERS[tier].rules

    const { data, error } = await supabase
      .from("challenges")
      .insert({
        user_id: user.id,
        tier,
        start_date: start.toISOString().split('T')[0],
        end_date: end.toISOString().split('T')[0],
        rules,
        is_active: true,
        custom_rules: customRules ? customRules : null
      })
      .select()

    if (error) {
      console.error("Error creating challenge:", error)
      return
    }

    // Deactivate any other active challenges
    if (activeChallenge) {
      await supabase
        .from("challenges")
        .update({ is_active: false })
        .eq("id", activeChallenge.id)
    }

    mutate()
    setShowCreateForm(false)
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center justify-center sm:justify-start gap-3">
            <FaFire className="text-orange-500" />
            75 Day Challenge
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Transform your habits over 75 consecutive days
          </p>
        </div>
        <div className="flex justify-center sm:justify-end">
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
          >
            <FaPlus className="mr-2" />
            Create New Challenge
          </Button>
        </div>
      </div>

      {/* Active Challenge */}
      {activeChallenge && (
        <Card className="mb-8 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <span className="text-2xl">{CHALLENGE_TIERS[activeChallenge.tier as keyof typeof CHALLENGE_TIERS].icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900">Current Challenge</span>
                    <Tag color={CHALLENGE_TIERS[activeChallenge.tier as keyof typeof CHALLENGE_TIERS].badgeVariant} style={{ margin: 0, marginTop: '2px', display: 'inline-flex', alignItems: 'center' }}>{activeChallenge.tier}</Tag>
                  </div>
                  <div className="text-sm text-gray-600 font-normal">
                    {new Date(activeChallenge.start_date).toLocaleDateString()} - {new Date(activeChallenge.end_date).toLocaleDateString()}
                  </div>
                </div>
              </CardTitle>
              <Link href={`/challenges/${activeChallenge.id}/settings`}>
                <Button variant="outline" size="sm" className="bg-background text-white hover:opacity-90">
                <IoMdSettings className="mr-2" />
                  Edit
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {(() => {
              const progress = calculateProgress(activeChallenge)
              return (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Day {progress.currentDay} of {progress.totalDays}
                      </span>
                      <span className="text-sm text-gray-600">
                        {Math.round(progress.percentage)}% Complete
                      </span>
                    </div>
                    <Progress value={progress.percentage} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-900">Today's Rules:</h4>
                      <ul className="space-y-1">
                        {activeChallenge.rules.map((rule: string, index: number) => (
                          <li key={index} className="text-sm flex items-center gap-2 text-gray-700">
                            <FaCheckCircle className="text-green-500 text-xs" />
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link href={`/challenges/${activeChallenge.id}/daily`}>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          <FaCheckCircle className="mr-2" />
                          Complete Today's Tasks
                        </Button>
                      </Link>
                      <Link href={`/challenges/${activeChallenge.id}`}>
                        <Button className="w-full bg-background text-white hover:opacity-90">
                          <FaCalendarAlt className="mr-2" />
                          View Progress
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      {/* Challenge Tiers Overview */}
      {!activeChallenge && !showCreateForm && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(CHALLENGE_TIERS).map(([key, tier]) => (
            <Card key={key} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">{tier.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{tier.name}</span>
                      <Badge.Ribbon text={tier.name} color={tier.badgeVariant} />
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {tier.rules.map((rule: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <FaCheckCircle className="text-green-500 text-xs mt-1 flex-shrink-0" />
                      {rule}
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="w-full"
                  variant={key === "Hard" ? "default" : "outline"}
                >
                  Choose {tier.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Challenge Form */}
      {showCreateForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Start Your 75 Day Challenge</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateChallengeForm 
              onSubmit={handleCreateChallenge}
              onCancel={() => setShowCreateForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Challenge History */}
      {challenges && challenges.length > 0 && (
        <Card>
          <CardHeader 
            className="cursor-pointer transition-colors"
            onClick={() => setShowHistory(!showHistory)}
          >
            <CardTitle className="text-black dark:text-white flex items-center justify-between">
              <span>Challenge History</span>
              <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${showHistory ? 'bg-orange-500' : 'bg-gray-400'} relative`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ${showHistory ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
              </div>
            </CardTitle>
          </CardHeader>
          {showHistory && (
            <CardContent>
              <div className="space-y-4">
                {challenges.map((challenge: Challenge) => {
                  const progress = calculateProgress(challenge)
                  const tierInfo = CHALLENGE_TIERS[challenge.tier as keyof typeof CHALLENGE_TIERS]
                  return (
                    <div key={challenge.id} className="relative flex flex-col sm:flex-row sm:items-start justify-between p-4 border rounded-lg gap-3">
                      <div className="flex items-start gap-4">
                        <span className="text-xl">{tierInfo.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-black dark:text-white flex flex-col sm:flex-row sm:items-center gap-2">
                            <span>{challenge.tier} Challenge</span>
                            <Tag color={tierInfo.badgeVariant} style={{ margin: 0, marginTop: '2px', display: 'inline-flex', alignItems: 'center', alignSelf: 'flex-start' }}>{challenge.tier}</Tag>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {new Date(challenge.start_date).toLocaleDateString()} - {new Date(challenge.end_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center gap-2">
                        <Badge status={challenge.is_active ? "processing" : "error"} />
                        <Link href={`/challenges/${challenge.id}`}>
                          <Button variant="outline" size="sm" className="bg-background text-white hover:opacity-90">View</Button>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}

// Create Challenge Form Component
function CreateChallengeForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (tier: keyof typeof CHALLENGE_TIERS, startDate: string, customRules?: string[]) => void
  onCancel: () => void 
}) {
  const [selectedTier, setSelectedTier] = useState<keyof typeof CHALLENGE_TIERS>("Medium")
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [customRules, setCustomRules] = useState<string[]>([])
  const [useCustomRules, setUseCustomRules] = useState(false)
  const [expandedTiers, setExpandedTiers] = useState<Set<string>>(new Set())

  const toggleTierExpansion = (tierKey: string) => {
    const newExpanded = new Set(expandedTiers)
    if (newExpanded.has(tierKey)) {
      newExpanded.delete(tierKey)
    } else {
      newExpanded.add(tierKey)
    }
    setExpandedTiers(newExpanded)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(selectedTier, startDate, useCustomRules ? customRules : undefined)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-3">Choose Your Challenge Level</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(CHALLENGE_TIERS).map(([key, tier]) => {
            const isExpanded = expandedTiers.has(key)
            const rulesToShow = isExpanded ? tier.rules : tier.rules.slice(0, 3)
            const hasMoreRules = tier.rules.length > 3
            
            return (
              <div
                key={key}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedTier === key ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTier(key as keyof typeof CHALLENGE_TIERS)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{tier.icon}</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${selectedTier === key ? 'text-black' : 'text-gray-700'}`}>{tier.name}</span>
                    <Badge.Ribbon text={tier.name} color={tier.badgeVariant} />
                  </div>
                </div>
                <ul className="text-sm space-y-1">
                  {rulesToShow.map((rule: string, index: number) => (
                    <li key={index} className={`${selectedTier === key ? 'text-gray-700' : 'text-gray-600'}`}>• {rule}</li>
                  ))}
                  {hasMoreRules && (
                    <li 
                      className={`cursor-pointer hover:underline ${selectedTier === key ? 'text-gray-600' : 'text-gray-500'}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleTierExpansion(key)
                      }}
                    >
                      {isExpanded ? '- Show less' : `+ ${tier.rules.length - 3} more...`}
                    </li>
                  )}
                </ul>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full p-3 border border-gray-300 rounded-md focus:border-orange-500 focus:ring focus:ring-orange-200 text-black bg-white"
          required
        />
        <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">Challenge End Date:</p>
            <p className="text-2xl font-bold text-orange-600">
              {new Date(new Date(startDate).getTime() + 74 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={useCustomRules}
            onChange={(e) => setUseCustomRules(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm font-medium">Customize Rules (Optional)</span>
        </label>
        
        {useCustomRules && (
          <div className="space-y-2">
            {CHALLENGE_TIERS[selectedTier].rules.map((rule, index) => (
              <input
                key={index}
                type="text"
                value={customRules[index] || rule}
                onChange={(e) => {
                  const newRules = [...customRules]
                  newRules[index] = e.target.value
                  setCustomRules(newRules)
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring focus:ring-orange-200 text-black bg-white placeholder-gray-500"
                placeholder={rule}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600">
          Start Challenge
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  )
} 