import { Button, Divider, Input, InputRef, Select, Space } from "antd"
import React, { useEffect, useRef, useState } from "react"

import { PlusOutlined } from "@ant-design/icons"
import { createClient } from "../utils/supabase/client"

const AddList = ({
  exerciseData,
  onChange,
}: {
  exerciseData: any
  onChange: any
}) => {
  const [items, setItems] = useState<any[]>([])
  const [name, setName] = useState("")
  const inputRef = useRef<InputRef>(null)

  const supabase = createClient()

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        console.log("userrrrrrrrr", user)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    async function fetchLists() {
      let { data: lists, error } = await supabase.from("lists").select("*")
      if (lists) {
        setItems(lists)
      }
    }
    fetchLists()
  }, [])

  const onNameChange = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setName(event.target.value)
  }
  const addItem = async (e: { preventDefault: () => void }) => {
    const { data, error } = await supabase
      .from("lists")
      .insert([{ name: name }])
      .select()

    e.preventDefault()
    if (data) {
      if (items) {
        setItems([...items, data[0]])
      }
    }
    setName("")
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  return (
    <>
      <Select
        onChange={onChange}
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
        options={items?.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
      />
    </>
  )
}
export default AddList
