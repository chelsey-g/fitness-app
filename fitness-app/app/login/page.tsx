import { signInAction } from "@/app/actions"
import { FormMessage, Message } from "@/components/form-message"
import Link from "next/link"
import { IoIosLock } from "react-icons/io"

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams

  return (
    <div>
      <div className="px-2 py-4 sm:max-w-lg mx-auto">
        <form className="p-4 rounded-lg flex flex-col gap-2 text-foreground">
          <div className="flex items-center space-x-2 mb-4">
            <h1 className="text-2xl font-semibold">Log in to your account</h1>
            <IoIosLock className="text-2xl text-logo-green" />
          </div>
          <p className="text-sm text-foreground">
            Don't have an account?{" "}
            <Link
              className="text-foreground font-medium underline"
              href="/signup"
            >
              Sign up
            </Link>
          </p>
          <FormMessage message={searchParams} />

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
              href="/login/forgot-password"
              className="text-sm text-logo-green hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          <button
            formAction={signInAction}
            className="bg-logo-green hover:opacity-90 rounded-md px-4 py-2 mb-2 dark:bg-snd-bkg"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
