"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaEllipsisH, FaTrashAlt } from "react-icons/fa"

import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function WorkoutActions({
  workoutId,
  listData,
}: {
  workoutId: number
  listData: any
}) {
  const supabase = createClient()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  async function handleDeleteWorkout(id: number) {
    const { data, error } = await supabase
      .from("workouts_lists")
      .delete()
      .eq("workout_id", workoutId)

    if (error) {
      console.log("Error deleting workout!", error)
    } else {
      router.refresh()
      console.log("Workout deleted!")
    }
  }

  function handleDeleteAndClose() {
    handleDeleteWorkout(workoutId)
    setIsOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-snd-bkg hover:text-snd-bkg rounded-full p-2 bg-gray-200 hover:bg-gray-300 transition-colors duration-150 ease-in-out">
            <FaEllipsisH />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-auto min-w-full bg-white shadow-lg rounded-md overflow-hidden border border-gray-200">
          <DropdownMenuGroup className="py-1">
            <DropdownMenuItem
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 ease-in-out"
              onClick={() => setIsOpen(true)}
            >
              Delete Workout
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Delete Workout Entry</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="text-sm">
              Are you sure you wish to delete this exercise? <br />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              className="bg-red-600 text-white"
              onClick={handleDeleteAndClose}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default WorkoutActions
