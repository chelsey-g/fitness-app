import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Sheet, SheetContent } from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function UsernamePassword() {
  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.updateUser({
      password: "new password",
    })
  }

  return (
    <div>
      <CardHeader>
        <CardTitle>Username & Password</CardTitle>
        <CardDescription>Update your username and password.</CardDescription>
      </CardHeader>
      <CardContent>
        <CardContent>
          <form>
            <Input
              className="placeholder-black"
              id="username"
              type="text"
              placeholder="Username"
              //   onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              className="placeholder-black"
              id="password"
              type="text"
              placeholder="Username"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </form>
        </CardContent>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-center">
        <Button className="bg-snd-bkg hover:bg-snd-bkg text-white py-3 px-6 rounded-full focus:outline-none text-center">
          Save
        </Button>
        <div className="flex justify-center">
          <Button className="text-snd-bkg hover:text-snd-bkg py-3 px-6 rounded-full focus:outline-none text-center">
            Send Password Reset Email
          </Button>
        </div>
      </CardFooter>
    </div>
  )
}
