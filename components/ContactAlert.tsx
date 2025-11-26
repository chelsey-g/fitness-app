import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { FaCheckCircle } from "react-icons/fa"

export default function SubmitContactAlert() {
  return (
    <Alert
      className="bg-green-100 border-l-4 border-green-500 text-green-700 p-2 rounded-md shadow-md"
      role="alert"
    >
      <div className="flex items-center">
        <FaCheckCircle className="flex-shrink-0 w-4 h-4 text-green-500 mr-2" />
        <div>
          <AlertTitle className="font-bold text-md" data-testid="green-check">
            Form Submitted
          </AlertTitle>
          <AlertDescription className="mt-1 text-sm">
            Your contact form has been submitted successfully.
          </AlertDescription>
        </div>
      </div>
    </Alert>
  )
}
