"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

import DropdownMenu from "@/components/DateRangePicker"
import { DeleteWeight } from "@/components/TrackerActions"
import { FaTrashAlt } from "react-icons/fa"
import { IoMdAdd } from "react-icons/io"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import dayjs from "dayjs"

interface WeightEntry {
  id: number
  date_entry: string
  weight: number
  created_by: string
}

export default function WeightChartPage() {
  const supabase = createClient()
  const router = useRouter()
  const { user } = useAuth()

  const [weightData, setWeightData] = useState<WeightEntry[] | null>(null)
  const [loadedDates, setLoadedDates] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchLoadedDates = async () => {
      try {
        const { data, error } = await supabase
          .from("weight_tracker")
          .select("date_entry")
          .eq("created_by", user.id)
          .order("date_entry", { ascending: false })
          .limit(1)

        if (error) {
          throw error
        }

        if (data.length > 0) {
          const latestDate = data[0].date_entry
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
          console.log("No data found")
        }
      } catch (error) {
        console.error("Error fetching loaded dates:", error)
      }
    }

    fetchLoadedDates()
  }, [supabase, user, router, startDate, endDate])

  useEffect(() => {
    const fetchWeightData = async () => {
      if (!startDate || !endDate || !user) return

      try {
        const { data, error } = await supabase
          .from("weight_tracker")
          .select("*")
          .eq("created_by", user.id)
          .gte("date_entry", startDate)
          .lte("date_entry", endDate)
          .order("date_entry", { ascending: false })

        if (error) {
          throw error
        }
        setShowAlert(false)
        setWeightData(data ? (data as WeightEntry[]) : null)
      } catch (error) {
        console.error("Error fetching weight data:", error)
      }
    }

    fetchWeightData()
  }, [startDate, endDate, supabase, user])

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

  const handleDeleteWeight = async (id: number) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("weight_tracker")
        .delete()
        .eq("id", id)
        .eq("created_by", user.id)

      if (error) {
        throw error
      }

      const updatedData = weightData?.filter((entry) => entry.id !== id)
      setWeightData(updatedData)
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
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Weight</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {weightData && weightData.length > 0 ? (
                  weightData.map((data) => (
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
            <Link href="/tracker">
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
