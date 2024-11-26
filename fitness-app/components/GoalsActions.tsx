import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { MdDeleteOutline } from "react-icons/md"
import { useState } from "react"

export default function GoalsDropdown({
  deleteGoals,
}: {
  deleteGoals: () => Promise<void>
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleEditModal = () => {
    setIsOpen(true)
  }

  const handleDeleteAndClose = async () => {
    await deleteGoals()
    setIsOpen(false)
  }

  return (
    <Dialog onOpenChange={setIsOpen}>
      <DialogTrigger>
        <button
          type="button"
          className="flex items-center justify-center p-2"
          onClick={handleEditModal}
        >
          <MdDeleteOutline className="w-5 h-5 text-red-600" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Delete Goal
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="text-sm text-gray-700">
            Are you sure you wish to delete this goal? <br />
            This action cannot be undone.
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-4">
          <Button
            type="button"
            data-testid="confirm-delete"
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            onClick={handleDeleteAndClose}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
