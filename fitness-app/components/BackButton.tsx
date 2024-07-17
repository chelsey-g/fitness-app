"use client"

import { IoArrowBack } from "react-icons/io5"
import { useRouter } from "next/navigation"

export default function BackButton() {
  const router = useRouter()
  return (
    <button onClick={() => router.back()}>
      <IoArrowBack className=" hover:opacity-90 rounded ml-auto cursor-pointer mr-4 mt-4"></IoArrowBack>
    </button>
  )
}
