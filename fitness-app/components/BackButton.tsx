"use client"

import { useRouter } from "next/navigation"

export default function BackButton() {
  const router = useRouter()
  return (
    <div>
      <button
        className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:outline-none mt-5 text-center"
        type="button"
        onClick={() => router.back()}
      >
        Back
      </button>
    </div>
  )
}
