"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useEffect, useState } from "react"

import DropdownMenu from "@/components/DateRangePicker"
import { DropdownMenuDemo } from "@/components/TrackerActions"
import Link from "next/link"
import { MdDelete } from "react-icons/md"
import Navigation from "@/components/Navigation"
// import ProgressTracker from "@/components/ProgressTracker"
// import WeightGraph from "@/components/WeightGraph"
import { createClient } from "@/utils/supabase/client"
import dayjs from "dayjs"

export default function WeightChartPage() {
  const supabase = createClient()

  const [weightData, setWeightData] = useState(null)
  const [loadedDates, setLoadedDates] = useState(null)
  // const [showGraph, setShowGraph] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
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
    let timer
    if (showAlert) {
      timer = setTimeout(() => {
        setShowAlert(false)
      }, 3000)
    }
    return () => clearTimeout(timer)
  }, [showAlert])

  const handleFormattedDate = (date) => {
    return dayjs(date).format("MMMM DD, YYYY")
  }

  const handleDeleteWeight = async (id) => {
    try {
      const { error } = await supabase
        .from("weight_tracker")
        .delete()
        .eq("id", id)

      if (error) {
        throw error
      }

      console.log("Deleted weight entry:", id)
      const updatedData = weightData?.filter((entry) => entry.id !== id)
      setWeightData(updatedData)
      setShowAlert(true)
    } catch (error) {
      console.error("Error deleting weight entry:", error)
    }
  }

  return (
    <div className=" my-8 p-4 rounded">
      <Navigation />
      {showAlert && (
        <Alert
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <MdDelete />
            </div>
            <div>
              <AlertTitle className="font-bold">Weight Data Deleted</AlertTitle>
              <AlertDescription>
                Your weight entry has been deleted successfully.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      <div className="bg-white shadow-md rounded-lg my-6 p-4">
        <h2 className="text-lg font-semibold mb-4 text-snd-bkg w-3/4">
          Weight History
        </h2>
        <div className="flex justify-center mb-4">
          <DropdownMenu
            initialStartDate={startDate}
            initialEndDate={endDate}
            handleDateChange={(dates) => {
              setStartDate(dates[0])
              setEndDate(dates[1])
            }}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-white text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Weight</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {weightData && weightData.length > 0 ? (
                weightData.map((data, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left">
                      {handleFormattedDate(data.date_entry)}
                    </td>
                    <td className="py-3 px-6 text-left">{data.weight}</td>
                    <td className="py-3 px-6 text-center">
                      <DropdownMenuDemo
                        deleteWeight={() => handleDeleteWeight(data.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="py-3 px-6 text-center text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4">
          <Link href="/tracker">
            <button className="bg-prm-bkg text-snd-bkg font-bold py-2 px-4 rounded items-center">
              Add Weight
            </button>
          </Link>
          {/* <button
            className="bg-snd-bkg text-white py-2 px-4 rounded items-center"
            onClick={() => setShowGraph(!showGraph)}
          >
            Show Graph
          </button> */}
          {/* {showGraph && <WeightGraph data={weightData} />} */}
          {/* <div className="border w-96"><ProgressTracker /></div> */}
        </div>
      </div>
    </div>
  )
}
