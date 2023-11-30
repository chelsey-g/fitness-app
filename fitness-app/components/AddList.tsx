import React, { useEffect, useState, useRef } from "react"
import { PlusOutlined } from "@ant-design/icons"
import { Divider, Input, Select, Space, Button, Form } from "antd"
import { createClient } from "@/utils/supabase/client"

const App = ({ exerciseData, setFormRef }) => {
  const [items, setItems] = useState([])
  const [name, setName] = useState("")
  const [workout, setWorkout] = useState("")
  const inputRef = useRef(null)
  const formRef = useRef(null)

  const supabase = createClient()

  useEffect(() => {
    if (setFormRef) {
      setFormRef(formRef)
    }
  }, [setFormRef])

  useEffect(() => {
    async function fetchLists() {
      let { data: lists, error } = await supabase.from("lists").select("*")
      setItems(lists)
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

  const onNameChange = (event) => {
    setName(event.target.value)
  }
  const addItem = async (e) => {
    const { data, error } = await supabase
      .from("lists")
      .insert([{ name: name }])
      .select()

    e.preventDefault()
    setItems([...items, data[0]])
    setName("")
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const handleAddExerciseToList = async (event) => {
    const { data, error } = await supabase
      .from("workouts")
      .insert({ name: exerciseData[0].name, details: exerciseData[0] })
      .select()
      .single()
    console.log("data", data)
    if (error) {
      console.log("Error inserting data into Supabase:", error)
    } else {
      console.log("Data inserted successfully!!!!:", data)
    }

    const { data: data1, error: error1 } = await supabase
      .from("workouts_lists")
      .insert({ workout_id: data.id, list_id: event.list_id })
      .select()
      .single()
    if (error1) {
      console.log("Error inserting data into Supabase:", error1)
    } else {
      console.log("Data inserted successfully$$$$$:", data1)
    }
  }

  return (
    <Form
      name="lists"
      labelCol={{ flex: "110px" }}
      labelAlign="left"
      labelWrap
      wrapperCol={{ flex: 1 }}
      colon={false}
      style={{ maxWidth: 600 }}
      onFinish={handleAddExerciseToList}
      ref={formRef}
    >
      <Form.Item name="list_id" rules={[{ required: true }]}>
        <Select
          style={{
            width: 300,
          }}
          placeholder="Workout Lists"
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider
                style={{
                  margin: "8px 0",
                }}
              />
              <Space
                style={{
                  padding: "0 8px 4px",
                }}
              >
                <Input
                  placeholder="Please enter item"
                  ref={inputRef}
                  value={name}
                  onChange={onNameChange}
                  onKeyDown={(e) => e.stopPropagation()}
                />
                <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                  New Workout List
                </Button>
              </Space>
            </>
          )}
          options={items.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
        />
      </Form.Item>
    </Form>
  )
}
export default App
