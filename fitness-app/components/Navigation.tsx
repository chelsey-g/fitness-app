"use client"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
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
    <div className="bg-trd-bkg p-4 mb-5 mt-8 rounded-lg shadow-md">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link href={isLoggedIn ? "/dashboard" : "/home"}>
            <img
              src="/images/text-logo.png"
              alt="Logo"
              className="w-24 h-auto self-center pr-4 pb-1 cursor-pointer"
            />
          </Link>
          {isLoggedIn ? (
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem className="relative">
                    <NavigationMenuTrigger className="text-white font-bold bg-trd-bkg">
                      Tracker
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-white p-2 rounded-md shadow-lg">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/tracker"
                          className="block px-4 py-2 rounded-md text-xs hover:opacity-80 whitespace-nowrap"
                        >
                          Enter New Weight
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/tracker/chart"
                          className="block px-4 py-2 rounded-md text-xs hover:opacity-80 whitespace-nowrap"
                        >
                          View Weight Log
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem className="relative">
                    <NavigationMenuTrigger className="text-white font-bold hover:text-gray-300 bg-trd-bkg">
                      Competitions
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-white p-2 rounded-md shadow-lg">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/competitions/create"
                          className="block px-4 py-2 rounded-md text-xs hover:opacity-80 whitespace-nowrap"
                        >
                          Create New Competition
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/competitions"
                          className="block px-4 py-2 rounded-md text-xs hover:opacity-80 whitespace-nowrap"
                        >
                          View Active Competitions
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/competitions/history"
                          className="block px-4 py-2 rounded-md text-xs hover:opacity-80 whitespace-nowrap"
                        >
                          View Competition History
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem className="relative">
                    <NavigationMenuTrigger className="text-white font-bold bg-trd-bkg">
                      Workouts
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-white p-2 rounded-md shadow-lg">
                      {/* <NavigationMenuLink asChild>
                        <Link
                          href="/workouts"
                          className="block px-4 py-2 rounded-md text-xs hover:opacity-80 whitespace-nowrap"
                        >
                          Create New Workout
                        </Link>
                      </NavigationMenuLink> */}
                      <NavigationMenuLink asChild>
                        <Link
                          href="/workouts"
                          className="block px-4 py-2 rounded-md text-xs hover:opacity-80 whitespace-nowrap"
                        >
                          View Workouts
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem className="relative">
                    <NavigationMenuTrigger className="text-white font-bold bg-trd-bkg">
                      Goals
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-white p-2 rounded-md shadow-lg">
                      {/* <NavigationMenuLink asChild>
                        <Link
                          href="/goals"
                          className="block px-4 py-2 rounded-md text-xs hover:opacity-80 whitespace-nowrap"
                        >
                          Create New Goal
                        </Link>
                      </NavigationMenuLink> */}
                      <NavigationMenuLink asChild>
                        <Link
                          href="/goals"
                          className="block px-4 py-2 rounded-md text-xs hover:opacity-80 whitespace-nowrap"
                        >
                          View Active Goals
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem className="relative">
                    <NavigationMenuTrigger className="text-white font-bold hover:text-gray-300 bg-trd-bkg">
                      Tools
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-white p-2 rounded-md shadow-lg">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/calculator"
                          className="block px-4 py-2 rounded-md text-xs hover:opacity-80 whitespace-nowrap"
                        >
                          BMI Calculator
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <Profile />
            </div>
          ) : (
            <div className="flex space-x-4 items-center font-bold font-sans">
              <Link href="/contact" className="text-white hover:opacity-80">
                Contact
              </Link>
              <Link href="/login" className="text-white hover:opacity-80">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
