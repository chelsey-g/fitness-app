"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { calculateDaysLeft, calculateWeightDifference } from "@/app/functions"
import useSWR, { Fetcher } from "swr"

import { Button } from "@/components/ui/button"
import GoalsDropdown from "@/components/GoalsActions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import { handleDate } from "@/app/functions"
import { useState } from "react"

export default function ProfileGoals() {
  const supabase = createClient()
  const [goalWeight, setGoalWeight] = useState("")
  const [goalDate, setGoalDate] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [GoalSubmitAlert, setGoalSubmitAlert] = useState(false)
  const [deleteAlert, setDeleteAlert] = useState(false)

  type goal = {
    id: number
    goal_weight: number
    goal_date: string
  }

  type weight = {
    id: number
    weight: any
    created_at: string
  }

  const { data: user } = useSWR("/users", () =>
    supabase.auth.getUser().then((res) => res.data.user)
  )

  let identityId: string | null = user?.identities?.[0]?.id || null

  const goalsFetcher: Fetcher<goal[]> = async () => {
    const { data, error } = await supabase
      .from("profile_goals")
      .select("*")
      .eq("profile_id", identityId)

    if (error) {
      throw new Error(error.message)
    }

    return data || []
  }

  const { data: userGoals = [], mutate: mutateUserGoals } = useSWR<goal[]>(
    identityId ? `/goals/${identityId}` : null,
    goalsFetcher,
    { revalidateOnFocus: false }
  )

  const weightsFetcher: Fetcher<weight[]> = async () => {
    const { data, error } = await supabase
      .from("weight_tracker")
      .select("*")
      .eq("created_by", identityId)
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      throw new Error(error.message)
    }

    return data || []
  }

  const { data: weights } = useSWR<weight[]>(
    identityId ? "/weights/" + identityId : null,
    weightsFetcher,
    { revalidateOnFocus: false }
  )

  const handleEditModal = () => {
    setIsOpen(true)
  }

  const handleGoalSubmit = async (e: any) => {
    e.preventDefault()

    const { data: goal, error } = await supabase
      .from("profile_goals")
      .insert([
        {
          goal_weight: goalWeight,
          goal_date: goalDate,
          profile_id: identityId,
        },
      ])
      .select()

    if (error) {
      console.error(error)
    } else {
      setGoalWeight("")
      setGoalDate("")
      setIsOpen(false)
      setGoalSubmitAlert(true)
      setTimeout(() => {
        setGoalSubmitAlert(false)
      }, 3000)
      mutateUserGoals()
    }
  }

  const currentDate = new Date()
  const activeGoals = userGoals?.filter(
    (goal: any) => new Date(goal.goal_date) >= currentDate
  )

  const handleDeleteGoal = async (id: number) => {
    const { error } = await supabase.from("profile_goals").delete().eq("id", id)
    if (error) {
      console.error(error)
    } else {
      setDeleteAlert(true)
      setTimeout(() => {
        setDeleteAlert(false)
      }, 3000)
      mutateUserGoals()
    }
  }

  return (
    <>
      <div className="max-w-5xl mx-auto mt-6 bg-white dark:text-black rounded-lg shadow-md relative">
        <div className="absolute top-6 right-6">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button
                onClick={handleEditModal}
                className="relative px-4 py-2 rounded-md bg-logo-green dark:bg-snd-bkg text-black dark:text-white font-medium hover:opacity-90"
              >
                Add New Goal
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg p-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Add New Goal
                </DialogTitle>
                <DialogDescription>
                  Enter your goal details below and click save to add your new
                  goal.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleGoalSubmit} className="space-y-4">
                <div className="flex flex-col">
                  <Label
                    htmlFor="goal_weight"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Goal Weight
                  </Label>
                  <Input
                    type="number"
                    name="goal_weight"
                    id="goal_weight"
                    value={goalWeight}
                    onChange={(e) => setGoalWeight(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <Label
                    htmlFor="goal_date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Goal Date
                  </Label>
                  <Input
                    type="date"
                    name="goal_date"
                    id="goal_date"
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="relative bg-button-bkg text-nav-bkg font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border-b-2 border-snd-bkg pb-4 m-6 pt-6">
          <h1 className="text-4xl font-extrabold text-nav-bkg mb-2 tracking-tight">
            Active Goals
          </h1>
          <p className="text-lg text-gray-700">
            Track your progress and stay focused on your fitness journey.
          </p>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            {activeGoals.length > 0 && (
              <table className="min-w-full table-auto">
                <thead className="font-semibold text-gray-700 uppercase">
                  <tr>
                    <th className="p-2 text-sm text-left">Goal Date</th>
                    <th className="p-2 text-sm text-left">Goal Weight</th>
                    <th className="p-2 text-sm text-left">Days Left</th>
                    <th className="p-2 text-sm text-left">Weight Remaining</th>
                    <th className="p-2 text-sm text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {activeGoals?.map((goal) => (
                    <tr
                      key={goal.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 group`}
                    >
                      <td className="p-2 text-sm">
                        {handleDate(goal.goal_date)}
                      </td>
                      <td className="p-2 text-sm">{goal.goal_weight} lbs</td>
                      <td className="p-2 text-sm">
                        {calculateDaysLeft(goal.goal_date)}
                      </td>
                      <td className="p-2 text-sm">
                        {calculateWeightDifference(
                          goal.goal_weight,
                          weights?.[0]?.weight
                        )}{" "}
                        lbs
                      </td>
                      <td className="p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <GoalsDropdown
                          deleteGoals={() => handleDeleteGoal(goal.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {activeGoals?.length === 0 && (
            <div className="text-center py-10">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                No Active Goals
              </h2>
              <p className="text-gray-500 text-lg mb-6">
                You haven’t set any goals yet. Start now to stay motivated!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
