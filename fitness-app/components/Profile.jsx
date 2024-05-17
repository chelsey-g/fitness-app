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
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { useState } from "react"

export default function ProfileDropDown() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient()

  const { data: user } = useSWR("/user", () =>
    supabase.auth.getUser().then((res) => res.data.user)
  )

  let identityId = user?.identities?.[0]?.id || null

  const { data: profiles } = useSWR(
    identityId ? "/profiles/" + identityId : null,
    () =>
      supabase
        .from("profiles")
        .select("*")
        .eq("id", identityId)
        .then((res) => res.data)
  )

  console.log("user", user)
  console.log("profiles", profiles)

  const fileName = user?.id
  const { data: name } = supabase.storage
    .from("habit-kick/profile-pictures")
    .getPublicUrl(fileName)

  function handleSignOutUser() {
    const { error } = supabase.auth.signOut()
    if (error) console.error("Sign out error", error)
    router.push("/home")
  }

  return (
    <div className="flex items-center pl-4">
      <div className="relative inline-block text-left">
        <DropdownMenu isOpen={isOpen} setIsOpen={setIsOpen}>
          <DropdownMenuTrigger>
            <img
              src={name.publicUrl || "/images/profile-stock.jpg"}
              alt="Profile Picture"
              className="w-10 h-10 rounded-full ml-2 cursor-pointer"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="relative right-20 z-10 w-60 mt-2 origin-top-right bg-white rounded-md shadow-lg">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <div className="px-4 py-2 border-b">
                  <div className="flex items-center">
                    <img
                      src={name.publicUrl || "/images/profile-stock.jpg"}
                      alt="Profile Picture"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="text-sm text-gray-700 font-semibold">
                        {profiles[0]?.first_name} {profiles[0]?.last_name}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="px-4 py-2">
                  <Link href="/profile">Profile</Link>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="px-4 py-2">
                  <Link href="/contact">Contact Us</Link>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="px-4 py-2">
                  <button
                    onClick={handleSignOutUser}
                    className="block w-full text-left text-sm text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
