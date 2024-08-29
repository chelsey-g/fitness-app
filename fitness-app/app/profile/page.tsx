"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Navigation from "@/components/Navigation"
import UploadPicture from "@/components/UploadPicture"
import UsernamePassword from "@/components/UsernamePassword"
import { createClient } from "@/utils/supabase/client"
import useSWR from "swr"
import { useState } from "react"

export default function ProfileDashboard() {
  const supabase = createClient()
  const [user, setUser] = useState(null)
  const [selectedProfileCard, setSelectedProfileCard] =
    useState("Account Settings")
  const [isOpen, setIsOpen] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  const {
    data: userInfo,
    error: userError,
    isLoading: userLoading,
  } = useSWR("/user", () =>
    supabase.auth.getUser().then((res) => res.data.user)
  )

  const {
    data: profiles,
    error: profilesError,
    isLoading: profilesLoading,
  } = useSWR("/profiles", () =>
    userInfo && userInfo.identities
      ? supabase
          .from("profiles")
          .select("*")
          .eq("id", userInfo.identities[0].id)
          .single()
          .then((res) => res.data)
      : null
  )

  const handleEditModal = () => {
    if (profiles && profiles[0]) {
      setFirstName(profiles[0].first_name)
      setLastName(profiles[0].last_name)
    }
    setIsOpen(true)
  }

  const handleProfileUpdate = async (e: any) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
      })
      .eq("id", userInfo?.id)
    if (error) {
      console.error("Error updating profile:", error.message)
    } else {
      console.log("Profile updated successfully:", data)
    }
    setIsOpen(false)
  }

  let cardContent
  if (selectedProfileCard === "Account Settings") {
    cardContent = (
      <Card className="border rounded-lg shadow-md">
        <CardHeader className="bg-gray-100 py-4 px-6">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Account Settings
          </CardTitle>
          <CardDescription className="text-gray-600">
            Edit your personal information and preferences
          </CardDescription>
        </CardHeader>

        <CardContent className="py-6 px-6">
          {profiles && (
            <>
              <div className="border-b pb-4 mb-4 flex justify-between items-center">
                <div className="flex">
                  <p className="text-gray-700 font-semibold pr-4">Name:</p>
                  <p className="text-gray-700">
                    {profiles?.first_name} {profiles?.last_name}
                  </p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <button
                      onClick={handleEditModal}
                      className="text-sm px-4 py-2 bg-snd-bkg text-white rounded hover:bg-gray-600"
                    >
                      Edit
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-white">
                    <DialogHeader>
                      <DialogTitle>Edit Name</DialogTitle>
                      <DialogDescription>
                        Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="first_name" className="text-right">
                          First Name
                        </Label>
                        <Input
                          id="first_name"
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="last_name" className="text-right">
                          Last Name
                        </Label>
                        <Input
                          id="last_name"
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        className="bg-snd-bkg text-white"
                        onClick={handleProfileUpdate}
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="border-b pb-4 mb-4">
                <UploadPicture />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    )
  } else if (selectedProfileCard === "Login & Security") {
    cardContent = (
      <Card>
        <UsernamePassword />
      </Card>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-row gap-4 bg-white rounded-lg p-4 md:gap-8 md:p-10">
        <div className="flex flex-col w-1/4">
          <nav className="flex flex-col gap-4 text-sm text-muted-foreground">
            <button
              className={`font-semibold text-left ${
                selectedProfileCard === "Account Settings" ? "text-primary" : ""
              }`}
              onClick={() => setSelectedProfileCard("Account Settings")}
            >
              Account Settings
            </button>
            <button
              className={`text-left ${
                selectedProfileCard === "Login & Security" ? "text-primary" : ""
              }`}
              onClick={() => setSelectedProfileCard("Login & Security")}
            >
              Login & Security
            </button>
          </nav>
        </div>
        <div className="flex flex-col w-3/4">
          <div className="grid w-full max-w-6xl">
            {profiles && profiles[0] && (
              <h1 className="text-3xl font-semibold">
                {profiles[0]?.first_name} {profiles[0]?.last_name}
              </h1>
            )}
          </div>
          <div className="grid gap-6">{cardContent}</div>
        </div>
      </main>
    </div>
  )
}
