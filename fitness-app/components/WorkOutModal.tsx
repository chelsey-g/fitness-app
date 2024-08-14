import { Button, Form, Modal } from "antd"
import React, { use, useEffect, useState } from "react"

import AddList from "@/components/AddList"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

interface Exercise {
  name: string
  muscle: string
  difficulty: string
  equipment: string
  instructions: string
}

interface WorkOutModalProps {
  className?: string
  isWorkOutModalVisible: boolean
  handleOkButton: () => void
  handleAddWorkout: (event: React.FormEvent) => Promise<void>
  exerciseData: Exercise[]
}

const App = ({ exerciseData }: WorkOutModalProps) => {
  const [open, setOpen] = useState(false)
  const [workout, setWorkout] = useState<any[] | null>(null)
  const [list, setList] = useState<any[] | null>(null)
  const [listId, setListId] = useState("")

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    async function fetchLists() {
      let { data: lists, error } = await supabase.from("lists").select("*")
      setList(lists)
    }
    fetchLists()
  }, [])

  useEffect(() => {
    async function fetchWorkouts() {
      let { data: workouts, error } = await supabase
        .from("workouts")
        .select("*")
      setWorkout(workouts)
    }
    fetchWorkouts()
  }, [])

  const handleAddExerciseToList = async (event: any) => {
    const { data, error } = await supabase
      .from("workouts")
      .insert({ name: exerciseData[0].name, details: exerciseData[0] })
      .select()
      .single()
    if (error) {
      console.log("Error inserting data into Supabase:", error)
    } else {
      router.push("/workouts")
      console.log("Data inserted successfully!!!!:", data)
    }

    const { data: data1, error: error1 } = await supabase
      .from("workouts_lists")
      .insert({ workout_id: data.id, list_id: event.list_id })
      .select()
      .single()
    console.log("data1", data1)
    if (error1) {
      console.log("Error inserting data into Supabase:", error1)
    } else {
      console.log("Data inserted successfully$$$$$:", data1)
    }
    setOpen(false)
  }

  const showModal = () => {
    setOpen(true)
  }

  const handleOk = () => {
    setOpen(false)
  }

  const handleCancel = () => {
    console.log("Clicked cancel button")
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={showModal}
        className="py-2 px-4 bg-snd-bkg hover:opacity-90 text-white rounded-md focus:outline-none mt-5 text-center"
      >
        Add Workout
      </button>

      <Modal
        title="Add Workout To Workout List"
        open={open}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="lists"
          labelCol={{ flex: "110px" }}
          labelAlign="left"
          labelWrap
          wrapperCol={{ flex: 1 }}
          colon={false}
          style={{ maxWidth: 600 }}
          onFinish={handleAddExerciseToList}
        >
          <Form.Item name="list_id">
            <AddList
              exerciseData={exerciseData}
              onChange={(val: any) => setListId(val)}
            />
          </Form.Item>
          <button
            type="submit"
            className="py-2 px-4 bg-snd-bkg hover:opacity-90 text-white rounded-md focus:outline-none mt-5 text-center"
          >
            Add Exercise
          </button>
        </Form>{" "}
      </Modal>
    </>
  )
}

export default App
