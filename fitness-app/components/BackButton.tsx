"use client"

import { IoClose } from "react-icons/io5"
import { useRouter } from "next/navigation"

export default function BackButton() {
  const router = useRouter()
  return (
    <div>
      <IoClose
        className="bg-prm-bkg hover:opacity-90 rounded flex ml-auto cursor-pointer"
        onClick={() => router.back()}
      ></IoClose>
    </div>
  )
}
