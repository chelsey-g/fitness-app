"use client"

import {
  Collapse,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Navbar,
  Typography,
} from "@material-tailwind/react"
import { FiMenu, FiX } from "react-icons/fi"
import React, { useEffect, useState } from "react"

import { IoIosArrowDown } from "react-icons/io"
import Link from "next/link"
import { MdContactSupport } from "react-icons/md"
import { MdOutlineLogin } from "react-icons/md"
import Profile from "@/components/Profile"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function Navigation() {
  const supabase = createClient()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

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

  function handleSignOutUser() {
    const { error } = supabase.auth.signOut()
    if (error) console.error("Sign out error", error)
    router.push("/")
  }

  return (
    <Navbar className="bg-trd-bkg dark:bg-trd-bkg mt-10 mb-10 p-4 border-trd-bkg">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto bg-trd-bkg border-trd-bkg">
        <Link
          href={isLoggedIn ? "/dashboard" : "/home"}
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src="/images/text-logo.png" className="h-8" alt="Logo" />
        </Link>
        <div className="lg:hidden">
          <IconButton
            onClick={toggleMenu}
            className="bg-trd-bkg shadow-none hover:shadow-none mb-5"
          >
            {isMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </IconButton>
        </div>
        <div className="hidden lg:flex lg:items-center lg:w-auto w-full lg:space-x-6">
          <List className="flex flex-col lg:flex-row lg:space-x-6">
            {isLoggedIn ? (
              <>
                <Menu>
                  <MenuHandler>
                    <Typography
                      as="div"
                      className="flex items-center space-x-2 py-2 px-3 cursor-pointer font-bold"
                    >
                      <span>Tracker</span>
                      <IoIosArrowDown className="ml-1" />
                    </Typography>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem>
                      <Link
                        href="/tracker"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        Enter New Weight
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/tracker/chart"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        View Weight Log
                      </Link>
                    </MenuItem>
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuHandler>
                    <Typography
                      as="div"
                      className="flex items-center space-x-2 py-2 px-3 cursor-pointer font-bold"
                    >
                      <span>Competitions</span>
                      <IoIosArrowDown className="ml-1" />
                    </Typography>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem>
                      <Link
                        href="/competitions/create"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        Create New Competition
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/competitions"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        View Active Competitions
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/competitions/history"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        View Competition History
                      </Link>
                    </MenuItem>
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuHandler>
                    <Typography
                      as="div"
                      className="flex items-center space-x-2 py-2 px-3 cursor-pointer font-bold"
                    >
                      <span>Workouts</span>
                      <IoIosArrowDown className="ml-1" />
                    </Typography>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem>
                      <Link
                        href="/workouts/browse"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        Browse Exercises
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/workouts"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        View Workouts
                      </Link>
                    </MenuItem>
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuHandler>
                    <Typography
                      as="div"
                      className="flex items-center space-x-2 py-2 px-3 cursor-pointer font-bold"
                    >
                      <span>Goals</span>
                      <IoIosArrowDown className="ml-1" />
                    </Typography>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem>
                      <Link
                        href="/goals"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        View Active Goals
                      </Link>
                    </MenuItem>
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuHandler>
                    <Typography
                      as="div"
                      className="flex items-center space-x-2 py-2 px-3 cursor-pointer font-bold"
                    >
                      <span>Tools</span>
                      <IoIosArrowDown className="ml-1" />
                    </Typography>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem>
                      <Link
                        href="/calculator"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        BMI Calculator
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/calculator/calorie"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        Calorie Calculator
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/recipes"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        Recipe Finder
                      </Link>
                    </MenuItem>
                  </MenuList>
                </Menu>
                <div className="hidden lg:block">
                  <Profile />
                </div>
              </>
            ) : (
              <ListItem className="flex space-x-4 items-center font-bold font-sans">
                <Link href="/contact" className="text-white hover:opacity-80">
                  Contact
                </Link>
                <Link href="/login" className="text-white hover:opacity-80">
                  Login
                </Link>
              </ListItem>
            )}
          </List>
        </div>
        <Collapse open={isMenuOpen} className="lg:hidden w-full">
          <List className="flex flex-col space-y-4">
            {isLoggedIn ? (
              <>
                <Menu>
                  <MenuHandler>
                    <Typography
                      as="div"
                      className="flex items-center space-x-2 py-2 px-3 cursor-pointer font-bold"
                    >
                      <span>Tracker</span>
                      <IoIosArrowDown className="ml-1" />
                    </Typography>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem>
                      <Link
                        href="/tracker"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        Enter New Weight
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/tracker/chart"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        View Weight Log
                      </Link>
                    </MenuItem>
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuHandler>
                    <Typography
                      as="div"
                      className="flex items-center space-x-2 py-2 px-3 cursor-pointer font-bold"
                    >
                      <span>Competitions</span>
                      <IoIosArrowDown className="ml-1" />
                    </Typography>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem>
                      <Link
                        href="/competitions/create"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        Create New Competition
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/competitions"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        View Active Competitions
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/competitions/history"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        View Competition History
                      </Link>
                    </MenuItem>
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuHandler>
                    <Typography
                      as="div"
                      className="flex items-center space-x-2 py-2 px-3 cursor-pointer font-bold"
                    >
                      <span>Workouts</span>
                      <IoIosArrowDown className="ml-1" />
                    </Typography>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem>
                      <Link
                        href="/workouts/browse"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        Browse Exercises
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/workouts"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        View Workouts
                      </Link>
                    </MenuItem>
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuHandler>
                    <Typography
                      as="div"
                      className="flex items-center space-x-2 py-2 px-3 cursor-pointer font-bold"
                    >
                      <span>Goals</span>
                      <IoIosArrowDown className="ml-1" />
                    </Typography>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem>
                      <Link
                        href="/goals"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        View Active Goals
                      </Link>
                    </MenuItem>
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuHandler>
                    <Typography
                      as="div"
                      className="flex items-center space-x-2 py-2 px-3 cursor-pointer font-bold"
                    >
                      <span>Tools</span>
                      <IoIosArrowDown className="ml-1" />
                    </Typography>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem>
                      <Link
                        href="/calculator"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        BMI Calculator
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/calculator/calorie"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        Calorie Calculator
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/recipes"
                        className="block px-1 py-1 text-sm hover:bg-gray-100 hover:rounded"
                      >
                        Recipe Finder
                      </Link>
                    </MenuItem>
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuHandler>
                    <MenuItem>
                      <Typography
                        as="div"
                        className="flex items-center py-2  cursor-pointer font-bold"
                      >
                        <Link href="/profile" className="">
                          <span>Profile</span>
                        </Link>
                      </Typography>
                    </MenuItem>
                  </MenuHandler>
                </Menu>
                <Menu>
                  <MenuHandler>
                    <MenuItem>
                      <Typography
                        as="div"
                        className="flex items-center py-2  cursor-pointer font-bold"
                      >
                        <button onClick={handleSignOutUser}>
                          <span>Logout</span>
                        </button>
                      </Typography>
                    </MenuItem>
                  </MenuHandler>
                </Menu>
              </>
            ) : (
              <Collapse open={isMenuOpen} className="lg:hidden w-full">
                <Menu>
                  <MenuHandler>
                    <Typography
                      as="div"
                      className="flex items-center py-2 px-3 cursor-pointer font-bold"
                    >
                      <MdContactSupport />
                      <Link
                        href="/contact"
                        className="text-white hover:opacity-80 ml-2"
                      >
                        <span>Contact</span>
                      </Link>
                    </Typography>
                  </MenuHandler>

                  <MenuHandler>
                    <Typography
                      as="div"
                      className="flex items-center space-x-2 py-2 px-3 cursor-pointer font-bold"
                    >
                      <MdOutlineLogin />
                      <Link
                        href="/login"
                        className="text-white hover:opacity-80"
                      >
                        <span>Login</span>
                      </Link>
                    </Typography>
                  </MenuHandler>
                </Menu>
              </Collapse>
            )}
          </List>
        </Collapse>
      </div>
    </Navbar>
  )
}
