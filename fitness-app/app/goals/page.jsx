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

import { Button } from "@/components/ui/button"
import GoalsDropdown from "@/components/GoalsActions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Navigation from "@/components/Navigation"
import { createClient } from "@/utils/supabase/client"
import { handleDate } from "@/app/functions"
import useSWR from "swr"
import { useState } from "react"

export default function ProfileGoals() {
  const supabase = createClient()
  const [goalWeight, setGoalWeight] = useState("")
  const [goalDate, setGoalDate] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const { data: user } = useSWR("/users", () =>
    supabase.auth.getUser().then((res) => res.data.user)
  )

  let identityId = user?.identities?.[0]?.id || null

  console.log(identityId, "identityId")
  const { data: userGoals } = useSWR(
    () => (identityId ? "/profile_goals/" + identityId : null),
    () =>
      supabase
        .from("profile_goals")
        .select("*")
        .eq("profile_id", identityId)
        .then((res) => res.data)
  )

  const { data: weights } = useSWR(
    identityId ? "/weights/" + identityId : null,
    () =>
      supabase
        .from("weight_tracker")
        .select("*")
        .eq("created_by", identityId)
        .order("created_at", { ascending: false })
        .limit(1)
        .then((res) => res.data),
    { revalidateOnFocus: false }
  )

  const handleEditModal = () => {
    setIsOpen(true)
  }

  const handleGoalSubmit = async (e) => {
    e.preventDefault()

    const { data: goal, error } = await supabase
      .from("profile_goals")
      .insert([{ goal_weight: goalWeight, goal_date: goalDate }])
      .select()
    setGoalWeight(e.target.value)
    if (error) {
      console.error(error)
    } else {
      setIsOpen(false)
    }
  }
  const currentDate = new Date()
  const activeGoals = userGoals?.filter(
    (goal) => new Date(goal.goal_date) >= currentDate
  )

  const handleDeleteGoal = async (id) => {
    const { error } = await supabase.from("profile_goals").delete().eq("id", id)
    if (error) {
      console.error(error)
    }
  }
  return (
    <div className="p-4">
      <Navigation />
      <div className="overflow-x-auto mt-4 bg-white rounded-lg shadow-md p-4">
        <h1 className="text-lg font-semibold text-center">Active Goals</h1>
        <table className="min-w-full">
          <thead className="font-semibold items-center">
            <tr className="items-center">
              <th className="p-4 text-sm">Goal Date</th>
              <th className="p-4 text-sm">Goal Weight</th>
              <th className="p-4 text-sm">Days Left</th>
              <th className="p-4 text-sm">Weight Remaining</th>
              <th className="p-4 text-sm"></th>
            </tr>
          </thead>
          <tbody>
            {activeGoals?.map((goal) => (
              <tr key={goal.id}>
                <td className="p-4 text-sm text-center">
                  {handleDate(goal.goal_date)}
                </td>
                <td className="p-4 text-sm text-center">
                  {goal.goal_weight} lbs
                </td>
                <td className="p-4 text-sm text-center">
                  {calculateDaysLeft(goal.goal_date)}
                </td>
                <td className="p-4 text-sm text-center">
                  {calculateWeightDifference(
                    goal.goal_weight,
                    weights?.[0]?.weight
                  )}{" "}
                  lbs
                </td>
                <td className="p-4 text-sm text-center">
                  <GoalsDropdown
                    deleteGoals={() => handleDeleteGoal(goal.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-center">
          <Dialog>
            <DialogTrigger asChild>
              <button
                onClick={handleEditModal}
                className="text-sm px-4 py-2 bg-snd-bkg text-white rounded hover:bg-gray-600"
              >
                Add New Goal
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
              <DialogHeader>
                <DialogTitle>Add New Goal</DialogTitle>
                <DialogDescription>
                  Add a new personal goal here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
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
                    className="focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
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
                    className="focus:ring-indigo-500 focus:border-indigo-500 w-40 shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  className="mt-4 bg-snd-bkg hover:bg-snd-bkg text-white py-3 px-6 rounded-full focus:outline-none"
                  onClick={handleGoalSubmit}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
