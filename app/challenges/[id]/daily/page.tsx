"use client"

import { useState, useEffect } from "react"
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
import confetti from "canvas-confetti"
import { challengeService, Challenge, DailyProgress } from "@/app/services/ChallengeService"

const CHALLENGE_TIERS = {
  Soft: { name: "Soft", icon: "🌱", color: "bg-green-100 text-green-800" },
  Medium: { name: "Medium", icon: "💪", color: "bg-yellow-100 text-yellow-800" },
  Hard: { name: "Hard", icon: "🔥", color: "bg-red-100 text-red-800" },
}

export default function DailyChecklistPage({ 
  params, 
  searchParams 
}: { 
  params: { id: string }
  searchParams: { date?: string }
}) {
  const { user } = useAuth()
  const router = useRouter()
  const [completedRules, setCompletedRules] = useState<number[]>([])
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDate, setSelectedDate] = useState(() => {
    // Use date from URL if provided, otherwise default to today
    return searchParams?.date || new Date().toISOString().split('T')[0]
  })
  const [showDatePicker, setShowDatePicker] = useState(false)
  // const [progressPhoto, setProgressPhoto] = useState<File | null>(null)
  // const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  const challengeFetcher = async () => {
    if (!user) return null
    return await challengeService.getChallengeById(params.id, user.id)
  }

  const progressFetcher = async () => {
    if (!user) return null
    return await challengeService.getDailyProgress(params.id, selectedDate)
  }

  const { data: challenge } = useSWR(
    user ? `challenge-${params.id}` : null,
    challengeFetcher
  )

  const { data: selectedDateProgress, mutate: mutateProgress } = useSWR(
    user ? `progress-${params.id}-${selectedDate}` : null,
    progressFetcher
  )

  // Get today's progress for alerts
  const todayProgressFetcher = async () => {
    if (!user) return null
    return await challengeService.getDailyProgress(params.id, today)
  }

  const { data: todayProgress } = useSWR(
    user ? `progress-${params.id}-${today}` : null,
    todayProgressFetcher
  )

  // Get yesterday's progress for alerts
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayDate = yesterday.toISOString().split('T')[0]

  const yesterdayProgressFetcher = async () => {
    if (!user) return null
    return await challengeService.getDailyProgress(params.id, yesterdayDate)
  }

  const { data: yesterdayProgress } = useSWR(
    user ? `progress-${params.id}-${yesterdayDate}` : null,
    yesterdayProgressFetcher
  )

  // Update selected date when URL parameter changes
  useEffect(() => {
    if (searchParams?.date) {
      setSelectedDate(searchParams.date)
    }
  }, [searchParams?.date])

  useEffect(() => {
    if (selectedDateProgress) {
      setCompletedRules(selectedDateProgress.completed_rules || [])
      setNotes(selectedDateProgress.notes || "")
    } else {
      setCompletedRules([])
      setNotes("")
    }
  }, [selectedDateProgress, selectedDate])

  // Trigger confetti when all rules are completed
  useEffect(() => {
    if (challenge && completedRules.length === challenge.rules.filter((rule: string) => rule && rule.trim().length > 0).length && completedRules.length > 0) {
      // Only trigger confetti if this is a new completion (not loading existing data)
      if (!selectedDateProgress || selectedDateProgress.completed_rules.length < challenge.rules.filter((rule: string) => rule && rule.trim().length > 0).length) {
        triggerConfetti()
      }
    }
  }, [completedRules, challenge, selectedDateProgress])

  const calculateProgress = (challenge: Challenge, targetDate: string = selectedDate) => {
    const startDate = new Date(challenge.start_date + 'T00:00:00')
    const target = new Date(targetDate + 'T00:00:00')
    
    const daysPassed = Math.ceil((target.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    
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

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate)
    // Force refresh of the selected date's data
    mutateProgress()
  }

  const triggerConfetti = () => {
    // Create a burst of confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff6b35', '#f7931e', '#ffd23f', '#06ffa5', '#3b82f6', '#8b5cf6']
    })
    
    // Add a second burst after a short delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ff6b35', '#f7931e', '#ffd23f', '#06ffa5', '#3b82f6', '#8b5cf6']
      })
    }, 200)
  }

  // const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if (file) {
  //     setProgressPhoto(file)
  //     const reader = new FileReader()
  //     reader.onload = (e) => {
  //       setPhotoPreview(e.target?.result as string)
  //     }
  //     reader.readAsDataURL(file)
  //   }
  // }

  // const uploadProgressPhoto = async (file: File): Promise<string | null> => {
  //   const fileName = `progress-pics/${user?.id}/${params.id}/${today}-${Date.now()}.jpg`
    
  //   const { data, error } = await supabase.storage
  //     .from("habit-kick")
  //     .upload(fileName, file)

  //   if (error) {
  //     console.error("Error uploading photo:", error)
  //     return null
  //   }

  //   const { data: { publicUrl } } = supabase.storage
  //     .from("habit-kick")
  //     .getPublicUrl(fileName)

  //   return publicUrl
  // }

  const handleSubmit = async () => {
    if (!challenge || !user) return

    setIsSubmitting(true)

    try {
      const progressData = {
        challenge_id: params.id,
        date: selectedDate,
        completed_rules: completedRules,
        is_complete: completedRules.length === challenge.rules.filter((rule: string) => rule && rule.trim().length > 0).length,
        notes: notes.trim() || null,
        // progress_photo_url: photoUrl, // Commented out photo functionality
        user_id: user.id
      }

      await challengeService.saveDailyProgress(
        progressData,
        selectedDateProgress?.id
      )

      // Mutate progress to refresh cache (fire and forget)
      // Wrap in try-catch to handle both sync and async errors
      try {
        const mutatePromise = mutateProgress()
        if (mutatePromise && typeof mutatePromise.catch === 'function') {
          mutatePromise.catch((error) => {
            // Ignore mutate errors - cache update is optional
            console.warn("Failed to mutate progress cache:", error)
          })
        }
      } catch (error) {
        // Handle synchronous errors (e.g., in test environments)
        console.warn("Failed to mutate progress cache:", error)
      }
      
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

  const progress = challenge ? calculateProgress(challenge, selectedDate) : { currentDay: 1, totalDays: 75 }
  const completionPercentage = (completedRules.length / challenge.rules.filter((rule: string) => rule && rule.trim().length > 0).length) * 100
  const tierInfo = CHALLENGE_TIERS[challenge.tier as keyof typeof CHALLENGE_TIERS]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/challenges/${params.id}`}>
          <Button size="sm" className="bg-logo-green dark:bg-snd-bkg text-black dark:text-white hover:opacity-90">
            <FaArrowLeft className="mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
            <span className="text-2xl">{tierInfo.icon}</span>
            Day {progress.currentDay} Checklist
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-600 dark:text-gray-300" data-testid="challenge-name">
              {challenge.name} - {new Date(selectedDate + 'T00:00:00').toLocaleDateString()}
            </p>
            {selectedDate !== today && (
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                {searchParams?.date ? 'Viewing Specific Day' : 'Editing Past Day'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {!yesterdayProgress && selectedDate === today && (
        <div className="mb-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-red-800 font-medium">You missed logging yesterday!</p>
            </div>
            <p className="text-red-600 text-sm mt-1">Click "Edit Different Day" below to catch up on yesterday's progress.</p>
          </div>
        </div>
      )}

      {todayProgress && todayProgress.completed_rules.length < challenge.rules.filter((rule: string) => rule && rule.trim().length > 0).length && (
        <div className="mb-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-yellow-800 font-medium">Incomplete rules for today!</p>
            </div>
            <p className="text-yellow-600 text-sm mt-1">
              You've completed {todayProgress.completed_rules.length} out of {challenge.rules.length} rules today.
            </p>
          </div>
        </div>
      )}

      {completedRules.length === challenge.rules.filter((rule: string) => rule && rule.trim().length > 0).length && challenge.rules.filter((rule: string) => rule && rule.trim().length > 0).length > 0 && (
        <div className="mb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-800 font-medium">🎉 Perfect Day Complete! 🎉</p>
            </div>
            <p className="text-green-600 text-sm mt-1">
              Congratulations! You've completed all {challenge.rules.filter((rule: string) => rule && rule.trim().length > 0).length} rules for this day. Keep up the amazing work!
            </p>
          </div>
        </div>
      )}

      {/* Date Picker Button */}
      <div className="mb-6">
        <Button
          onClick={() => setShowDatePicker(!showDatePicker)}
          variant="outline"
          className="w-full justify-between bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
        >
          <div className="flex items-center gap-2">
            Edit Different Day
          </div>
          <svg className={`w-4 h-4 transition-transform ${showDatePicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>

        {showDatePicker && (
          <Card className="mt-4 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-orange-800">
                Select Date to Edit
              </CardTitle>
              <p className="text-orange-600 text-sm">Choose any day from your challenge start date to edit</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex-1">
                  <label htmlFor="date-picker" className="block text-sm font-semibold text-orange-800 mb-3">
                    Select Date
                  </label>
                  <input
                    id="date-picker"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    max={today}
                    min={challenge.start_date}
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white text-gray-800 font-medium shadow-sm transition-all duration-200 hover:border-orange-300"
                  />
                </div>
                <div className="flex-1 bg-white/60 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-sm text-orange-700">
                      <p className="font-medium mb-1">Edit Any Day</p>
                      <p className="text-orange-600">You can edit any day from your challenge start date to catch up on missed logging.</p>
                      <p className="text-orange-500 text-xs mt-2">
                        Challenge: {new Date(challenge.start_date + 'T00:00:00').toLocaleDateString()} - {new Date(challenge.end_date + 'T00:00:00').toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Checklist */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Today's Tasks</span>
                <div className="text-sm text-gray-600">
                  {completedRules.length} of {challenge.rules.filter((rule: string) => rule && rule.trim().length > 0).length} completed
                </div>
              </CardTitle>
              <Progress value={completionPercentage} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {challenge.rules
                .filter((rule: string) => rule && rule.trim().length > 0)
                .map((rule: string, index: number) => (
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
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IoMdCamera />
                Progress Photo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(photoPreview || selectedDateProgress?.progress_photo_url) && (
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={photoPreview || selectedDateProgress?.progress_photo_url}
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
          </Card> */}

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
                  className="w-full bg-logo-green dark:bg-snd-bkg text-black dark:text-white hover:opacity-90"
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