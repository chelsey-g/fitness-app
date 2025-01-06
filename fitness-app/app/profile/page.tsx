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
  const [selectedProfileCard, setSelectedProfileCard] =
    useState("Account Settings")
  const [isOpen, setIsOpen] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  const { data: userInfo } = useSWR("/user", () =>
    supabase.auth.getUser().then((res) => res.data.user)
  )

  const { data: profile } = useSWR("/profile", () =>
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
    if (profile) {
      setFirstName(profile.first_name)
      setLastName(profile.last_name)
    }
    setIsOpen(true)
  }

  const handleProfileUpdate = async (e: any) => {
    e.preventDefault()
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
      })
      .eq("id", userInfo?.id)

    if (error) {
      console.error("Error updating profile:", error.message)
    } else {
      setIsOpen(false)
    }
  }

  const cardContent =
    selectedProfileCard === "Account Settings" ? (
      <Card className="border rounded-lg shadow-lg">
        <CardHeader className="bg-gray-100 py-4 px-6">
          <CardTitle className="text-2xl font-bold text-nav-bkg">
            Account Settings
          </CardTitle>
          <CardDescription className="text-gray-700">
            Edit your personal information and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-6 px-6">
          {profile && (
            <>
              <div className="border-b pb-4 mb-4 flex justify-between items-center">
                <div>
                  <p className="text-gray-600">Name:</p>
                  <p className="font-semibold text-gray-800">
                    {profile.first_name} {profile.last_name}
                  </p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <button
                      onClick={handleEditModal}
                      className="relative bg-button-bkg text-nav-bkg font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                      Edit
                      <div className="absolute inset-0 rounded-lg bg-button-hover opacity-0 hover:opacity-20 transition duration-300"></div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg p-6">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold text-gray-900">
                        Edit Name
                      </DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Make changes to your name and click save.
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
                        className="relative bg-button-bkg text-nav-bkg font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
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
    ) : (
      <Card className="border rounded-lg shadow-lg">
        <UsernamePassword />
      </Card>
    )

  return (
    <div className="w-full min-h-screen">
      <Navigation />
      <div className="max-w-5xl mx-auto mt-6 bg-white rounded-lg shadow-lg p-6 flex gap-8">
        <nav className="flex flex-col gap-4 w-1/4">
          <button
            className={`font-semibold text-left ${
              selectedProfileCard === "Account Settings" ? "text-snd-bkg" : ""
            }`}
            onClick={() => setSelectedProfileCard("Account Settings")}
          >
            Account Settings
          </button>
          <button
            className={`text-left ${
              selectedProfileCard === "Login & Security" ? "text-snd-bkg" : ""
            }`}
            onClick={() => setSelectedProfileCard("Login & Security")}
          >
            Login & Security
          </button>
        </nav>
        <div className="flex flex-col w-3/4">{cardContent}</div>
      </div>
    </div>
  )
}
