"use client"

import { IoArrowBack } from "react-icons/io5"
import { useRouter } from "next/navigation"

export default function BackButton() {
  const router = useRouter()
  return (
    <div>
      <IoArrowBack
        className=" hover:opacity-90 rounded ml-auto cursor-pointer"
        onClick={() => router.back()}
      ></IoArrowBack>
    </div>
  )
}
