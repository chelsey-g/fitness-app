import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { FaTrashAlt } from "react-icons/fa"

export default function SubmitWorkoutAlert() {
  return (
    <Alert
      className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded-md shadow-md"
      role="alert"
    >
      <div className="flex items-center">
        <FaTrashAlt className="flex-shrink-0 w-4 h-4 text-red-500 mr-2" />
        <div>
          <AlertTitle className="font-bold text-md">Workout Deleted</AlertTitle>
          <AlertDescription className="mt-1 text-sm">
            Your workout list has been deleted successfully.
          </AlertDescription>
        </div>
      </div>
    </Alert>
  )
}
