"use client"

import { FiMenu, FiX } from "react-icons/fi"
import React, { useEffect, useState, useRef } from "react"

import { IoIosArrowDown } from "react-icons/io"
import Link from "next/link"
import Profile from "@/components/Profile"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function Navigation() {
  const supabase = createClient()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(null)

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  const toggleDropdown = (menu) => {
    setIsDropdownOpen((prev) => (prev === menu ? null : menu))
  }
  const closeDropdown = () => {
    setIsDropdownOpen(null)
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown()
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [])

  async function handleSignOutUser() {
    const { error } = await supabase.auth.signOut()
    if (error) console.error("Sign out error", error)
    router.push("/")
  }

  return (
    <nav className="bg-nav-bkg text-white p-4 font-sans font-bold">
      {/* border-b border-footer-bkg */}
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <Link
          href={isLoggedIn ? "/dashboard" : "/"}
          className="flex items-center space-x-3"
        >
          <img src="/images/text-logo.png" alt="Logo" className="h-8" />
        </Link>
        <div className="lg:hidden">
          <button onClick={toggleMenu}>
            {isMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        <div
          className={`lg:flex items-center space-x-6 hidden font-sans`}
          ref={dropdownRef}
        >
          {isLoggedIn ? (
            <>
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("tracker")}
                  className="flex items-center space-x-2"
                >
                  <span>Tracker</span>
                  <IoIosArrowDown />
                </button>
                {isDropdownOpen === "tracker" && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg z-10 text-sm rounded">
                    <Link
                      href="/tracker"
                      className="block px-4 py-2 hover:bg-gray-100 hover:rounded"
                    >
                      Weight Log
                    </Link>
                    <Link
                      href="/tracker/chart"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Weight Tracker
                    </Link>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("competitions")}
                  className="flex items-center space-x-2"
                >
                  <span>Competitions</span>
                  <IoIosArrowDown />
                </button>
                {isDropdownOpen === "competitions" && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg z-10 text-sm rounded">
                    <Link
                      href="/competitions/create"
                      className="block px-4 py-2 hover:bg-gray-100 hover:rounded"
                    >
                      Create Competition
                    </Link>
                    <Link
                      href="/competitions"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Active Competitions
                    </Link>
                    <Link
                      href="/competitions/history"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Competition History
                    </Link>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => toggleDropdown("workouts")}
                  className="flex items-center space-x-2"
                >
                  <span>Workouts</span>
                  <IoIosArrowDown />
                </button>
                {isDropdownOpen === "workouts" && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg z-10 text-sm">
                    <Link
                      href="/workouts/browse"
                      className="block px-4 py-2 hover:bg-gray-100 hover:rounded"
                    >
                      Browse Exercises
                    </Link>
                    <Link
                      href="/workouts"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      View Workouts
                    </Link>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("tools")}
                  className="flex items-center space-x-2"
                >
                  <span>Tools</span>
                  <IoIosArrowDown />
                </button>
                {isDropdownOpen === "tools" && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg z-10 text-sm rounded">
                    <Link
                      href="/calculator"
                      className="block px-4 py-2 hover:bg-gray-100 hover:rounded"
                    >
                      BMI Calculator
                    </Link>
                    <Link
                      href="/calculator/calorie"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Calorie Calculator
                    </Link>
                    <Link
                      href="/recipes"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Recipe Finder
                    </Link>
                  </div>
                )}
              </div>

              <div className="relative">
                <button>
                  <Link href="/goals" className="block px-4 py-2">
                    Goals
                  </Link>
                </button>
              </div>
              <Profile />
            </>
          ) : (
            <div className="flex space-x-4">
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
      {isMenuOpen && (
        <div className="lg:hidden mt-4 space-y-2">
          {isLoggedIn ? (
            <>
              <div>
                <button
                  onClick={() => toggleDropdown("tracker")}
                  className="flex items-center justify-between w-full px-4 py-2 bg-gray-700 text-left"
                >
                  <span>Tracker</span>
                  <IoIosArrowDown />
                </button>
                {isDropdownOpen === "tracker" && (
                  <div className="mt-2 space-y-1 bg-gray-700">
                    <Link
                      href="/tracker"
                      className="block px-4 py-2 text-sm hover:bg-gray-600"
                    >
                      Enter New Weight
                    </Link>
                    <Link
                      href="/tracker/chart"
                      className="block px-4 py-2 text-sm hover:bg-gray-600"
                    >
                      View Weight Log
                    </Link>
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => toggleDropdown("competitions")}
                  className="flex items-center justify-between w-full px-4 py-2 bg-gray-700 text-left"
                >
                  <span>Competitions</span>
                  <IoIosArrowDown />
                </button>
                {isDropdownOpen === "competitions" && (
                  <div className="mt-2 space-y-1 bg-gray-700">
                    <Link
                      href="/competitions/create"
                      className="block px-4 py-2 text-sm hover:bg-gray-600"
                    >
                      Create New Competition
                    </Link>
                    <Link
                      href="/competitions"
                      className="block px-4 py-2 text-sm hover:bg-gray-600"
                    >
                      View Active Competitions
                    </Link>
                    <Link
                      href="/competitions/history"
                      className="block px-4 py-2 text-sm hover:bg-gray-600"
                    >
                      View Competition History
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/profile"
                className="block px-4 py-2 bg-gray-700 text-left hover:bg-gray-600"
              >
                Profile
              </Link>
              <button
                onClick={handleSignOutUser}
                className="block px-4 py-2 bg-gray-700 text-left hover:bg-gray-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/contact"
                className="block px-4 py-2 bg-gray-700 text-left hover:bg-gray-600"
              >
                Contact
              </Link>
              <Link
                href="/login"
                className="block px-4 py-2 bg-gray-700 text-left hover:bg-gray-600"
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
