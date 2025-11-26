"use client"

import { IoMdAlert } from "react-icons/io"
import { MdError } from "react-icons/md"
import { useSearchParams } from "next/navigation"

export default function Messages() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const message = searchParams.get("message")
  return (
    <>
      {error && (
        <>
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center rounded font-bold flex items-center gap-2 text-sm">
            <MdError />
            {error}
          </p>
        </>
      )}
      {message && (
        <>
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center rounded font-bold flex items-center gap-2 text-sm">
            <IoMdAlert />
            {message}
          </p>
        </>
      )}
    </>
  )
}
