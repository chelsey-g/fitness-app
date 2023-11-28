import React, { useEffect, useState, useRef } from "react"
import { PlusOutlined } from "@ant-design/icons"
import { Divider, Input, Select, Space, Button } from "antd"
import { createClient } from "@/utils/supabase/client"

let index = 0
const App = () => {
  const [items, setItems] = useState([])
  const [name, setName] = useState("")
  const inputRef = useRef(null)

  const supabase = createClient()

  useEffect(() => {
    async function fetchLists() {
      let { data: lists, error } = await supabase.from("lists").select("*")
      setItems(lists)
    }
    fetchLists()
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
  return (
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
  )
}
export default App
