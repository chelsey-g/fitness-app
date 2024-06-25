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

  const handleDeleteAndClose = async () => {
    await deleteGoals()
    setIsDeleteOpen(false)
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
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogTrigger asChild>
              <button
                onClick={() => setIsDeleteOpen(true)}
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
