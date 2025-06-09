"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { FaFire, FaCalendarAlt, FaCheckCircle, FaArrowLeft } from "react-icons/fa"
import { IoMdCamera } from "react-icons/io"
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

export default function DailyChecklistPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const supabase = createClient()
  const router = useRouter()
  const [completedRules, setCompletedRules] = useState<number[]>([])
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progressPhoto, setProgressPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

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
      .eq("date", today)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  const { data: challenge } = useSWR(
    user ? `challenge-${params.id}` : null,
    challengeFetcher
  )

  const { data: todayProgress, mutate: mutateProgress } = useSWR(
    user ? `progress-${params.id}-${today}` : null,
    progressFetcher
  )

  useEffect(() => {
    if (todayProgress) {
      setCompletedRules(todayProgress.completed_rules || [])
      setNotes(todayProgress.notes || "")
    }
  }, [todayProgress])

  const calculateProgress = (challenge: Challenge) => {
    const startDate = new Date(challenge.start_date)
    const today = new Date()
    
    const daysPassed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    return {
      currentDay: Math.max(1, Math.min(daysPassed, 75)),
      totalDays: 75
    }
  }

  const handleRuleToggle = (ruleIndex: number) => {
    setCompletedRules(prev => 
      prev.includes(ruleIndex) 
        ? prev.filter(i => i !== ruleIndex)
        : [...prev, ruleIndex]
    )
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProgressPhoto(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadProgressPhoto = async (file: File): Promise<string | null> => {
    const fileName = `progress-pics/${user?.id}/${params.id}/${today}-${Date.now()}.jpg`
    
    const { data, error } = await supabase.storage
      .from("habit-kick")
      .upload(fileName, file)

    if (error) {
      console.error("Error uploading photo:", error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from("habit-kick")
      .getPublicUrl(fileName)

    return publicUrl
  }

  const handleSubmit = async () => {
    if (!challenge || !user) return

    setIsSubmitting(true)

    try {
      let photoUrl = todayProgress?.progress_photo_url

      // Upload progress photo if provided
      if (progressPhoto) {
        photoUrl = await uploadProgressPhoto(progressPhoto)
      }

      const progressData = {
        challenge_id: params.id,
        date: today,
        completed_rules: completedRules,
        is_complete: completedRules.length === challenge.rules.length,
        notes: notes.trim() || null,
        progress_photo_url: photoUrl,
        user_id: user.id
      }

      if (todayProgress) {
        // Update existing progress
        const { error } = await supabase
          .from("daily_progress")
          .update(progressData)
          .eq("id", todayProgress.id)
      } else {
        // Create new progress entry
        const { error } = await supabase
          .from("daily_progress")
          .insert(progressData)
      }

      mutateProgress()
      router.push(`/challenges/${params.id}`)
    } catch (error) {
      console.error("Error saving progress:", error)
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

  const progress = calculateProgress(challenge)
  const completionPercentage = (completedRules.length / challenge.rules.length) * 100
  const tierInfo = CHALLENGE_TIERS[challenge.tier as keyof typeof CHALLENGE_TIERS]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/challenges/${params.id}`}>
          <Button variant="outline" size="sm">
            <FaArrowLeft className="mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="text-2xl">{tierInfo.icon}</span>
            Day {progress.currentDay} Checklist
          </h1>
          <p className="text-gray-600 mt-1">
            {challenge.tier} Challenge - {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Checklist */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Today's Tasks</span>
                <div className="text-sm text-gray-600">
                  {completedRules.length} of {challenge.rules.length} completed
                </div>
              </CardTitle>
              <Progress value={completionPercentage} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {challenge.rules.map((rule, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Checkbox
                    checked={completedRules.includes(index)}
                    onCheckedChange={() => handleRuleToggle(index)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label 
                      className={`text-sm font-medium cursor-pointer ${
                        completedRules.includes(index) ? 'line-through text-gray-500' : ''
                      }`}
                      onClick={() => handleRuleToggle(index)}
                    >
                      {rule}
                    </label>
                  </div>
                  {completedRules.includes(index) && (
                    <FaCheckCircle className="text-green-500 mt-1" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Daily Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did today go? Any challenges or wins to note?"
                className="w-full p-3 border border-gray-300 rounded-md focus:border-orange-500 focus:ring focus:ring-orange-200 resize-none text-black bg-white placeholder-gray-500"
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Progress Photo & Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IoMdCamera />
                Progress Photo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(photoPreview || todayProgress?.progress_photo_url) && (
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={photoPreview || todayProgress?.progress_photo_url}
                      alt="Progress photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-black bg-white"
                />
                <p className="text-xs text-gray-600">
                  Upload a daily progress photo to track your transformation
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Challenge Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Current Day:</span>
                <span className="font-semibold">Day {progress.currentDay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed Today:</span>
                <span className="font-semibold">{completedRules.length}/{challenge.rules.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Challenge Level:</span>
                <span className="font-semibold">{challenge.tier}</span>
              </div>
              <div className="pt-4">
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "Saving..." : "Save Progress"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 