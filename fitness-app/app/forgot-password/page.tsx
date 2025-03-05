import { forgotPasswordAction } from "@/app/actions"
import { FormMessage, Message } from "@/components/form-message"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>
}) {
  const searchParams = await props.searchParams
  return (
    <>
      <div className="max-w-md mx-auto mt-8">
        <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-64 mx-auto">
          <div>
            <h1 className="text-2xl font-medium">Reset Password</h1>
            <p className="text-sm text-secondary-foreground">
              Already have an account?{" "}
              <Link className="text-primary underline" href="/sign-in">
                Sign in
              </Link>
            </p>
            <FormMessage message={searchParams} />
          </div>
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <Label htmlFor="email">Email</Label>
            <Input
              className="bg-mint-cream text-black focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-none"
              name="email"
              placeholder="you@example.com"
              required
            />
            <button
              className="w-full bg-logo-green dark:bg-snd-bkg rounded-md py-2 px-4 hover:bg-logo-green hover:opacity-90 disabled:opacity-50"
              formAction={forgotPasswordAction}
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
