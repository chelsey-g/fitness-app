"use client"

import { IoMdArrowRoundBack } from "react-icons/io"
import { useRouter } from "next/navigation"

export default function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      className="absolute top-6 right-6 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 font-bold py-2 px-4 rounded-full shadow transition duration-300"
      title="Go back"
      aria-label="Go back"
    >
      <IoMdArrowRoundBack />
    </button>
  )
}
