"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useSWR, { Fetcher } from "swr"

import ImageWithFallback from "@/components/ImageWithFallback"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaRegUserCircle } from "react-icons/fa"

interface Profile {
  first_name: string
  last_name: string
}

export default function ProfileDropDown() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const supabase = createClient()

  const { data: user } = useSWR("/user", () =>
    supabase.auth.getUser().then((res) => res.data.user)
  )

  let identityId = user?.identities?.[0]?.id || null

  const fetcher: Fetcher<Profile[], string> = async (url: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", identityId)
    if (error) {
      throw new Error(error.message)
    }
    return data
  }

  const { data: profiles } = useSWR<Profile[]>("/profiles", fetcher)

  const fileName = user?.id || "profile-image"
  const { data: name } = supabase.storage
    .from("habit-kick/profile-pictures")
    .getPublicUrl(fileName)

  const fallbackSrc = <FaRegUserCircle className="w-5 h-5" />

  async function handleSignOutUser() {
    const { error } = await supabase.auth.signOut()
    if (error) console.error("Sign out error", error)
    router.push("/")
  }

  return (
    <div className="">
      <div
        className="relative inline-block text-left"
        data-testid="profile-dropdown"
      >
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger>
            <ImageWithFallback
              key={name.publicUrl || ""}
              src={name.publicUrl || ""}
              alt="profile picture"
              fallbackSrc={fallbackSrc}
              width={5}
              height={5}
              className="w-5 h-5 rounded-full items-center justify-center mt-2 focus:none"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="relative right-20 z-10 w-60 mt-2 origin-top-right bg-white rounded-md shadow-lg">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <div className="px-4 py-2 border-b">
                  <div className="flex items-center">
                    <ImageWithFallback
                      key={name.publicUrl || ""}
                      src={name.publicUrl || ""}
                      alt="profile picture"
                      fallbackSrc={fallbackSrc}
                      width={7}
                      height={7}
                      className="w-7 h-7 rounded-full mr-5"
                    />

                    {profiles && (
                      <div>
                        <div className="text-sm text-gray-700 font-semibold">
                          {profiles[0]?.first_name} {profiles[0]?.last_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user?.email}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="px-4 py-2 dark:text-black hover:underline">
                  <Link href="/profile">Profile</Link>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="px-4 py-2 dark:text-black hover:underline">
                  <Link href="/contact">Contact Us</Link>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="px-4 py-2 dark:text-black">
                  <button
                    onClick={handleSignOutUser}
                    className="block w-full text-left text-sm text-gray-800 hover:underline"
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
