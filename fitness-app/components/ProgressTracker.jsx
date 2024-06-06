"use client"

import { useEffect, useState } from "react"

import { Tracker } from "@tremor/react"
import { createClient } from "@/utils/supabase/client"
import dayjs from "dayjs"

export default function ProgressTracker() {
  const supabase = createClient()
  const [weightDate, setWeightDate] = useState([])

  useEffect(() => {
    const fetchWeight = async () => {
      try {
        const user = await supabase.auth.getUser()
        const { data, error } = await supabase
          .from("weight_tracker")
          .select("weight, date_entry")
          .eq("created_by", user.data.user.id)
        if (error) {
          console.log("error", error)
        } else {
          console.log("data", data)
          const dates = data.map((entry) =>
            dayjs(entry.date_entry).format("MM-DD-YYYY")
          )
          setWeightDate(dates)
        }
      } catch (error) {
        console.log("error", error)
      }
    }

    fetchWeight()
  }, [])

  const handleGenerateDates = () => {
    const dates = []
    const today = dayjs()
    for (let i = 29; i >= 0; i--) {
      const currentDate = today.subtract(i, "day")
      const dateStr = currentDate.format("MM-DD-YYYY")
      const color =
        i === 0 ? "gray" : weightDate.includes(dateStr) ? "green" : "gray"
      const tooltipText = dateStr
      dates.push({ color, tooltip: tooltipText })
    }
    return dates
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="text-sm mb-5">
        In the last 30 days, you tracked your weight on the following days:
      </div>
      <div>
        <Tracker data={handleGenerateDates()} />
      </div>
    </div>
  )
}
