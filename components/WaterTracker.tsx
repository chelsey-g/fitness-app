"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaTint, FaArrowLeft} from "react-icons/fa"
import { BsCupStraw } from "react-icons/bs"
import Link from "next/link"
import confetti from "canvas-confetti"
import dayjs from "dayjs"
import { waterService, WaterEntry } from "@/app/services/WaterService"

export default function WaterTracker() {
  const { user } = useAuth()
  const [completedCups, setCompletedCups] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [todayEntries, setTodayEntries] = useState<WaterEntry[]>([])

  const totalCups = 15
  const ozPerCup = 8
  const today = dayjs().format('YYYY-MM-DD')

  useEffect(() => {
    if (user) {
      fetchTodayEntries()
    }
  }, [user])

  const fetchTodayEntries = async () => {
    if (!user) return

    try {
      const data = await waterService.getTodayEntries(user.id, today)
      setTodayEntries(data)
      setCompletedCups(data.length)
    } catch (error) {
      console.error("Error fetching today's entries:", error)
    }
  }

  const handleCupClick = async (cupIndex: number) => {
    if (!user || isLoading) return

    // If cup is already completed, remove it
    if (cupIndex < completedCups) {
      await removeCup(cupIndex)
    } else {
      // If cup is not completed, add it
      await addCup()
    }
  }

  const addCup = async () => {
    if (completedCups >= totalCups || !user) return

    setIsLoading(true)
    try {
      await waterService.addCup(user.id, today, ozPerCup)
      
      const newCompletedCups = completedCups + 1
      setCompletedCups(newCompletedCups)
      
      // Show confetti if goal is completed
      if (newCompletedCups === totalCups) {
        triggerConfetti()
      }

      // Refresh from database
      await fetchTodayEntries()
    } catch (error) {
      console.error("Error adding water cup:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeCup = async (cupIndex: number) => {
    if (cupIndex >= todayEntries.length) {
      // If no database entries, just decrease local count
      setCompletedCups(Math.max(0, completedCups - 1))
      return
    }

    const entryToRemove = todayEntries[cupIndex]
    setIsLoading(true)

    try {
      if (entryToRemove) {
        await waterService.removeCup(entryToRemove.id)
      }

      setCompletedCups(Math.max(0, completedCups - 1))
      await fetchTodayEntries()
    } catch (error) {
      console.error("Error removing water cup:", error)
      setCompletedCups(Math.max(0, completedCups - 1))
    } finally {
      setIsLoading(false)
    }
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#1D4ED8', '#60A5FA', '#93C5FD']
    })
  }

  const getTotalOunces = () => {
    return completedCups * ozPerCup
  }

  const getProgressPercentage = () => {
    return (completedCups / totalCups) * 100
  }

  const resetDay = async () => {
    if (!user || todayEntries.length === 0) return

    setIsLoading(true)
    try {
      await waterService.resetDay(user.id, today)
      setCompletedCups(0)
      setTodayEntries([])
    } catch (error) {
      console.error("Error resetting day:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/water-chart">
          <Button variant="outline" size="sm" className="bg-logo-green dark:bg-snd-bkg text-black dark:text-white hover:opacity-90">
            <FaArrowLeft className="mr-2" />
            Back to Chart
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
            <FaTint className="text-logo-green" />
            Water Tracker
          </h1>
          <p className="text-gray-600">
            Click the cups to track your water intake
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Water Cups Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-gray-900">
                Daily Water Goal: {totalCups} Cups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4 justify-items-center">
                {Array.from({ length: totalCups }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handleCupClick(index)}
                    disabled={isLoading}
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center text-2xl
                      transition-all duration-200 transform hover:scale-110
                      ${index < completedCups
                        ? 'bg-logo-green text-white shadow-lg'
                        : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                      }
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <BsCupStraw className={index < completedCups ? 'text-white' : 'text-gray-400'} />
                  </button>
                ))}
              </div>
              
              {completedCups === totalCups && (
                <div className="text-center mt-6">
                  <div className="text-4xl mb-2">🎉</div>
                  <h3 className="text-xl font-bold text-logo-green">
                    Congratulations! You've completed your daily water goal!
                  </h3>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Today's Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-logo-green">
                  {completedCups}/{totalCups}
                </div>
                <div className="text-sm text-gray-600">
                  cups completed
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(getProgressPercentage())}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-logo-green h-3 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>

              <div className="text-center space-y-1">
                <div className="text-lg font-semibold">
                  {getTotalOunces()} oz
                </div>
                <div className="text-sm text-gray-600">
                  Total consumed today
                </div>
              </div>

              {completedCups > 0 && (
                <Button
                  onClick={resetDay}
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  Reset Day
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-900">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Goal:</span>
                <span>{totalCups * ozPerCup} oz</span>
              </div>
              <div className="flex justify-between">
                <span>Per Cup:</span>
                <span>{ozPerCup} oz</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining:</span>
                <span>{(totalCups - completedCups) * ozPerCup} oz</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
