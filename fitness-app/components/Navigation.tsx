"use client"

import { useEffect, useState } from "react"

import Link from "next/link"
import Profile from "@/components/Profile"

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  function checkLoggedIn() {
    const token = localStorage.getItem("token")
    if (token) {
      setIsLoggedIn(true)
    }
  }
  useEffect(() => {
    checkLoggedIn()
  }, [])

  return (
    <nav className="bg-trd-bkg p-4 mb-5 mt-8 rounded-lg ">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <img
            src="/images/text-logo.png"
            alt="Logo"
            className="w-24 h-auto self-center pr-4 pb-1"
          />
          <ul className="flex space-x-4 items-center font-bold font-sans">
            <li>
              <Link href="/home" className="text-white hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/tracker" className="text-white hover:text-gray-300">
                Tracker
              </Link>
            </li>
            <li>
              <Link
                href="/competitions"
                className="text-white hover:text-gray-300"
              >
                Competitions
              </Link>
            </li>
            <li>
              <a href="/workouts" className="text-white hover:text-gray-300">
                Workouts
              </a>
            </li>
            {!isLoggedIn && (
              <li>
                <Link href="/login" className="text-white hover:text-gray-300">
                  Login
                </Link>
              </li>
            )}
            <li>
              <Link href="/contact" className="text-white hover:text-gray-300">
                Contact
              </Link>
            </li>
          </ul>
          {isLoggedIn && <Profile />}
        </div>
      </div>
    </nav>
  )
}
