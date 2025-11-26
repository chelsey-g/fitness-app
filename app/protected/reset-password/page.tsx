import { resetPasswordAction } from "@/app/actions"
import { FormMessage, Message } from "@/components/form-message"

export default async function ResetPassword(props: {
  searchParams: Promise<Message>
}) {
  const searchParams = await props.searchParams
  return (
    <div className="px-2 py-4 sm:max-w-lg mx-auto">
      <form className="p-4 rounded-lg flex flex-col gap-2 text-foreground">
        <h1 className="text-2xl font-medium">Reset password</h1>
        <p className="text-sm text-foreground/60">
          Please enter your new password below.
        </p>
        <FormMessage message={searchParams} />
        <label className="text-md" htmlFor="password">
          New password
        </label>
        <input
          type="password"
          name="password"
          placeholder="New password"
          required
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
        />
        <label className="text-md" htmlFor="confirmPassword">
          Confirm password
        </label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          required
          className="rounded-md px-4 py-2 bg-inherit border mb-3"
        />
        <button
          className="bg-logo-green hover:opacity-90 rounded-md px-4 py-2 mb-2 dark:bg-snd-bkg"
          formAction={resetPasswordAction}
        >
          Reset password
        </button>
      </form>
    </div>
  )
}
