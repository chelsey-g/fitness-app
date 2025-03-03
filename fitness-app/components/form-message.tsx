import { HiCheckCircle, HiXCircle } from "react-icons/hi"

export type Message =
  | { success: string }
  | { error: string }
  | { message: string }

export function FormMessage({ message }: { message: Message }) {
  if (!message) return null

  return (
    <div className="mt-6">
      {"success" in message && (
        <div className="p-4 rounded-md bg-green-50 text-green-700 border border-green-200">
          <div className="flex items-center gap-2">
            <HiCheckCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{message.success}</p>
          </div>
        </div>
      )}
      {"error" in message && (
        <div className="p-4 rounded-md bg-red-50 text-red-700 border border-red-200">
          <div className="flex items-center gap-2">
            <HiXCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{message.error}</p>
          </div>
        </div>
      )}
      {"message" in message && (
        <div className="p-4 rounded-md bg-green-50 text-green-700 border border-green-200">
          <div className="flex items-center gap-2">
            <HiCheckCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{message.message}</p>
          </div>
        </div>
      )}
    </div>
  )
}
