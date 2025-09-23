"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FaTrashAlt, FaTint, FaChartLine } from "react-icons/fa"
import { BsCupStraw, BsCupHot } from "react-icons/bs"
import { IoMdAdd } from "react-icons/io"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import dayjs from "dayjs"

interface WaterEntry {
  id: number
  date_entry: string
  amount_ml: number
  created_by: string
  created_at: string
}

export default function WaterChartPage() {
  const supabase = createClient()
  const router = useRouter()
  const { user } = useAuth()

  const [waterData, setWaterData] = useState<WaterEntry[] | null>(null)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchWaterData = async () => {
      try {
        const { data, error } = await supabase
          .from("water_intake")
          .select("*")
          .eq("created_by", user.id)
          .order("date_entry", { ascending: false })

        if (error) {
          throw error
        }
        setShowAlert(false)
        setWaterData(data ? (data as WaterEntry[]) : null)
      } catch (error) {
        console.error("Error fetching water data:", error)
      }
    }

    fetchWaterData()
  }, [supabase, user, router])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showAlert) {
      timer = setTimeout(() => {
        setShowAlert(false)
      }, 3000)
    }
    return () => clearTimeout(timer)
  }, [showAlert])

  const handleFormattedDate = (date: string) => {
    return dayjs(date).format("MMMM DD, YYYY")
  }

  const handleDeleteWater = async (id: number) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("water_intake")
        .delete()
        .eq("id", id)
        .eq("created_by", user.id)

      if (error) {
        throw error
      }

      const updatedData = waterData?.filter((entry) => entry.id !== id)
      setWaterData(updatedData ?? null)
      setShowAlert(true)
    } catch (error) {
      console.error("Error deleting water entry:", error)
    }
  }

  const getDailyTotal = (date: string) => {
    if (!waterData) return 0
    return waterData
      .filter(entry => entry.date_entry === date)
      .reduce((total, entry) => total + entry.amount_ml, 0)
  }

  const getUniqueDates = () => {
    if (!waterData) return []
    return Array.from(new Set(waterData.map(entry => entry.date_entry))).sort()
  }

  const mlToOunces = (ml: number) => {
    return Math.round(ml * 0.033814)
  }

  const ouncesToMl = (ounces: number) => {
    return Math.round(ounces / 0.033814)
  }

  if (!user) {
    return null
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {showAlert && (
          <Alert
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded-md shadow-md mb-4"
            role="alert"
          >
            <div className="flex items-center">
              <FaTrashAlt className="flex-shrink-0 w-4 h-4 text-red-500 mr-2" />
              <div>
                <AlertTitle className="font-bold text-md">
                  Water Entry Deleted
                </AlertTitle>
                <AlertDescription className="mt-1 text-sm">
                  Your water entry has been successfully deleted.
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b-2 border-snd-bkg pb-4 m-6 pt-6 dark:text-black">
            <h2 className="text-4xl font-extrabold mb-2 tracking-tight flex items-center gap-3">
              <FaTint className="text-logo-green" />
              Water Intake Tracker
            </h2>
            <p className="text-lg text-gray-700">
              Track your daily water consumption and stay hydrated.
            </p>
          </div>


          {/* Water Progress Grid - Similar to Challenge Progress */}
          <div className="px-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Water Progress History</CardTitle>
                <p className="text-sm text-gray-600">Your logged water intake days</p>
              </CardHeader>
              <CardContent>
                {getUniqueDates().length === 0 ? (
                  <div className="text-center py-8">
                    <BsCupStraw className="text-4xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No water logged yet</p>
                    <p className="text-gray-400 text-sm">Start tracking your hydration to see your progress here!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-x-2 gap-y-3 mb-6 justify-items-center">
                    {getUniqueDates().slice(0, 15).map((date) => {
                    const dailyTotal = getDailyTotal(date)
                    const cupsCompleted = Math.floor(dailyTotal / 250)
                    const totalCups = 15
                    const isComplete = cupsCompleted >= totalCups
                    const hasProgress = cupsCompleted > 0
                    const isToday = date === dayjs().format('YYYY-MM-DD')
                    const formattedDate = dayjs(date).format('M/D')
                    
                    return (
                      <div
                        key={date}
                        className={`
                          w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center
                          transition-all duration-200 transform hover:scale-110
                          ${isToday ? 'ring-2 ring-logo-green shadow-lg' : ''}
                          ${isComplete ? 'bg-logo-green bg-opacity-20 border-2 border-logo-green text-logo-green' : 
                            hasProgress ? 'bg-yellow-100 border-2 border-yellow-400 text-yellow-700' :
                            'bg-gray-50 border-2 border-gray-200 text-gray-500'}
                        `}
                        title={`${dayjs(date).format('MMM DD, YYYY')}: ${cupsCompleted}/${totalCups} cups`}
                      >
                        {isComplete ? (
                          <BsCupHot className="text-lg sm:text-xl text-logo-green" />
                        ) : hasProgress ? (
                          <BsCupStraw className="text-lg sm:text-xl text-yellow-600" />
                        ) : (
                          <BsCupStraw className="text-lg sm:text-xl text-gray-400" />
                        )}
                        <div className="text-xs font-semibold mt-1 text-gray-900">{formattedDate}</div>
                      </div>
                    )
                  })}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-6 text-xs justify-center">
                  <div className="flex items-center gap-2">
                    <BsCupHot className="text-logo-green text-lg" />
                    <span className="text-gray-700">Perfect Day (15/15 cups)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BsCupStraw className="text-yellow-600 text-lg" />
                    <span className="text-gray-700">Partial Progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BsCupStraw className="text-gray-400 text-lg" />
                    <span className="text-gray-700">No Progress</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Progress Summary */}
          <div className="px-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-gray-900">Today's Water Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {waterData && waterData.length > 0 ? (
                  (() => {
                    const today = dayjs().format('YYYY-MM-DD')
                    const todayData = waterData.filter(entry => entry.date_entry === today)
                    const todayTotal = todayData.reduce((total, entry) => total + entry.amount_ml, 0)
                    const cupsCompleted = Math.floor(todayTotal / 250)
                    const totalCups = 15
                    const percentage = Math.min(100, (cupsCompleted / totalCups) * 100)
                    
                    return (
                      <div className="text-center space-y-4">
                        <div className="text-4xl font-bold text-logo-green">
                          {cupsCompleted}/{totalCups}
                        </div>
                        <div className="text-lg text-gray-600">
                          cups completed today
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{Math.round(percentage)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-logo-green h-3 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {mlToOunces(todayTotal)} oz ({todayTotal}ml) total
                        </div>
                        {cupsCompleted === totalCups && (
                          <div className="text-logo-green font-semibold">
                            🎉 Goal Complete! Great job staying hydrated! 🎉
                          </div>
                        )}
                      </div>
                    )
                  })()
                ) : (
                  <div className="text-center text-gray-500">
                    <div className="text-2xl mb-2">💧</div>
                    <div>No water logged today</div>
                    <div className="text-sm mt-1">Start tracking your hydration!</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-center p-6 sm:pb-8">
            <Link href="/water-log">
              <button className="relative flex items-center px-6 py-3 sm:px-4 sm:py-2 rounded-md bg-logo-green dark:bg-snd-bkg text-black dark:text-white font-medium hover:opacity-90 transition-opacity">
                <FaTint className="mr-2 text-lg" />
                Track Water Today
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
