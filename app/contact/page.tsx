"use client"

import { useEffect, useState } from "react"
import { ValidationError, useForm } from "@formspree/react"
import SubmitContactAlert from "@/components/ContactAlert"
import { useRouter } from "next/navigation"

function ContactForm() {
  const router = useRouter()
  const [state, handleSubmit] = useForm("mrgnbwoj")
  const [showContactAlert, setShowContactAlert] = useState(false)

  const handleAlert = () => {
    setShowContactAlert(true)
    setTimeout(() => {
      setShowContactAlert(false)
    }, 3000)
  }

  useEffect(() => {
    if (state.succeeded) {
      handleAlert()
      // router.push("/dashboard")
    }
  }, [state.succeeded, router])

  return (
    <>
      <h1 className="text-3xl text-center font-bold pt-10">Contact Us</h1>
      {showContactAlert && <SubmitContactAlert />}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 ">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2 dark:text-white"
          >
            Name
          </label>
          <input
            id="name"
            type="name"
            name="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          <ValidationError prefix="Email" field="email" errors={state.errors} />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2 dark:text-white"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          <ValidationError prefix="Email" field="email" errors={state.errors} />
        </div>
        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-gray-700 text-sm font-bold mb-2 dark:text-white"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
          <ValidationError
            prefix="Message"
            field="message"
            errors={state.errors}
          />
        </div>

        <button
          type="submit"
          disabled={state.submitting}
          className="px-4 py-2 rounded-md bg-logo-green dark:bg-snd-bkg text-black dark:text-white font-medium hover:opacity-90"
        >
          Submit
        </button>
      </form>
    </>
  )
}

function App() {
  return <ContactForm />
}

export default App
