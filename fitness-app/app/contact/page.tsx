"use client"

import ContactAlert from "@/components/ContactAlert"
import Navigation from "@/components/Navigation"
import React from "react"
import { sendEmail } from "@/lib/sendEmail"

export default function ContactForm() {
  const handleSubmit = <ContactAlert />
  return (
    <div>
      <Navigation />
      {/* <img
        src="/images/text-logo.png"
        alt="contact"
        className="w-20 text-center mx-auto"
      /> */}
      <h1 className="text-3xl text-center font-bold pt-10">Contact Us</h1>
      <form
        action={async (formData) => {
          await sendEmail(formData)
        }}
        className="max-w-lg mx-auto p-4 "
      >
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
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
        </div>

        <button
          type="submit"
          className="bg-snd-bkg hover:bg-snd-bkg hover:opacity-90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex flex-col items-center"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
