"use server"

import { encodedRedirect } from "@/utils/utils"
import { createClient } from "@/utils/supabase/server"
import { headers, cookies } from "next/headers"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

export const signUpAction = async (formData: FormData) => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const username = formData.get("username") as string
  const password = formData.get("password") as string
  const captchaToken = formData.get("captchaToken")?.toString()
  const origin = (await headers()).get("origin")

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    )
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        username,
      },
      emailRedirectTo: `${origin}/auth/callback?redirect_to=/dashboard`,
      captchaToken,
    },
  })

  if (error) {
    console.error(error.code + " " + error.message)
    return encodedRedirect("error", "/signup", error.message)
  }

  return encodedRedirect(
    "success",
    "/signup",
    "Thanks for signing up! Please check your email for a verification link."
  )
}

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message)
  }

  return redirect("/dashboard")
}

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString()
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const origin = (await headers()).get("origin")
  const callbackUrl = formData.get("callbackUrl")?.toString()

  if (!email) {
    return encodedRedirect(
      "error",
      "/login/forgot-password",
      "Email is required"
    )
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  })

  if (error) {
    console.error(error.message)
    return encodedRedirect(
      "error",
      "/login/forgot-password",
      "Could not reset password"
    )
  }

  if (callbackUrl) {
    return redirect(callbackUrl)
  }

  return encodedRedirect(
    "success",
    "/login/forgot-password",
    "Check your email for a link to reset your password."
  )
}

export const resetPasswordAction = async (formData: FormData) => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    )
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    )
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    )
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated")
}

export const signOutAction = async () => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  await supabase.auth.signOut()
  return redirect("/sign-in")
}
