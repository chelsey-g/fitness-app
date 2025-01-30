// import Messages from "./messages"
import { Suspense } from "react"
import Link from "next/link"

import { IoCreateOutline } from "react-icons/io5"

import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"

export default function SignUp() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Navigation />
        <div className="px-2 py-4 sm:max-w-lg mx-auto">
          <form
            className="p-4 rounded-lg flex flex-col gap-2 text-foreground"
            action="/auth/sign-up"
            method="post"
          >
            <div className="flex items-center space-x-2 mb-2">
              <IoCreateOutline className="text-2xl text-logo-green" />
              <h1 className="text-2xl font-semibold">Create an account</h1>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Already have an account?{" "}
              <Link className="text-logo-green hover:underline" href="/login">
                Log in
              </Link>
            </p>

            {/* <Messages /> */}
            <label className="text-md" htmlFor="email">
              Email
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit border mb-6"
              name="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
            <label className="text-md" htmlFor="password">
              Password
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit border mb-3"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
            <button className="w-full bg-logo-green hover:opacity-90 rounded-md px-4 py-2 mb-2 dark:bg-snd-bkg text-white text-sm font-semibold">
              Create Account
            </button>
          </form>
        </div>
      </Suspense>
      <Footer />
    </div>
  )
}
