"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { weightService } from "@/app/services/WeightService"
import { goalService } from "@/app/services/GoalService"
import DropdownMenu from "@/components/DateRangePicker"
import { DeleteWeight } from "@/components/TrackerActions"
import { FaTrashAlt, FaSortUp, FaSortDown } from "react-icons/fa"
import { IoMdAdd } from "react-icons/io"
import Link from "next/link"
import dayjs from "dayjs"
import useSWR from "swr"


export default function WeightChartPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [loadedDates, setLoadedDates] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showProgressInfo, setShowProgressInfo] = useState(true)

  const goalsFetcher = async () => {
    if (!user) return null
    const data = await goalService.getGoals(user.id)
    return data?.[0] || null
  }

  const monthlyDataFetcher = async () => {
    if (!user) return null
    
    const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD')
    const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD')
    
    const data = await weightService.getMonthlyWeightEntries(user.id, startOfMonth, endOfMonth)
    return data
  }

  const { data: currentGoal } = useSWR(
    user ? 'current-goal' : null,
    goalsFetcher
  )

  const { data: monthlyData } = useSWR(
    user ? 'monthly-weight-data' : null,
    monthlyDataFetcher
  )

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchLoadedDates = async () => {
      try {
        const latestDate = await weightService.getLoadedDates(user.id)
        if (latestDate) {
          setLoadedDates(latestDate)
          if (!startDate && !endDate) {
            const start = dayjs(latestDate)
              .subtract(6, "day")
              .format("YYYY-MM-DD")
            const end = latestDate
            setStartDate(start)
            setEndDate(end)
          }
        } else {
          throw new Error("No data found")
        }
      } catch (error) {
        console.error("Error fetching loaded dates:", error)
      }
    }

    fetchLoadedDates()
  }, [user, router, startDate, endDate])

  useEffect(() => {
    const fetchWeightData = async () => {
      if (!startDate || !endDate || !user) return

      try {
        const data = await weightService.getWeightEntries(user.id, 100)
      } catch (error) {
        console.error("Error fetching weight data:", error)
      } finally {
      }
    }
    fetchWeightData()
  }, [startDate, endDate, user, router])

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

  const getMonthlyStats = () => {
    if (!monthlyData || monthlyData.length === 0) {
      return {
        daysTracked: 0,
        weightChange: 0,
        firstWeight: null,
        latestWeight: null
      }
    }

    const daysTracked = monthlyData.length
    const firstWeight = monthlyData[0].weight
    const latestWeight = monthlyData[monthlyData.length - 1].weight
    const weightChange = latestWeight - firstWeight

    return {
      daysTracked,
      weightChange,
      firstWeight,
      latestWeight
    }
  }

  const getGoalInfo = () => {
    if (!currentGoal || !monthlyData || monthlyData.length === 0) {
      return null
    }

    const latestWeight = monthlyData[monthlyData.length - 1].weight
    const weightToGoal = latestWeight - currentGoal.goal_weight
    const goalDate = dayjs(currentGoal.goal_date).format('MMMM DD, YYYY')

    return {
      weightToGoal,
      goalDate,
      goalWeight: currentGoal.goal_weight
    }
  }

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const getSortedData = () => {
      if (!monthlyData) return null
    
    const sorted = [...monthlyData].sort((a, b) => {
      const dateA = new Date(a.date_entry).getTime()
      const dateB = new Date(b.date_entry).getTime()
      const comparison = dateA - dateB
      
      return sortOrder === 'asc' ? comparison : -comparison
    })
    
    return sorted
  }

  const handleDeleteWeight = async (id: number) => {
    try {
      if (!user) throw new Error("User not authenticated")
      await weightService.deleteWeightEntry(id)
        setShowAlert(true)
    } catch (error) {
      console.error("Error deleting weight entry:", error)
    }
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
                  Weight Entry Deleted
                </AlertTitle>
                <AlertDescription className="mt-1 text-sm">
                  Your weight entry has been successfully deleted.
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b-2 border-snd-bkg pb-4 m-6 pt-6 dark:text-black">
            <h2 className="text-4xl font-extrabold mb-2 tracking-tight">
              Weight Tracker
            </h2>
            <p className="text-lg text-gray-700">
              Track your progress to stay on top of your goals.
            </p>
          </div>

          {/* Monthly Progress Summary */}
          <div className="px-6 pb-4">
            <div className="bg-orange-50 rounded-lg p-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <h3 className="text-lg font-semibold text-gray-800">This Month's Progress</h3>
                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                  <span className="text-sm text-gray-600 whitespace-nowrap">Show Progress</span>
                  <div 
                    className={`w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer relative ${
                      showProgressInfo ? 'bg-logo-green' : 'bg-gray-400'
                    }`}
                    onClick={() => setShowProgressInfo(!showProgressInfo)}
                  >
                    <div 
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ${
                        showProgressInfo ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
              {showProgressInfo && (() => {
                const monthlyStats = getMonthlyStats()
                const goalInfo = getGoalInfo()
                
                return (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">📅</span>
                      <span className="text-gray-700">
                        You've tracked <span className="font-semibold text-logo-green">{monthlyStats.daysTracked}</span> days this month
                      </span>
                    </div>
                    
                    {monthlyStats.daysTracked > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">⚖️</span>
                        <span className="text-gray-700">
                          Since the start of the month, you're 
                          <span className={`font-semibold ${monthlyStats.weightChange < 0 ? 'text-green-600' : monthlyStats.weightChange > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                            {monthlyStats.weightChange < 0 ? ' down ' : monthlyStats.weightChange > 0 ? ' up ' : ' the same '}
                            {Math.abs(monthlyStats.weightChange).toFixed(1)} lbs
                          </span>
                        </span>
                      </div>
                    )}
                    
                    {goalInfo && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">🎯</span>
                        <span className="text-gray-700">
                          You're only 
                          <span className={`font-semibold ${goalInfo.weightToGoal > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                            {Math.abs(goalInfo.weightToGoal).toFixed(1)} lbs
                          </span>
                          {goalInfo.weightToGoal > 0 ? ' away from' : ' under'} your goal ending on {goalInfo.goalDate}
                        </span>
                      </div>
                    )}
                    
                    {monthlyStats.daysTracked === 0 && (
                      <div className="text-gray-500 text-sm">
                        Start tracking your weight to see your monthly progress!
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <DropdownMenu
              initialStartDate={startDate || undefined}
              initialEndDate={endDate || undefined}
              handleDateChange={(dates) => {
                setStartDate(dates[0])
                setEndDate(dates[1])
              }}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto mb-6">
              <thead>
                <tr className="bg-white text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">
                    <button
                      onClick={handleSort}
                      className="flex items-center justify-start gap-2 hover:text-logo-green transition-colors"
                    >
                      <span className="leading-none">Date</span>
                      <span className="flex items-center justify-center leading-none">
                        {sortOrder === 'asc' ? <FaSortUp className="text-xs" /> : <FaSortDown className="text-xs" />}
                      </span>
                    </button>
                  </th>
                  <th className="py-3 px-6 text-left">Weight</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {getSortedData() && getSortedData()!.length > 0 ? (
                  getSortedData()!.map((data) => (
                    <tr key={data.id} className="hover:bg-gray-100 group">
                      <td className="py-3 px-6 text-left">
                        {handleFormattedDate(data.date_entry)}
                      </td>
                      <td className="py-3 px-6 text-left">{data.weight}</td>
                      <td className="py-3 px-6 text-right">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <DeleteWeight
                            deleteWeight={() => handleDeleteWeight(data.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-3 px-6 text-center text-gray-500"
                    >
                      No logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center p-6 sm:pb-8">
            <Link href="/weight-log">
              <button className="relative flex items-center px-6 py-3 sm:px-4 sm:py-2 rounded-md bg-logo-green dark:bg-snd-bkg text-black dark:text-white font-medium hover:opacity-90 transition-opacity">
                <IoMdAdd className="mr-2 text-lg" />
                Add Weight
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
