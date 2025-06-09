"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FaArrowLeft, FaEdit, FaStop, FaPlay } from "react-icons/fa"
import Link from "next/link"
import { useRouter } from "next/navigation"
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

const CHALLENGE_TIERS = {
  Soft: { name: "Soft", icon: "🌱", color: "bg-green-100 text-green-800" },
  Medium: { name: "Medium", icon: "💪", color: "bg-yellow-100 text-yellow-800" },
  Hard: { name: "Hard", icon: "🔥", color: "bg-red-100 text-red-800" },
}

export default function ChallengeSettingsPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const supabase = createClient()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editedRules, setEditedRules] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const { data: challenge, mutate } = useSWR(
    user ? `challenge-${params.id}` : null,
    challengeFetcher
  )

  useEffect(() => {
    if (challenge) {
      setEditedRules([...challenge.rules])
    }
  }, [challenge])

  const handleSaveRules = async () => {
    if (!challenge || !user) return

    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from("challenges")
        .update({ 
          rules: editedRules,
          custom_rules: editedRules
        })
        .eq("id", challenge.id)

      if (error) throw error

      mutate()
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating rules:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeactivateChallenge = async () => {
    if (!challenge || !user) return
    
    if (!confirm("Are you sure you want to deactivate this challenge? This action cannot be undone.")) {
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from("challenges")
        .update({ is_active: false })
        .eq("id", challenge.id)

      if (error) throw error

      router.push("/challenges")
    } catch (error) {
      console.error("Error deactivating challenge:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRestartChallenge = async () => {
    if (!challenge || !user) return
    
    if (!confirm("Are you sure you want to restart this challenge? This will reset your progress and start from today.")) {
      return
    }

    setIsSubmitting(true)

    try {
      const today = new Date()
      const endDate = new Date(today)
      endDate.setDate(today.getDate() + 74)

      const { error } = await supabase
        .from("challenges")
        .update({ 
          start_date: today.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          is_active: true
        })
        .eq("id", challenge.id)

      if (error) throw error

      // Clear existing progress
      await supabase
        .from("daily_progress")
        .delete()
        .eq("challenge_id", challenge.id)

      router.push(`/challenges/${challenge.id}`)
    } catch (error) {
      console.error("Error restarting challenge:", error)
    } finally {
      setIsSubmitting(false)
    }
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
            <Button>Back to Challenges</Button>
          </Link>
        </div>
      </div>
    )
  }

  const tierInfo = CHALLENGE_TIERS[challenge.tier as keyof typeof CHALLENGE_TIERS]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/challenges/${params.id}`}>
          <Button variant="outline" size="sm" className="bg-logo-green dark:bg-snd-bkg text-black dark:text-white hover:opacity-90">
            <FaArrowLeft className="mr-2" />
            Back to Challenge
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-foreground">
            <span className="text-2xl">{tierInfo.icon}</span>
            Challenge Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            {challenge.tier} Challenge - Manage your challenge preferences
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Challenge Info */}
        <Card>
          <CardHeader>
            <CardTitle>Challenge Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Challenge Type:</span>
                <Badge className={tierInfo.color}>{challenge.tier}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge className={challenge.is_active ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"}>
                  {challenge.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Start Date:</span>
                <span className="text-sm font-medium text-foreground">{new Date(challenge.start_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">End Date:</span>
                <span className="text-sm font-medium text-foreground">{new Date(challenge.end_date).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Rules */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Challenge Rules</CardTitle>
              {!isEditing && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="bg-logo-green dark:bg-snd-bkg text-black dark:text-white hover:opacity-90"
                >
                  <FaEdit className="mr-2" />
                  Edit Rules
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Customize your challenge rules to fit your goals:
                </p>
                {editedRules.map((rule, index) => (
                  <div key={index} className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Rule {index + 1}:</label>
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => {
                        const newRules = [...editedRules]
                        newRules[index] = e.target.value
                        setEditedRules(newRules)
                      }}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:border-orange-500 focus:ring focus:ring-orange-200 dark:focus:ring-orange-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                ))}
                <div className="flex gap-4 pt-4">
                  <Button 
                    onClick={handleSaveRules}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      setEditedRules([...challenge.rules])
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <ul className="space-y-3">
                {challenge.rules.map((rule: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium text-muted-foreground mt-1">{index + 1}.</span>
                    <span className="text-sm text-foreground">{rule}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Challenge Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Challenge Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Restart Challenge</h4>
                <p className="text-sm text-muted-foreground">
                  Start over from today with the same rules. This will clear all your current progress.
                </p>
                <Button 
                  onClick={handleRestartChallenge}
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                >
                  <FaPlay className="mr-2" />
                  Restart Challenge
                </Button>
              </div>
              
              <div className="space-y-2 border-2 border-dashed border-red-500 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground">Deactivate Challenge</h4>
                <p className="text-sm text-muted-foreground">
                  Stop the current challenge. You can view your progress but won't be able to add new entries.
                </p>
                <Button 
                  onClick={handleDeactivateChallenge}
                  disabled={isSubmitting}
                  variant="destructive"
                  className="w-full"
                >
                  <FaStop className="mr-2" />
                  Deactivate Challenge
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 