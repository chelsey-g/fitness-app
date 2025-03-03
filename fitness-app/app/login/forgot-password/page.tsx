// "use client"

// import { useState } from "react"
// import { createClient } from "@/utils/supabase/client"
// import Link from "next/link"

// export default function ResetPasswordRequest() {
//   const [email, setEmail] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState("")
//   const supabase = createClient()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       setLoading(true)
//       const { error } = await supabase.auth.resetPasswordForEmail(email, {
//         redirectTo: 'http://localhost:3000/auth/callback',
//       })

//       if (error) throw error
//       setMessage("Check your email for the password reset link")
//     } catch (error) {
//       if (error instanceof Error) {
//         setMessage("Error: " + error.message)
//       } else {
//         setMessage("An unknown error occurred")
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <>
//       <div className="max-w-md mx-auto mt-8">
//         {message ? (
//           <div className="text-center p-6 bg-mint-cream dark:bg-black rounded-lg">
//             <div className="mb-6">
//               <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Check your email</h2>
//               <p className="text-gray-700 dark:text-gray-300 mb-4">
//                 We've sent you an email with a password reset link. Please check your inbox to continue.
//               </p>
//               <p className="text-gray-600 dark:text-gray-400 text-sm">
//                 If you don't see the email, check your spam folder.
//               </p>
//             </div>
//             <Link
//               href="/login"
//               className="text-logo-green hover:opacity-90 font-semibold"
//             >
//               Return to Login
//             </Link>
//           </div>
//         ) : (
//           <>
//             <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium">
//                   Email address
//                 </label>
//                 <span className="text-sm text-gray-500">
//                   Enter your email and we'll send you a password reset link.
//                 </span>
//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="mt-1 block w-full rounded-md border p-2 text-black"
//                   required
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-logo-green dark:bg-snd-bkg rounded-md py-2 px-4 hover:bg-logo-green hover:opacity-90 disabled:opacity-50"
//               >
//                 {loading ? "Sending..." : "Send Reset Link"}
//               </button>
//               {message && (
//                 <p
//                   className={`text-sm ${
//                     message.includes("Error") ? "text-red-600" : "text-green-600"
//                   }`}
//                 >
//                   {message}
//                 </p>
//               )}
//             </form>
//             <div className="flex justify-center mt-4">
//               <Link href="/login" className="text-logo-green hover:opacity-90">
//                 Return to Login
//               </Link>
//             </div>
//           </>
//         )}
//       </div>
//     </>
//   )
// }

import { forgotPasswordAction } from "@/app/actions"
import { FormMessage, Message } from "@/components/form-message"
// import { SubmitButton } from "@/components/submit-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
// import { SmtpMessage } from "../smtp-message"

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>
}) {
  const searchParams = await props.searchParams
  return (
    <>
      <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-64 mx-auto">
        <div>
          <h1 className="text-2xl font-medium">Reset Password</h1>
          <p className="text-sm text-secondary-foreground">
            Already have an account?{" "}
            <Link className="text-primary underline" href="/sign-in">
              Sign in
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <button
            className="w-full bg-logo-green dark:bg-snd-bkg rounded-md py-2 px-4 hover:bg-logo-green hover:opacity-90 disabled:opacity-50"
            formAction={forgotPasswordAction}
          >
            Reset Password
          </button>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  )
}
