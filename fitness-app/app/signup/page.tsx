'use client'
// import Messages from "./messages"
import { Suspense } from "react"
import Link from "next/link"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useRef, useState, FormEvent } from 'react'
import HCaptcha from '@hcaptcha/react-hcaptcha'

import { IoCreateOutline } from "react-icons/io5"

export default function SignUp() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [captchaToken, setCaptchaToken] = useState<string>()
  const captcha = useRef<HCaptcha>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          captchaToken,
          emailRedirectTo: `${location.origin}/auth/callback`
        }
      })

      if (error) throw error

      // Redirect to email verification page
      router.push('/verify-email')
      router.refresh()
    } catch (error) {
      console.error('Error signing up:', error)
    } finally {
      // Reset the captcha after signup attempt
      captcha.current?.resetCaptcha()
    }
  }

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="px-2 py-4 sm:max-w-lg mx-auto">
          <form
            className="p-4 rounded-lg flex flex-col gap-2 text-foreground"
            onSubmit={handleSubmit}
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
            <div className="mb-4">
              <HCaptcha
                ref={captcha}
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                onVerify={(token) => setCaptchaToken(token)}
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-logo-green hover:opacity-90 rounded-md px-4 py-2 mb-2 dark:bg-snd-bkg text-white text-sm font-semibold"
            >
              Create Account
            </button>
          </form>
        </div>
      </Suspense>
    </div>
  )
}
