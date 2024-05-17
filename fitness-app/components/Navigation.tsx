"use client"

import { useEffect, useState } from "react"

import Link from "next/link"
import Profile from "@/components/Profile"
import { createClient } from "@/utils/supabase/client"

export default function Navigation() {
  const supabase = createClient()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
          setIsLoggedIn(!!session)
        }
      }
    )
  }, [supabase])

  return (
    <nav className="bg-trd-bkg p-4 mb-5 mt-8 rounded-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link href={isLoggedIn ? "/dashboard" : "/home"}>
            <img
              src="/images/text-logo.png"
              alt="Logo"
              className="w-24 h-auto self-center pr-4 pb-1"
            />
          </Link>

          <ul className="flex space-x-4 items-center font-bold font-sans">
            {isLoggedIn ? (
              <>
                <li>
                  <Link
                    href="/tracker"
                    className="text-white hover:text-gray-300"
                  >
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
                  <Link
                    href="/workouts"
                    className="text-white hover:text-gray-300"
                  >
                    Workouts
                  </Link>
                </li>
                <li>
                  <Link
                    href="/goals"
                    className="text-white hover:text-gray-300"
                  >
                    Goals
                  </Link>
                </li>
                <Profile />
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/contact"
                    className="text-white hover:text-gray-300"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-white hover:text-gray-300"
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
