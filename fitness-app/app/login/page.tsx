import Messages from "./messages"
import { Suspense } from "react"

import { IoIosLock } from "react-icons/io"
import { FcGoogle } from "react-icons/fc"

import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"

export default function Login() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Navigation />
        <div className="px-2 py-4 sm:max-w-lg mx-auto">
          <form
            className="p-4 rounded-lg flex flex-col gap-2 text-foreground"
            action="/auth/sign-in"
            method="post"
          >
            <div className="flex items-center space-x-2 mb-4">
              <h1 className="text-2xl font-semibold">Log in to your account</h1>
              <IoIosLock className="text-2xl text-logo-green" />
            </div>

            <Messages />
            <label className="text-md" htmlFor="email">
              Email
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit border mb-6"
              name="email"
              placeholder="you@example.com"
              required
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
            />
            <div className="text-right mb-3">
              <a
                href="/login/help"
                className="text-sm text-logo-green hover:underline"
              >
                Forgot Password?
              </a>
            </div>
            <button className="bg-logo-green hover:opacity-90 rounded-md px-4 py-2 mb-2 dark:bg-snd-bkg">
              Log in
            </button>
            <div className="flex items-center justify-center space-x-3 text-white-300 my-2">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="px-2 text-sm uppercase text-gray-400">Or</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-cream-white hover:opacity-90 dark:bg-black rounded-md px-4 py-2 mt-2 border border-dashed border-logo-green">
              <FcGoogle />
              Continue With Google
            </button>
          </form>
        </div>
      </Suspense>
      <Footer />
    </div>
  )
}
