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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { handleDate } from "@/app/functions"
import { useState } from "react"
import { IoMdAdd } from "react-icons/io"
import DeleteDialog from "@/components/DeleteDialog"
import { goalService } from "@/app/services/GoalService"
import { weightService } from "@/app/services/WeightService"
import { AuthService } from "@/app/services/AuthService"
import { createClient } from "@/utils/supabase/client"

const supabase = createClient();
const authService = new AuthService(supabase);

export default function ProfileGoals() {
  const [goalWeight, setGoalWeight] = useState("")
  const [goalDate, setGoalDate] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [GoalSubmitAlert, setGoalSubmitAlert] = useState(false)
  const [deleteAlert, setDeleteAlert] = useState(false)

 interface goal {
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
     authService.getUser());

  let identityId: string | null = user?.identities?.[0]?.id || null

  const goalsFetcher: Fetcher<goal[]> = async () => {
    const data = await goalService.getGoals(identityId as string)

    return data || []
  }

  const { data: userGoals = [], mutate: mutateUserGoals } = useSWR<goal[]>(
    identityId ? `/goals/${identityId}` : null,
    goalsFetcher,
    { revalidateOnFocus: false }
  )

  const weightsFetcher: Fetcher<weight[]> = async () => {
    const data = await weightService.getWeightEntries(identityId as string)
    return data
  }

  const { data: weights = [] } = useSWR<weight[]>(
    identityId ? `/weights/${identityId}` : null,
    weightsFetcher,
    { revalidateOnFocus: false }
  )

  const handleEditModal = () => {
    setIsOpen(true)
  }

  const handleGoalSubmit = async (e: any) => {
    e.preventDefault()

    try {
      await goalService.addGoal(identityId as string, Number(goalWeight), goalDate)
      setGoalWeight("")
      setGoalDate("")
      setIsOpen(false)
      setGoalSubmitAlert(true)
      setTimeout(() => {
        setGoalSubmitAlert(false)
      }, 3000)
      mutateUserGoals()
    } catch (error) {
      console.error(error)
    }
  }

  const currentDate = new Date()
  const activeGoals = userGoals?.filter(
    (goal: any) => new Date(goal.goal_date) >= currentDate
  )

  const handleDeleteGoal = async (id: number) => {
    await goalService.deleteGoal(identityId as string, id)
    mutateUserGoals()
    setDeleteAlert(true)
    setTimeout(() => {
      setDeleteAlert(false)
    }, 3000)
  }

  return (
    <>
      <div className="px-4 md:px-0">
        <div className="max-w-5xl mx-auto mt-4 md:mt-6 bg-white dark:text-black rounded-lg shadow-md relative">
          <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <button
                  onClick={handleEditModal}
                  className="relative px-3 py-2 md:px-4 md:py-2 rounded-lg bg-logo-green dark:bg-snd-bkg text-black dark:text-white font-medium hover:opacity-90 text-sm md:text-base shadow-sm"
                >
                  <span className="hidden sm:inline">Add New Goal</span>
                  <span className="sm:hidden flex items-center gap-1">
                    <IoMdAdd className="w-4 h-4" />
                    Goal
                  </span>
                </button>
              </DialogTrigger>
              <DialogContent 
                className="w-[calc(100vw-2rem)] max-w-[425px] bg-white rounded-lg shadow-lg p-4 md:p-6 [&>button]:text-black [&>button>svg]:text-black !border-0 !outline-none !ring-0"
              >
                <DialogHeader>
                  <DialogTitle className="text-lg md:text-xl font-semibold text-gray-900">
                    Add New Goal
                  </DialogTitle>
                  <DialogDescription className="text-sm md:text-base">
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
                      className="focus:ring-logo-green focus:border-logo-green block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
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
                      className="focus:ring-logo-green focus:border-logo-green block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="relative bg-snd-bkg text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border-b-2 border-snd-bkg pb-4 m-4 md:m-6 pt-4 md:pt-6">
            <h1 className="text-2xl md:text-4xl font-extrabold text-nav-bkg mb-2 tracking-tight pr-16 md:pr-0">
              Active Goals
            </h1>
            <p className="text-base md:text-lg text-gray-700">
              Track your progress and stay focused on your fitness journey.
            </p>
          </div>
          <div className="p-4 md:p-6">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
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
                          {(() => {
                            const weightDiff = calculateWeightDifference(
                              goal.goal_weight,
                              weights?.[0]?.weight || 0
                            );
                            if (weightDiff === "No logged weight available") {
                              return (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500">No weight logged</span>
                                  <a
                                    href="/weight-log"
                                    className="inline-flex items-center justify-center w-5 h-5 text-xs bg-logo-green text-black rounded-full hover:opacity-90 transition-opacity"
                                    title="Click to log your weight"
                                  >
                                    <IoMdAdd className="w-3 h-3" />
                                  </a>
                                </div>
                              );
                            }
                            return weightDiff === "Invalid goal" 
                              ? weightDiff 
                              : `${weightDiff} lbs`;
                          })()}
                        </td>
                        <td className="p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <DeleteDialog
                            onDelete={() => handleDeleteGoal(goal.id)}
                            title="Delete Goal"
                            message="Are you sure you want to delete this goal?"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {activeGoals?.map((goal) => (
                <div
                  key={goal.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900">
                          {goal.goal_weight}
                        </h3>
                        <span className="text-sm font-medium text-gray-500">lbs</span>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <span className="w-2 h-2 bg-logo-green rounded-full"></span>
                        Target: {handleDate(goal.goal_date)}
                      </p>
                    </div>
                    <DeleteDialog
                      onDelete={() => handleDeleteGoal(goal.id)}
                      title="Delete Goal"
                      message="Are you sure you want to delete this goal?"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Days Left</span>
                        <div className="text-lg font-bold text-gray-900 mt-1">
                          {calculateDaysLeft(goal.goal_date)}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Weight Remaining</span>
                        <div className="text-lg font-bold text-gray-900 mt-1">
                          {(() => {
                            const weightDiff = calculateWeightDifference(
                              goal.goal_weight,
                              weights?.[0]?.weight
                            );
                            if (weightDiff === "No logged weight available") {
                              return (
                                <div className="flex flex-col items-end gap-2">
                                  <span className="text-sm text-gray-400 font-normal">No weight logged</span>
                                  <a
                                    href="/weight-log"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-logo-green text-black rounded-full hover:opacity-90 transition-opacity text-xs font-medium shadow-sm"
                                  >
                                    <IoMdAdd className="w-3 h-3" />
                                    Log Weight
                                  </a>
                                </div>
                              );
                            }
                            return (
                              <div className="flex items-baseline gap-1">
                                <span>{weightDiff === "Invalid goal" ? weightDiff : weightDiff}</span>
                                {weightDiff !== "Invalid goal" && <span className="text-sm text-gray-500">lbs</span>}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {activeGoals?.length === 0 && (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IoMdAdd className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
                  No Active Goals
                </h2>
                <p className="text-gray-500 text-base md:text-lg mb-6 max-w-sm mx-auto">
                  You haven't set any goals yet. Start now to stay motivated on your fitness journey!
                </p>
                <button
                  onClick={handleEditModal}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-logo-green text-black font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                >
                  <IoMdAdd className="w-4 h-4" />
                  Create Your First Goal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
