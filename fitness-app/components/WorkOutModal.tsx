"use client"

import React, { useState } from "react"
import { Modal, ConfigProvider } from "antd"
import AddList from "@/components/AddList"

const App: React.FC = () => {
<ConfigProvider 
theme={{
  Button: {
    color: '#fff',
    backgroundColor: '#1890ff',
    borderColor: '#1890ff',
  },
}}>
}}
/</ConfigProvider>


  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const showModal = () => {
    setOpen(true)
  }

  const handleOk = () => {
    setConfirmLoading(true)
    setTimeout(() => {
      setOpen(false)
      setConfirmLoading(false)
    }, 2000)
  }

  const handleCancel = () => {
    console.log("Clicked cancel button")
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={showModal}
        className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:outline-none mt-5 text-center"
      >
        Add Workout
      </button>
      <Modal
        title="Add Workout To Workout List"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>
          <AddList />
        </p>
      </Modal>
    </>
  )
}

export default App
