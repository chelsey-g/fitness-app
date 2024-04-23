import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useEffect, useState } from "react"

export default function SubmitAlert() {
  return (
    <Alert
      className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
      role="alert"
    >
      <div className="flex">
        <div>
          <AlertTitle className="font-bold">Workout Created</AlertTitle>
          <AlertDescription>
            Your workout list has been created successfully.
          </AlertDescription>
        </div>
      </div>
    </Alert>
  )
}
