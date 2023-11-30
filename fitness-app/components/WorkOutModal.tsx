import React, { useState } from "react"
import { Modal, Button } from "antd"
import AddList from "@/components/AddList"

const App: React.FC = ({ exerciseData }) => {
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [formRef, setFormRef] = useState(null)

  const showModal = () => {
    setOpen(true)
  }

  const handleOk = () => {
    if (formRef && formRef.current) {
      formRef.current.submit()
    }
    setConfirmLoading(true)
    setTimeout(() => {
      setOpen(false)
      setConfirmLoading(false)
    }, 50)
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
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Back
          </Button>,
          <Button
            key="submit"
            htmlType="submit"
            type="primary"
            onClick={handleOk}
          >
            OK
          </Button>,
        ]}
      >
        <div>
          <AddList exerciseData={exerciseData} setFormRef={setFormRef} />
        </div>
      </Modal>
    </>
  )
}

export default App
