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

export default function GoalsDropdown({ deleteGoals }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleEditModal = () => {
    setIsDeleteOpen(true)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-snd-bkg hover:text-red-900 rounded-full p-2 bg-gray-200 hover:bg-gray-300 transition-colors duration-150 ease-in-out">
          <FaEllipsisH />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto min-w-full bg-white shadow-lg rounded-md overflow-hidden border border-gray-200">
        <DropdownMenuGroup className="py-1">
          <Dialog>
            <DialogTrigger asChild>
              <button
                onClick={handleEditModal}
                className="text-sm px-4 py-2 text-snd-bkg"
              >
                Delete
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
              <DialogHeader>
                <DialogTitle>Delete Goal</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="text-sm">
                  Are you sure you wish to delete this goal entry? <br />
                  This action cannot be undone.
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  className="bg-red-600 text-white"
                  onClick={deleteGoals}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <DropdownMenuItem
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 ease-in-out"
            onClick={deleteGoals}
          >
            Delete
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
