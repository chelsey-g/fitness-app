"use client"

import { useEffect, useState, useRef } from "react"
import { IoIosArrowDown } from "react-icons/io"
import { RxHamburgerMenu } from "react-icons/rx"
import {
  FaChartLine,
  FaBullseye,
  FaTrophy,
  FaUtensils,
  FaSignOutAlt,
  FaUserCog,
} from "react-icons/fa"
import { FaWeightScale } from "react-icons/fa6"
import Link from "next/link"
import Profile from "@/components/Profile"
import { useRouter } from "next/navigation"
import DarkModeToggle from "@/components/DarkModeToggle"
import { useAuth } from "@/contexts/AuthContext"

const dropdown = [
  {
    id: "tracker",
    label: "Tracker",
    links: [
      { href: "/weight-log", label: "Weight Log" },
      { href: "/weight-chart", label: "Weight Chart" },
    ],
  },
  // {
  //   id: "competitions",
  //   label: "Competitions",
  //   links: [
  //     { href: "/competitions/create", label: "Create Competition" },
  //     { href: "/competitions", label: "Competitions" },
  //     { href: "/competitions/history", label: "Competition History" },
  //   ],
  // },
  {
    id: "goals",
    label: "Goals",
    links: [{ href: "/goals", label: "Goals" }],
  },
  {
    id: "challenges",
    label: "Challenges",
    links: [{ href: "/challenges", label: "Challenges" }],
  },
  {
    id: "tools",
    label: "Tools",
    links: [
      { href: "/calculator", label: "BMI Calculator" },
      { href: "/recipes", label: "Recipe Search" },
    ],
  },
]

const icons = {
  tracker: FaChartLine,
  goals: FaBullseye,
  competitions: FaTrophy,
  calculator: FaWeightScale,
  recipes: FaUtensils,
}

export default function Navigation() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const { user, signOut, isLoading } = useAuth()

  const dropdownRefs = useRef<Record<string, HTMLElement | null>>({})

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  const toggleDropdown = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id))
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        openDropdown &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown]?.contains(target)
      ) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openDropdown])

  const Dropdown = ({ id, label, links }: any) => (
    <div className="relative" ref={(el) => (dropdownRefs.current[id] = el)}>
      <button
        onClick={() => toggleDropdown(id)}
        className="flex items-center space-x-2"
      >
        <span>{label}</span>
        <IoIosArrowDown />
      </button>
      {openDropdown === id && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded z-10">
          {links.map(({ href, label }: any) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpenDropdown(null)}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <nav className="bg-mint-cream dark:bg-black p-4 shadow-md">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between">
        <Link href={user ? "/dashboard" : "/"}>
          <img src="/images/text-logo.png" alt="Logo" className="h-8" />
        </Link>

        <div className="lg:hidden flex items-center space-x-4">
          <button onClick={toggleMenu} className="text-xl">
            <RxHamburgerMenu />
          </button>
          <DarkModeToggle />
        </div>

        <div className="hidden lg:flex items-center space-x-6 tracking-tight font-semi-bold">
          {isLoading ? (
            <div className="animate-pulse">Loading...</div>
          ) : user ? (
            <>
              {dropdown
                .filter((item) => item.id !== "goals")
                .map((item) => (
                  <Dropdown key={item.id} {...item} />
                ))}
              <Link href="/goals" className="px-4 py-2">
                Goals
              </Link>
              <div className="flex items-center space-x-4">
                <Profile />
                <DarkModeToggle />
              </div>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="px-4 py-2 bg-logo-green text-black rounded-md hover:opacity-90"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 border border-dashed rounded-md hover:opacity-90"
              >
                Login
              </Link>
              <DarkModeToggle />
            </>
          )}
        </div>
      </div>
      {isMenuOpen && (
        <div className="lg:hidden mt-4 bg-black rounded-lg shadow-xl border border-gray-800 p-6 space-y-4 backdrop-blur-sm">
          {isLoading ? (
            <div className="text-center animate-pulse text-white">Loading...</div>
          ) : user ? (
            <>
              <div className="space-y-4">
                {dropdown.flatMap(({ id, links }) =>
                  links
                    .filter(({ href }) =>
                      [
                        "/competitions",
                        "/weight-chart",
                        "/goals",
                        "/calculator",
                      ].includes(href)
                    )
                    .map(({ href, label }) => {
                      const Icon = icons[id as keyof typeof icons] || FaUtensils
                      return (
                        <div key={href}>
                          <Link
                            href={href}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-lg rounded-lg hover:bg-gray-900 hover:scale-105 transition-all duration-300 ease-in-out text-white hover:text-logo-green hover:shadow-lg transform active:scale-95"
                          >
                            <Icon className="text-logo-green text-xl transition-transform duration-300 hover:rotate-12" />
                            <span className="font-medium">{label}</span>
                          </Link>
                        </div>
                      )
                    })
                )}
                <div className="border-t border-gray-800 my-4" />
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-lg rounded-lg hover:bg-gray-900 hover:scale-105 transition-all duration-300 ease-in-out text-white hover:text-logo-green hover:shadow-lg transform active:scale-95"
                >
                  <FaUserCog className="text-logo-green text-xl transition-transform duration-300 hover:rotate-12" />
                  <span className="font-medium">Profile</span>
                </Link>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center space-x-3 w-full px-4 py-3 bg-red-600 text-white text-lg font-medium rounded-lg hover:bg-red-700 hover:scale-105 transition-all duration-300 ease-in-out shadow-md hover:shadow-xl transform active:scale-95"
              >
                <FaSignOutAlt className="transition-transform duration-300 hover:rotate-12" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <Link
                href="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full px-6 py-3 bg-logo-green text-black text-lg font-medium text-center rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-300 ease-in-out shadow-md hover:shadow-xl transform active:scale-95"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full px-6 py-3 border-2 border-logo-green text-logo-green text-lg font-medium text-center rounded-lg hover:bg-logo-green hover:text-black hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-lg transform active:scale-95"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
