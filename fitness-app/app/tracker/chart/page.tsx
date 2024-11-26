"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useEffect, useState } from "react"

import DropdownMenu from "@/components/DateRangePicker"
import { DeleteWeight } from "@/components/TrackerActions"
import { FaTrashAlt } from "react-icons/fa"
import { IoMdAdd } from "react-icons/io"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import { createClient } from "@/utils/supabase/client"
import dayjs from "dayjs"

export default function WeightChartPage() {
  const supabase = createClient()

  const [weightData, setWeightData] = useState<any>(null)
  const [loadedDates, setLoadedDates] = useState(null)
  const [startDate, setStartDate] = useState<any>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    const fetchLoadedDates = async () => {
      try {
        const { data, error } = await supabase
          .from("weight_tracker")
          .select("date_entry")
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
  }, [supabase])

  useEffect(() => {
    const fetchWeightData = async () => {
      if (!startDate || !endDate) return

      try {
        const { data, error } = await supabase
          .from("weight_tracker")
          .select("*")
          .gte("date_entry", startDate)
          .lte("date_entry", endDate)

        if (error) {
          throw error
        }
        setShowAlert(false)
        console.log("Fetched weight data:", data)
        setWeightData(data)
      } catch (error) {
        console.error("Error fetching weight data:", error)
      }
    }

    fetchWeightData()
  }, [startDate, endDate, supabase])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showAlert) {
      timer = setTimeout(() => {
        setShowAlert(false)
      }, 3000)
    }
    return () => clearTimeout(timer)
  }, [showAlert])

  const handleFormattedDate = (date: any) => {
    return dayjs(date).format("MMMM DD, YYYY")
  }

  const handleDeleteWeight = async (id: number) => {
    try {
      const { error } = await supabase
        .from("weight_tracker")
        .delete()
        .eq("id", id)

      if (error) {
        throw error
      }

      console.log("Deleted weight entry:", id)
      const updatedData = weightData?.filter((entry: any) => entry.id !== id)
      setWeightData(updatedData)
      setShowAlert(true)
    } catch (error) {
      console.error("Error deleting weight entry:", error)
    }
  }

  return (
    <div className="w-full">
      <Navigation />
      <div className="max-w-5xl mx-auto">
        {showAlert && (
          <Alert
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded-md shadow-md"
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

        <div className="max-w-5xl mx-auto mt-6 bg-white rounded-lg relative">
          <div className="absolute top-6 right-6">
            <Link href="/tracker">
              <button className="relative flex items-center bg-button-bkg text-nav-bkg font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <IoMdAdd className="mr-2 text-lg" />
                Add Weight
                <div className="absolute inset-0 rounded-lg bg-button-hover opacity-0 hover:opacity-20 transition duration-300"></div>
              </button>
            </Link>
          </div>

          <div className="border-b-2 border-snd-bkg pb-4 m-6 pt-6">
            <h2 className="text-4xl font-extrabold text-nav-bkg mb-2 tracking-tight">
              Weight Tracker
            </h2>
            <p className="text-lg text-gray-700">
              Track your progress and review your past entries to stay on top of
              your fitness goals.
            </p>
          </div>

          <div className="flex justify-center mb-4">
            <DropdownMenu
              initialStartDate={startDate}
              initialEndDate={endDate || ""}
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
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {weightData && weightData.length > 0 ? (
                  weightData.map((data: any, index: any) => (
                    <tr key={index} className="hover:bg-gray-100 group">
                      <td className="py-3 px-6 text-left">
                        {handleFormattedDate(data.date_entry)}
                      </td>
                      <td className="py-3 px-6 text-left">{data.weight}</td>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <DeleteWeight
                          deleteWeight={() => handleDeleteWeight(data.id)}
                        />
                      </div>
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
        </div>
      </div>
    </div>
  )
}
