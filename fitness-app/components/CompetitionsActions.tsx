import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { FaEllipsisH } from "react-icons/fa"

export function DropdownMenuDemo({
  deleteCompetition,
}: {
  deleteCompetition: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-snd-bkg hover:text-red-900 rounded-full p-2 bg-gray-200 hover:bg-gray-300 transition-colors duration-150 ease-in-out">
          <FaEllipsisH />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto min-w-full bg-white shadow-lg rounded-md overflow-hidden border border-gray-200">
        {/* <DropdownMenuLabel className="px-4 py-2 text-sm font-semibold text-gray-600 border-b border-gray-100">
          Options
        </DropdownMenuLabel> */}
        <DropdownMenuGroup className="py-1">
          {/* <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 ease-in-out">
            Edit Weight
          </DropdownMenuItem> */}
          <DropdownMenuItem
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 ease-in-out"
            onClick={deleteCompetition}
          >
            Delete Competition
          </DropdownMenuItem>
          {/* <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 ease-in-out">
            Add Weight To Goal
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownMenuDemo
