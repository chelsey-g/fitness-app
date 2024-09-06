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

export function DropdownMenuDemo({
  deleteWeight,
}: {
  deleteWeight: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleEditModal = () => {
    console.log("Dropdown clicked")
    setIsOpen(true)
    console.log("isOpen:", isOpen)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          data-testid="dropdown-trigger"
          className="text-snd-bkg hover:text-red-900 rounded-full p-2 bg-gray-200 hover:bg-gray-300 transition-colors duration-150 ease-in-out"
        >
          <FaEllipsisH aria-label="ellipsis" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        role="elipsis"
        data-testid="dropdown-content"
        className="w-auto min-w-full bg-white shadow-lg rounded-md overflow-hidden border border-gray-200"
      >
        <DropdownMenuGroup className="py-1">
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                onClick={handleEditModal}
                aria-label="Delete"
                className="text-sm px-4 py-2 text-snd-bkg"
                data-testid="delete-option"
              >
                Delete
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
              <DialogHeader>
                <DialogTitle>Delete Weight Entry</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="text-sm">
                  Are you sure you wish to delete this weight entry? <br />
                  This action cannot be undone.
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  data-testid="confirm-delete"
                  className="bg-red-600 text-white"
                  onClick={deleteWeight}
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
