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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { FaEllipsisH } from "react-icons/fa"
import { useState } from "react"

interface WorkoutDropdownProps {
  deleteWorkout: () => void
  showAlert: () => void
}

export function WorkoutDropdown({
  deleteWorkout,
  showAlert,
}: WorkoutDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleEditModal = () => {
    setIsOpen(true)
  }

  const handleDeleteAndClose = () => {
    deleteWorkout()
    setIsOpen(false)
    showAlert()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-expanded={isOpen ? "true" : "false"}
          className="text-snd-bkg hover:text-red-900 rounded-full p-2 bg-gray-200 hover:bg-gray-300 transition-colors duration-150 ease-in-out"
          data-testid="delete-workout"
        >
          <FaEllipsisH />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto min-w-full bg-white shadow-lg rounded-md overflow-hidden border border-gray-200">
        <DropdownMenuGroup className="py-1">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button
                onClick={handleEditModal}
                className="text-sm px-4 py-2 text-snd-bkg"
              >
                Delete Workout
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
              <DialogHeader>
                <DialogTitle>Delete Workout Entry</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="text-sm">
                  Are you sure you wish to delete this workout? <br />
                  All exercises in this workout will be deleted.
                </div>
              </div>
              <DialogFooter data-testid="delete-button">
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
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default WorkoutDropdown
