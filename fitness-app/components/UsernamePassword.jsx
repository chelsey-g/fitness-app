import {
  CardContent,
  CardDescription,
  CardFooter,
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
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import useSWR from "swr"

export default function UsernamePassword() {
  const supabase = createClient()
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")

  const {
    data: user,
    error,
    isLoading,
  } = useSWR("/user", () =>
    supabase.auth.getUser().then((res) => res.data.user)
  )

  const handleEditModal = () => {
    setIsOpen(true)
  }

  const handleSaveEmail = async () => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        email: email,
      })
      if (error) {
        console.error("Error updating email:", error.message)
      } else {
        setIsOpen(false)
        console.log("Email updated successfully!")
      }
    } catch (error) {
      console.error("Error updating email:", error.message)
    }
  }

  useEffect(() => {
    if (user) {
      setEmail(user.email)
    }
  }, [user])

  return (
    <div>
      <CardHeader>
        <CardTitle>Email & Password</CardTitle>
        <CardDescription>Update your email and password.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border-b pb-4 mb-4 flex justify-between items-center">
          <div>
            <p className="text-gray-700 font-semibold">Email:</p>
            <p className="text-gray-700">{user.email}</p>
          </div>
          <Dialog>
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
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Click save when you're done. Check your email for a
                  confirmation.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder={user.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  className="bg-snd-bkg text-white"
                  onClick={handleSaveEmail}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </div>
  )
}
