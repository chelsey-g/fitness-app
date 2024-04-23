"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import Goals from "@/components/Goals"
import { Input } from "@/components/ui/input"
import Navigation from "@/components/Navigation"
import UsernamePassword from "@/components/UsernamePassword"
import { createClient } from "@/utils/supabase/client"
import useSWR from "swr"

export default function ProfileDashboard() {
  const supabase = createClient()
  const [user, setUser] = useState(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [selectedProfileCard, setSelectedProfileCard] = useState("General")

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)
    }

    fetchUserData()
  }, [])

  console.log(user)

  const {
    data: profiles,
    error,
    isLoading,
  } = useSWR("/profiles", () =>
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.identities[0].id)
      .then((res) => res.data)
  )
  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
      })
      .eq("id", user.identities[0].id)
    if (error) {
      console.error("Error updating profile:", error.message)
    } else {
      console.log("Profile updated successfully:", data)
    }
  }

  let cardContent
  if (selectedProfileCard === "General") {
    cardContent = (
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Profile Info</CardTitle>
          <CardDescription>
            Edit your personal information and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate}>
            <Input
              className="placeholder-black"
              id="first_name"
              type="text"
              placeholder={profiles[0].first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              className="placeholder-black"
              id="last_name"
              type="text"
              placeholder={profiles[0].last_name}
              onChange={(e) => setLastName(e.target.value)}
            />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex justify-center">
          <Button
            onClick={handleProfileUpdate}
            className="bg-snd-bkg hover:bg-snd-bkg text-white py-3 px-6 rounded-full focus:outline-none text-center"
          >
            Save
          </Button>
        </CardFooter>
      </Card>
    )
  } else if (selectedProfileCard === "Goals") {
    cardContent = (
      <Card x-chunk="dashboard-04-chunk-2">
        <Goals profileInfo={user} />
      </Card>
    )
  } else if (selectedProfileCard === "Username/Password") {
    cardContent = (
      <Card x-chunk="dashboard-04-chunk-2">
        <UsernamePassword />
      </Card>
    )
  }

  return (
    <div className="flex min-h-screen w-3/4 flex-col">
      <Navigation />
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-white rounded-lg p-4 md:gap-8 md:p-10">
        <div className="grid w-full max-w-6xl">
          <h1 className="text-3xl font-semibold">Profile</h1>
        </div>
        <div className="grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr] align-left">
          <nav className="grid gap-4 text-sm text-muted-foreground justify-start">
            <button
              className="font-semibold text-primary justify-start text-left"
              onClick={() => setSelectedProfileCard("General")}
            >
              General
            </button>
            <button
              className="justify-start text-left"
              onClick={() => setSelectedProfileCard("Goals")}
            >
              Goals
            </button>
            <button
              className="text-left"
              onClick={() => setSelectedProfileCard("Measurements")}
            >
              Measurements
            </button>
            <button onClick={() => setSelectedProfileCard("Username/Password")}>
              Username/Password
            </button>
          </nav>
          <div className="grid gap-6">{cardContent}</div>
        </div>
      </main>
    </div>
  )
}
