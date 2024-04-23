import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"

import { createClient } from "@/utils/supabase/client"
import { handleDate } from "@/app/functions"

export default function ProfileGoals(profileInfo) {
  const supabase = createClient()
  const [goalWeight, setGoalWeight] = useState("")
  const [goalDate, setGoalDate] = useState("")
  const [goals, setGoals] = useState([])

  useEffect(() => {
    const fetchGoals = async () => {
      const { data: goals, error } = await supabase
        .from("profile_goals")
        .select("*")
        .eq("profile_id", profileInfo.profileInfo.id)
      if (error) {
        console.error(error)
      } else {
        console.log(goals)
        setGoals(goals)
      }
    }
    fetchGoals()
  }, [])

  console.log(goals)

  const handleGoalSubmit = async (e) => {
    e.preventDefault()

    const { data, error } = await supabase
      .from("profile_goals")
      .insert([{ goal_weight: goalWeight, goal_date: goalDate }])
      .select()
    setGoalWeight(e.target.value)
    if (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col">
      <CardHeader>
        <CardTitle>Goals</CardTitle>
        <CardDescription>Add New Goal to track your progress</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="goal_weight"
              className="block text-sm font-medium text-gray-700"
            >
              Goal Weight
            </label>
            <input
              type="number"
              name="goal_weight"
              id="goal_weight"
              value={goalWeight}
              onChange={(e) => setGoalWeight(e.target.value)}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="goal_date"
              className="block text-sm font-medium text-gray-700"
            >
              Goal Date
            </label>
            <input
              type="date"
              name="goal_date"
              id="goal_date"
              value={goalDate}
              onChange={(e) => setGoalDate(e.target.value)}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="px-6 py-4 flex justify-center">
        <button
          className="bg-snd-bkg hover:bg-snd-bkg text-white py-3 px-6 rounded-full focus:outline-none text-center"
          onClick={handleGoalSubmit}
        >
          Save
        </button>
      </CardFooter>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="mt-5 font-semibold">
              Active Goals ({goals.length})
              <tr>
                <th className="p-4 text-left text-sm font-semibold">
                  Goal Weight
                </th>
                <th className="p-4 text-left text-sm font-semibold">
                  Goal Date
                </th>
              </tr>
            </thead>
            <tbody>
              {goals?.map((goal) => (
                <tr key={goal.id}>
                  <td className="p-4 text-sm text-gray-500 font-semibold">
                    {goal.goal_weight} lbs
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {handleDate(goal.goal_date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </div>
  )
}
