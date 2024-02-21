"use client"

import { useEffect, useState } from "react"

import DropdownMenu from "@/components/DropdownMenu"
import Navigation from "@/components/Navigation"
import WeightGraph from "@/components/WeightGraph"
import { createClient } from "@supabase/supabase-js"

export default function WeightChartPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const [weightData, setWeightData] = useState(null)

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

  return (
    <div className="container mx-auto my-8 p-4">
      <Navigation />

      <div className="bg-white shadow-md rounded my-6">
        <p className="py-2 px-4 bg-blue-500 text-white font-semibold">
          Weight Chart
        </p>
        <p>
          <DropdownMenu />
        </p>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Weight</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {weightData?.map((data, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-2 px-6">{data.date}</td>
                <td className="py-2 px-6">{data.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <WeightGraph data={weightData} />
      </div>
    </div>
  )
}
