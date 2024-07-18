"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FaCheckCircle, FaTrashAlt } from "react-icons/fa"
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
  const [GoalSubmitAlert, setGoalSubmitAlert] = useState(false)
  const [deleteAlert, setDeleteAlert] = useState(false)

  const { data: user } = useSWR("/users", () =>
    supabase.auth.getUser().then((res) => res.data.user)
  )

  let identityId = user?.identities?.[0]?.id || null

  console.log(identityId, "identityId")
  const { data: userGoals, mutate: mutateUserGoals } = useSWR(
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
    (goal) => new Date(goal.goal_date) >= currentDate
  )

  const handleDeleteGoal = async (id) => {
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
    <div className="p-4">
      <Navigation />
      {GoalSubmitAlert && (
        <Alert
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-2 rounded-md shadow-md"
          role="alert"
        >
          <div className="flex items-center">
            <FaCheckCircle className="flex-shrink-0 w-4 h-4 text-green-500 mr-2" />
            <div>
              <AlertTitle className="font-bold text-md">
                Goal Created
              </AlertTitle>
              <AlertDescription className="mt-1 text-sm">
                Your goal has been created successfully. Good luck!
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
      {deleteAlert && (
        <Alert
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded-md shadow-md"
          role="alert"
        >
          <div className="flex items-center">
            <FaTrashAlt className="flex-shrink-0 w-4 h-4 text-red-500 mr-2" />
            <div>
              <AlertTitle className="font-bold text-md">
                Goal Deleted
              </AlertTitle>
              <AlertDescription className="mt-1 text-sm">
                Your goal has been deleted successfully.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
      <div className="overflow-x-auto mt-4 bg-white rounded-lg shadow-md p-4">
        <h1 className="text-lg font-semibold text-center">Active Goals</h1>
        <table className="min-w-full">
          <thead className="font-semibold">
            <tr className="items-center">
              <th className="p-2 text-sm">Goal Date</th>
              <th className="p-2 text-sm">Goal Weight</th>
              <th className="p-2 text-sm">Days Left</th>
              <th className="p-2 text-sm">Weight Remaining</th>
              <th className="p-2 text-sm"></th>
            </tr>
          </thead>
          <tbody>
            {activeGoals?.map((goal) => (
              <tr key={goal.id}>
                <td className="p-2 text-sm text-center">
                  {handleDate(goal.goal_date)}
                </td>
                <td className="p-2 text-sm text-center">
                  {goal.goal_weight} lbs
                </td>
                <td className="p-2 text-sm text-center">
                  {calculateDaysLeft(goal.goal_date)}
                </td>
                <td className="p-2 text-sm text-center">
                  {calculateWeightDifference(
                    goal.goal_weight,
                    weights?.[0]?.weight
                  )}{" "}
                  lbs
                </td>
                <td className="p-2 text-sm text-center">
                  <GoalsDropdown
                    deleteGoals={() => handleDeleteGoal(goal.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-center">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                <div className="flex flex-col sm:flex-row items-center gap-4">
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
                    className="focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 rounded-md w-full sm:w-60"
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
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
                    className="focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 rounded-md w-full sm:w-60"
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
