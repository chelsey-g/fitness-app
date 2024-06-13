"use client"

import React, { useEffect } from "react"
import { ValidationError, useForm } from "@formspree/react"

import Navigation from "@/components/Navigation"
import { useRouter } from "next/navigation"

function ContactForm() {
  const router = useRouter()
  const [state, handleSubmit] = useForm("mrgnbwoj")

  useEffect(() => {
    if (state.succeeded) {
      router.push("/dashboard")
    }
  }, [state.succeeded, router])

  return (
    <div>
      <Navigation />
      <h1 className="text-3xl text-center font-bold pt-10">Contact Us</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 ">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
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
            className="block text-gray-700 text-sm font-bold mb-2"
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
            className="block text-gray-700 text-sm font-bold mb-2"
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
          className="bg-snd-bkg hover:bg-snd-bkg hover:opacity-90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex flex-col items-center"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

function App() {
  return <ContactForm />
}

export default App
