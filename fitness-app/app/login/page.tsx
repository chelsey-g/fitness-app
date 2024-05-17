import Messages from "./messages"
import Navigation from "@/components/Navigation"

export default function Login() {
  return (
    <div>
      <Navigation />
      <div className="w-full px-8 py-4 sm:max-w-md mx-auto">
        <form
          className="bg-prm-bkg p-4 rounded-lg flex flex-col gap-2 text-foreground"
          action="/auth/sign-in"
          method="post"
        >
          <h1 className="text-1xl text-center font-bold mb-2">
            Welcome to HabitKick
          </h1>
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
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <button className="bg-snd-bkg rounded-md px-4 py-2 text-foreground mb-2">
            Sign In
          </button>
          <button
            formAction="/auth/sign-up"
            className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2 bg-trd-bkg hover:bg-trd-bkg-hover"
          >
            Sign Up
          </button>
          <Messages />
        </form>
      </div>
    </div>
  )
}
