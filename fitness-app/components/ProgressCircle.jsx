import { useEffect, useState } from "react"

import { ProgressCircle } from "@tremor/react"
import { createClient } from "@/utils/supabase/client"

const ProgressCircleHero = (profileInfo) => {
  const supabase = createClient()
  const [goals, setGoals] = useState([])
  const [weight, setWeight] = useState([])

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const { data: goals, error } = await supabase
          .from("profile_goals")
          .select("*")
          .eq("profile_id", profileInfo.profileInfo.id)
        if (error) {
          console.error(error)
        } else {
          setGoals(goals)
        }
      } catch (error) {
        console.error(error)
      }
    }

    const fetchWeight = async () => {
      try {
        const { data: weight, error } = await supabase
          .from("weight_tracker")
          .select("*")
          .eq("created_by", profileInfo.profileInfo.id)
          .order("created_at", { ascending: false })
          .limit(1)
        if (error) {
          console.error(error)
        } else {
          setWeight(weight)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchGoals()
    fetchWeight()
  }, [profileInfo.profileInfo.id])

  const weightPercentage = (weight, goal) => {
    const weightDifference = goal - weight
    const percentage = (weightDifference / goal) * 100
    return percentage
  }

  return (
    <div className="mx-auto grid grid-cols-1 gap-12">
      <div className="flex justify-center mt-5">
        <ProgressCircle value="31" size="xl">
          <span className="text-xs font-medium text-slate-700">31%</span>
        </ProgressCircle>
      </div>
    </div>
  )
}

export default ProgressCircleHero
