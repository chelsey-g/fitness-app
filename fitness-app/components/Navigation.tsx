"use client"
import React, { useEffect, useState, useRef } from "react"
import { IoIosArrowDown, IoLogoGithub } from "react-icons/io"
import { RxHamburgerMenu } from "react-icons/rx"
import Link from "next/link"
import Profile from "@/components/Profile"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import DarkModeToggle from "@/components/DarkModeToggle"

const DROPDOWN_ITEMS = [
  {
    id: "tracker",
    label: "Tracker",
    links: [
      { href: "/tracker", label: "Weight Log" },
      { href: "/tracker/chart", label: "Weight Tracker" },
    ],
  },
  {
    id: "competitions",
    label: "Competitions",
    links: [
      { href: "/competitions/create", label: "Create Competition" },
      { href: "/competitions", label: "Active Competitions" },
      { href: "/competitions/history", label: "Competition History" },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    links: [
      { href: "/calculator", label: "BMI Calculator" },
      { href: "/calculator/calorie", label: "Calorie Calculator" },
      { href: "/recipes", label: "Recipe Finder" },
    ],
  },
]

export default function Navigation() {
  const supabase = createClient()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

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
    setIsMenuOpen((prev) => !prev)
  }

  const handleMouseEnter = (id: string) => {
    if (window.innerWidth >= 1024) setOpenDropdown(id)
  }

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) setOpenDropdown(null)
  }

  const handleDropdownToggle = (id: string) => {
    if (window.innerWidth < 1024) {
      setOpenDropdown((prev) => (prev === id ? null : id))
    }
  }

  async function handleSignOutUser() {
    const { error } = await supabase.auth.signOut()
    if (error) console.error("Sign out error", error)
    router.push("/")
  }

  return (
    <nav className="bg-mint-cream dark:bg-black dark:text-white p-4 font-sans font-bold shadow-md border-b">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between">
        <Link
          href={isLoggedIn ? "/dashboard" : "/"}
          className="flex items-center space-x-3"
        >
          <img src="/images/text-logo.png" alt="Logo" className="h-8" />
        </Link>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-4">
          <button onClick={toggleMenu} className="text-xl">
            <RxHamburgerMenu />
          </button>
          <Link href="https://github.com/chelsey-g/fitness-app">
            <IoLogoGithub className="w-5 h-5 text-gray-600 dark:text-gray-200 cursor-pointer" />
          </Link>
          <DarkModeToggle />
        </div>

        {/* Desktop View */}
        <div
          className="lg:flex items-center space-x-6 hidden font-sans"
          ref={dropdownRef}
        >
          {isLoggedIn ? (
            <>
              {DROPDOWN_ITEMS.map((dropdown) => (
                <div
                  className="relative"
                  key={dropdown.id}
                  onMouseEnter={() => handleMouseEnter(dropdown.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => handleDropdownToggle(dropdown.id)}
                    className="flex items-center space-x-2"
                  >
                    <span>{dropdown.label}</span>
                    <IoIosArrowDown />
                  </button>
                  {openDropdown === dropdown.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg z-10 text-sm rounded transition duration-00 ease-in-out transform scale-95">
                      {dropdown.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="relative">
                <Link href="/goals" className="block px-4 py-2">
                  Goals
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <IoLogoGithub className="w-5 h-5 text-gray-600 dark:text-gray-200 cursor-pointer" />
                <Profile />
                <DarkModeToggle />
              </div>
            </>
          ) : (
            <div className="flex space-x-4 items-center">
              <Link
                href="/signup"
                className="px-4 py-2 rounded-md bg-logo-green dark:bg-snd-bkg text-black dark:text-white font-medium hover:opacity-90"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="font-medium dark:text-white hover:opacity-90 border border-dashed border-logo-green rounded-md px-4 py-2"
              >
                Login
              </Link>
              <DarkModeToggle />
              <Link href="https://github.com/chelsey-g/fitness-app">
                <IoLogoGithub className="w-8 h-8 text-gray-600 dark:text-gray-200 cursor-pointer" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 space-y-2">
          {isLoggedIn ? (
            <>
              {DROPDOWN_ITEMS.map((dropdown) => (
                <div key={dropdown.id}>
                  <button
                    onClick={() => handleDropdownToggle(dropdown.id)}
                    className="flex items-center justify-between w-full px-4 py-2 bg-gray-700 text-left"
                  >
                    <span>{dropdown.label}</span>
                    <IoIosArrowDown />
                  </button>
                  {openDropdown === dropdown.id && (
                    <div className="mt-2 space-y-1 bg-gray-700">
                      {dropdown.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-4 py-2 text-sm hover:bg-gray-600"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={handleSignOutUser}
                className="block px-4 py-2 bg-gray-700 text-left hover:bg-gray-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="block px-4 py-2 bg-logo-green text-left hover:text-opacity-25 text-black font-medium"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
