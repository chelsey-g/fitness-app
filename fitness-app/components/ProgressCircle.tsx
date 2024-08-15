import { useEffect, useState } from "react"

import { ProgressCircle } from "@tremor/react"
import { createClient } from "@/utils/supabase/client"

const ProgressCircleHero = (profileInfo) => {
  const supabase = createClient()
  const [goals, setGoals] = useState([])
  const [weight, setWeight] = useState([])
  const [percentage, setPercentage] = useState(0)

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
          if (weight.length > 0) {
            const currentWeight = weight[0].weight // Assuming weight is stored in a field named 'weight'
            const goalWeight = goals.length > 0 ? goals[0].goal_weight : 0 // Assuming goal weight is stored in a field named 'goal_weight'
            const calculatedPercentage = weightPercentage(
              currentWeight,
              goalWeight
            )
            setPercentage(calculatedPercentage)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchGoals()
    fetchWeight()
  }, [profileInfo.profileInfo.id])

  const weightPercentage = (currentWeight, goalWeight) => {
    let calculatedPercentage = 0
    if (currentWeight >= goalWeight) {
      calculatedPercentage = 100
    } else {
      const weightDifference = goalWeight - currentWeight
      calculatedPercentage =
        ((goalWeight - weightDifference) / goalWeight) * 100
    }
    return calculatedPercentage
  }

  console.log(goals)
  console.log(weight)

  return (
    <div className="mx-auto grid grid-cols-1 gap-12">
      <div className="flex justify-center mt-5">
        <ProgressCircle value={percentage} size="xl">
          <span className="text-xs font-medium text-slate-700">
            {percentage.toFixed(2)}%
          </span>
        </ProgressCircle>
      </div>
    </div>
  )
}

export default ProgressCircleHero
