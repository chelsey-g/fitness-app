import { signUpAction } from "@/app/actions"
import { FormMessage, Message } from "@/components/form-message"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import PasswordInput from "@/components/PasswordInput"
import { IoCreateOutline } from "react-icons/io5"

type SignupSearchParams = Message & {
  email?: string
}

export default async function Signup(props: {
  searchParams: Promise<SignupSearchParams>
}) {
  const searchParams = await props.searchParams
  const email = searchParams?.email || ""

  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-mint-cream dark:bg-black">
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <div className="flex items-center space-x-2 mb-6">
          <IoCreateOutline className="text-2xl text-logo-green" />
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Create Account
          </h1>
        </div>
        <p className="text-sm text text-foreground mb-4">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/login ">
            Sign in
          </Link>
        </p>
        <div className="mb-4">
          <FormMessage message={searchParams} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-logo-green focus:border-logo-green dark:text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-logo-green focus:border-logo-green dark:text-black"
          />
        </div>
        <div className="mb-4">
          <Label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-white mb-2"
          >
            Email
          </Label>
          <Input
            name="email"
            placeholder="you@example.com"
            defaultValue={email}
            className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-logo-green focus:border-logo-green dark:text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-logo-green focus:border-logo-green dark:text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
            Password
          </label>
          <PasswordInput />
        </div>
        <button
          formAction={signUpAction}
          className="text-black dark:text-white w-full py-2 px-4 border border-transparent rounded-md shadow-sm bg-logo-green dark:bg-snd-bkg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-logo-green mt-5"
        >
          Sign up
        </button>
      </form>
    </div>
  )
}
