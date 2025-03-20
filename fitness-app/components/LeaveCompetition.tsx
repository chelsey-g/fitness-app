import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function LeaveCompetition({
  leaveCompetition,
}: {
  leaveCompetition: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleLeaveModal = () => {
    setIsOpen(true)
  }

  const handleLeave = () => {
    setIsOpen(false)
    leaveCompetition()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-600 hover:border-red-700 rounded-md transition-colors"
          onClick={handleLeaveModal}
        >
          Leave Competition
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Leave Competition
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="text-sm text-gray-700">
            Are you sure you want to leave this competition? <br />
            This action cannot be undone.
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-4">
          <Button
            type="button"
            data-testid="confirm-leave"
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            onClick={handleLeave}
          >
            Leave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
