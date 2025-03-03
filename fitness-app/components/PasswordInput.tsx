"use client"

import { useState } from "react"
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"

export default function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        minLength={6}
        required
        className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-logo-green focus:border-logo-green dark:text-black"
        placeholder="••••••••"
        autoComplete="new-password"
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <IoEyeOffOutline className="h-5 w-5 text-gray-500" />
        ) : (
          <IoEyeOutline className="h-5 w-5 text-gray-500" />
        )}
      </button>
    </div>
  )
}
