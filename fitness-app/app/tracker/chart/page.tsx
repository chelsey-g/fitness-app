"use client"

import { useEffect, useState } from "react"

import DropdownMenu from "@/components/DropdownMenu"
import Navigation from "@/components/Navigation"
import WeightGraph from "@/components/WeightGraph"
import { createClient } from "@/utils/supabase/client"

export default function WeightChartPage() {
  const supabase = createClient()

  const [weightData, setWeightData] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState("")
  const [showGraph, setShowGraph] = useState(false)

  useEffect(() => {
    const fetchWeightData = async () => {
      try {
        const { data, error } = await supabase
          .from("weight_tracker")
          .select("date_entry, weight")

        if (error) {
          throw error
        }

        const formattedData = data.map((item) => ({
          ...item,
          date: new Date(item.date_entry).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }))

        setWeightData(formattedData)
      } catch (error) {
        console.error("Error fetching weight data!", error)
      }
    }
    fetchWeightData()
  }, [])

  const handleMonthSelect = (month) => {
    setSelectedMonth(month)
  }

  const filteredData = selectedMonth
    ? weightData?.filter((month) => month.date.includes(selectedMonth))
    : weightData

  return (
    <div className=" my-8 p-4 rounded">
      <Navigation />

      <div className="bg-white shadow-md rounded-lg my-6 p-4">
        <h2 className="text-lg font-semibold mb-4 text-snd-bkg w-3/4">
          Weight History
        </h2>
        <div className="flex justify-end mb-4">
          <DropdownMenu selectMonth={handleMonthSelect} />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Weight</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {filteredData && filteredData.length > 0 ? (
                filteredData.map((data, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6">{data.date}</td>
                    <td className="py-3 px-6">{data.weight}</td>
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
          {showGraph && <WeightGraph data={weightData} />}
        </div>
      </div>
    </div>
  )
}
