"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { challengeService } from "@/app/services/ChallengeService"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FaArrowLeft, FaEdit, FaStop, FaPlay, FaTrash } from "react-icons/fa"
import Link from "next/link"
import { useRouter } from "next/navigation"
import useSWR from "swr"

interface Challenge {
  id: string
  user_id: string
  name: string
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
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedRules, setEditedRules] = useState<string[]>([])
  const [editedName, setEditedName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const challengeFetcher = async () => {
    if (!user) return null
    return await challengeService.getChallengeById(params.id, user.id)
  }

  const { data: challenge, mutate } = useSWR(
    user ? `challenge-${params.id}` : null,
    challengeFetcher
  )

  useEffect(() => {
    if (challenge) {
      setEditedRules([...challenge.rules])
      setEditedName(challenge.name)
    }
  }, [challenge])

  const handleSaveName = async () => {
    if (!challenge || !user) return

    if (!editedName.trim()) {
      alert("Please enter a challenge name.")
      return
    }

    setIsSubmitting(true)

    try {
      await challengeService.updateChallengeName(challenge.id as string, editedName.trim())
      mutate()
      setIsEditingName(false)
    } catch (error) {
      console.error("Error updating challenge name:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteRule = (index: number) => {
    if (editedRules.length <= 1) {
      alert("You must have at least one rule. Add a new rule before deleting this one.")
      return
    }

    if (!confirm("Are you sure you want to delete this rule?")) {
      return
    }

    const newRules = editedRules.filter((_, i) => i !== index)
    setEditedRules(newRules)
  }

  const handleAddRule = () => {
    setEditedRules([...editedRules, ""])
  }

  const handleSaveRules = async () => {
    if (!challenge || !user) return

    // Filter out empty rules before saving
    const filteredRules = editedRules.filter(rule => rule && rule.trim().length > 0)
    
    if (filteredRules.length === 0) {
      alert("Please add at least one rule before saving.")
      return
    }

    setIsSubmitting(true)

    try {
      await challengeService.updateChallengeRules(challenge.id as string, filteredRules, filteredRules)
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
      await challengeService.deactivateChallenge(challenge.id as string)
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

      const startDateStr = today.toISOString().split('T')[0]
      const endDateStr = endDate.toISOString().split('T')[0]

      await challengeService.restartChallenge(challenge.id as string, startDateStr, endDateStr)
      await challengeService.clearDailyProgress(challenge.id as string)

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
            {challenge.name} - Manage your challenge preferences
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Challenge Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Challenge Information</CardTitle>
              {!isEditingName && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditingName(true)}
                  className="bg-logo-green dark:bg-snd-bkg text-black dark:text-white hover:opacity-90"
                >
                  <FaEdit className="mr-2" />
                  Edit Name
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditingName ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Challenge Name:</label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:border-logo-green focus:ring focus:ring-logo-green dark:focus:ring-logo-green bg-white dark:bg-white text-gray-900 dark:text-bkack  mt-2"
                    placeholder="Enter challenge name"
                  />
                </div>
                <div className="flex gap-4">
                  <Button 
                    onClick={handleSaveName}
                    disabled={isSubmitting}
                    className="bg-logo-green dark:bg-snd-bkg text-black dark:text-white hover:opacity-90"
                  >
                    {isSubmitting ? "Saving..." : "Save Name"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsEditingName(false)
                      setEditedName(challenge.name)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Challenge Name:</span>
                  <span className="text-sm font-medium text-foreground">{challenge.name}</span>
                </div>
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
                    <span className="text-sm font-medium text-foreground">{new Date(challenge.start_date + 'T00:00:00').toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">End Date:</span>
                    <span className="text-sm font-medium text-foreground">{new Date(challenge.end_date + 'T00:00:00').toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}
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
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Customize your challenge rules to fit your goals:
                  </p>
                  <Button 
                    onClick={handleAddRule}
                    variant="outline"
                    size="sm"
                    className="bg-logo-green dark:bg-snd-bkg text-black dark:text-white hover:opacity-90"
                  >
                    + Add Rule
                  </Button>
                </div>
                {editedRules.map((rule, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">Rule {index + 1}:</label>
                      {editedRules.length > 1 && (
                        <Button
                          onClick={() => handleDeleteRule(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <FaTrash className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => {
                        const newRules = [...editedRules]
                        newRules[index] = e.target.value
                        setEditedRules(newRules)
                      }}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:border-logo-green focus:ring focus:ring-logo-green dark:focus:ring-logo-green bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="Enter rule description"
                    />
                  </div>
                ))}
                <div className="flex gap-4 pt-4">
                  <Button 
                    onClick={handleSaveRules}
                    disabled={isSubmitting}
                    className="bg-logo-green dark:bg-snd-bkg text-black dark:text-white hover:opacity-90"
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
                {challenge.rules
                  .filter((rule: string) => rule && rule.trim().length > 0)
                  .map((rule: string, index: number) => (
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