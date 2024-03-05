"use client"

import { useEffect, useState } from "react"

import DropdownMenu from "@/components/DropdownMenu"
import Navigation from "@/components/Navigation"
import WeightGraph from "@/components/WeightGraph"
import { createClient } from "@/utils/supabase/client"
import dayjs from "dayjs"

export default function WeightChartPage() {
  const supabase = createClient()

  const [weightData, setWeightData] = useState(null)
  const [showGraph, setShowGraph] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  useEffect(() => {
    const fetchWeightData = async () => {
      try {
        const { data, error } = await supabase
          .from("weight_tracker")
          .select("*")
          .gte("date_entry", startDate)
          .lte("date_entry", endDate)

        if (error) {
          throw error
        }
        console.log("Fetched weight data:", data)
        setWeightData(data)
      } catch (error) {
        console.error("Error fetching weight data:", error)
      }
    }

    fetchWeightData()
  }, [startDate, endDate])

  const handleFormattedDate = (date) => {
    return dayjs(date).format("MMMM DD, YYYY")
  }

  return (
    <div className=" my-8 p-4 rounded">
      <Navigation />

      <div className="bg-white shadow-md rounded-lg my-6 p-4">
        <h2 className="text-lg font-semibold mb-4 text-snd-bkg w-3/4">
          Weight History
        </h2>
        <div className="flex justify-end mb-4">
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
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Weight</th>
                <th className="py-3 px-6 text-left">Competitions</th>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="2"
                    className="py-3 px-6 text-center text-gray-500"
                  >
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="bg-snd-bkg text-white py-2 px-4 rounded items-center"
            onClick={() => setShowGraph(!showGraph)}
          >
            Show Graph
          </button>
          {/* {showGraph && <WeightGraph data={weightData} />} */}
        </div>
      </div>
    </div>
  )
}
