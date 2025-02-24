'use client'
// import Messages from "./messages"
import { Suspense, useEffect } from "react"
import Link from "next/link"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useRef, useState, FormEvent } from 'react'
import HCaptcha from '@hcaptcha/react-hcaptcha'

import { IoCreateOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"

interface SignUpFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
}

export default function SignUp() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [captchaToken, setCaptchaToken] = useState<string>()
  const captcha = useRef<HCaptcha>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && (window as Window).hcaptcha) {
        (window as Window).hcaptcha.reset()
      }
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const data: SignUpFormData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      username: formData.get('username') as string,
    }

    if (!captchaToken) {
      setError('Please complete the captcha')
      setLoading(false)
      return
    }

    try {
      // First check if username already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', data.username)
        .single()

      if (existingUser) {
        setError('Username already taken')
        setLoading(false)
        return
      }

      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          captchaToken,
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          }
        }
      })

      if (signUpError || !authData.user) {
        console.error('Signup error:', signUpError)
        setError(signUpError?.message || 'Failed to create account')
        return
      }

      // Create profile using service role client
      const response = await fetch('/api/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: authData.user.id,
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
        }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        console.error('Profile creation error:', result.error)
        setError(`Failed to create profile: ${result.error}`)
        return
      }

      // Success! Show verification message
      setIsSuccess(true)

    } catch (error) {
      const err = error as Error
      setError(`An unexpected error occurred: ${err.message}`)
      console.error('Error in signup process:', error)
    } finally {
      setLoading(false)
      captcha.current?.resetCaptcha()
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-mint-cream dark:bg-black">
      {isSuccess ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Check your email</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We've sent you an email with a confirmation link. Please check your inbox and click the link to verify your account.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            If you don't see the email, check your spam folder.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-2 mb-6">
            <IoCreateOutline className="text-2xl text-logo-green" />
            <h1 className="text-2xl font-bold text-black dark:text-white">Create Account</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">First Name</label>
              <input
                type="text"
                name="firstName"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-logo-green focus:border-logo-green dark:text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-logo-green focus:border-logo-green dark:text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">Username</label>
              <input
                type="text"
                name="username"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-logo-green focus:border-logo-green dark:text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">Email</label>
              <input
                type="email"
                name="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-logo-green focus:border-logo-green dark:text-black"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-logo-green focus:border-logo-green dark:text-black"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <IoEyeOffOutline className="h-5 w-5 text-gray-500" />
                  ) : (
                    <IoEyeOutline className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="flex justify-center">
              <HCaptcha
                ref={captcha}
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                onVerify={(token) => setCaptchaToken(token)}
                onError={(err) => console.error('hCaptcha Error:', err)}
                onExpire={() => setCaptchaToken(undefined)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-logo-green dark:bg-snd-bkg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-logo-green"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-sm text-gray-600 text-center">
              Already have an account?{" "}
              <Link className="text-logo-green hover:underline" href="/login">
                Log in
              </Link>
            </p>
          </form>
        </>
      )}
    </div>
  )
}
