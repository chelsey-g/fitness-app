"use client"

import { useEffect, useState, useMemo } from "react"

import { Tracker } from "@tremor/react"
import { createClient } from "@/utils/supabase/client"
import dayjs from "dayjs"

interface WeightEntry {
  weight: number
  date_entry: string
}

interface TrackerPoint {
  color: "gray" | "logo-green"
  tooltip: string
}

export default function ProgressTracker() {
  const supabase = createClient()
  const [weightDate, setWeightDate] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeight = async () => {
      try {
        setIsLoading(true)
        const user = await supabase.auth.getUser()
        const { data, error } = await supabase
          .from("weight_tracker")
          .select("weight, date_entry")
          .eq("created_by", user.data.user?.id)

        if (error) throw error

        const dates = data.map((entry: WeightEntry) =>
          dayjs(entry.date_entry).format("MM-DD-YYYY")
        )
        setWeightDate(dates)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch weight data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeight()

  }, [])

  const trackerData = useMemo(() => {
    const dates: TrackerPoint[] = []
    const today = dayjs()
    
    for (let i = 29; i >= 0; i--) {
      const currentDate = today.subtract(i, "day")
      const dateStr = currentDate.format("MM-DD-YYYY")
      dates.push({
        color: i === 0 ? "gray" : weightDate.includes(dateStr) ? "logo-green" : "gray",
        tooltip: dateStr
      })
    }
    return dates
  }, [weightDate])

  if (isLoading) {
    return <div className="mx-auto max-w-md">Loading weight tracking data...</div>
  }

  if (error) {
    return <div className="mx-auto max-w-md text-red-500">Error: {error}</div>
  }

  return (
    <div className="mx-auto max-w-md">
      <div role="region" aria-label="Weight tracking calendar">
        <Tracker
          data={trackerData}
          className="button-text"
          aria-label="Weight tracking visualization"
        />
      </div>
    </div>
  )
}
