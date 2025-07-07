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
import { useState, ReactNode } from "react"

interface DeleteDialogProps {
  onDelete: () => Promise<void> | void
  title: string
  message: string
  buttonLabel?: string
  icon?: ReactNode
}

export default function DeleteDialog({
  onDelete,
  title,
  message,
  buttonLabel = "Delete",
  icon = <MdDeleteOutline className="w-5 h-5 text-red-600" />,
}: DeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleOpen = () => setIsOpen(true)
  const handleDeleteAndClose = async () => {
    setLoading(true)
    await onDelete()
    setLoading(false)
    setIsOpen(false)
  }

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-center p-2"
          onClick={handleOpen}
        >
          {icon}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="text-sm text-gray-700">
            {message}
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-4">
          <Button
            type="button"
            data-testid="confirm-delete"
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            onClick={handleDeleteAndClose}
            disabled={loading}
          >
            {buttonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 