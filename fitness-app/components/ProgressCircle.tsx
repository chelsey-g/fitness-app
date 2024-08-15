import { useEffect, useState } from "react"

import { ProgressCircle } from "@tremor/react"
import { createClient } from "@/utils/supabase/client"

interface Weight {
  id: number
  weight: number
  created_at: string
  created_by: number
}

interface Goals {
  id: number
  goal_weight: number
}

const ProgressCircleHero = (profileInfo: any) => {
  const supabase = createClient()
  const [goals, setGoals] = useState<Goals[]>([])
  const [weight, setWeight] = useState<Weight[]>([])
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
            const currentWeight = weight[0].weight
            const goalWeight = goals.length > 0 ? goals[0].goal_weight : 0
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

  const weightPercentage = (currentWeight: number, goalWeight: number) => {
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
