"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import useSWR from "swr"
import { useState } from "react"

export default function ProfileDropDown() {
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient()

  const { data: user } = useSWR("/user", () =>
    supabase.auth.getUser().then((res) => res.data)
  )

  const fileName = user?.user.id
  const { data: name } = supabase.storage
    .from("habit-kick/profile-pictures")
    .getPublicUrl(fileName)

  console.log("name", name)
  console.log(user, "userrrrrr")

  function handleSignOutUser() {
    const { error } = supabase.auth.signOut()
    if (error) console.error("Sign out error", error)
  }

  return (
    <div className="flex items-center pl-4">
      <div className="relative flex items-center inline-block text-left">
        <DropdownMenu isOpen={isOpen} setIsOpen={setIsOpen}>
          <DropdownMenuTrigger>
            <img
              src={name.publicUrl || "/images/profile-stock.jpg"}
              alt="Profile Picture"
              className="w-10 h-10 rounded-full ml-2"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="absolute -right-7 z-10 w-46 mt-2 origin-top-right bg-white rounded-md shadow-lg">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <DropdownMenuLabel className="font-normal">
                  <Link href="/profile">Profile</Link>
                </DropdownMenuLabel>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DropdownMenuLabel
                  className="font-normal"
                  onClick={handleSignOutUser}
                >
                  Logout
                </DropdownMenuLabel>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
