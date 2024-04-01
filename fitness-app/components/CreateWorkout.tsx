import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IoIosAdd } from "react-icons/io"
import { createClient } from "@/utils/supabase/client"

export function CreateWorkout({ showAlert }) {
  const [name, setName] = useState("")
  const inputRef = useRef(null)
  const supabase = createClient()

  const onNameChange = (event) => {
    setName(event.target.value)
  }
  const addWorkout = async () => {
    try {
      await supabase.from("lists").insert([{ name: name }])
      setName("")
      dialogClose()
      showAlert()
    } catch (error) {
      console.error("Error adding workout:", error.message)
    }
  }

  const dialogClose = () => {
    document.getElementById("closeDialog")?.click()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-snd-bkg hover:opacity-90 text-white font-bold py-2 px-4 mb-10 rounded flex items-center border-none"
        >
          <IoIosAdd className="mr-2" />
          Create Workout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Create Workout</DialogTitle>
          <DialogDescription>
            Enter workout title below. Click submit when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="name"
              placeholder="Workout Title"
              className="col-span-3 focus:border-snd-bkg"
              value={name}
              onChange={onNameChange}
              ref={inputRef}
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="bg-snd-bkg hover:opacity-90 text-white font-bold py-2 px-4 mb-10 mt-5 rounded flex items-center"
            onClick={addWorkout}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateWorkout
