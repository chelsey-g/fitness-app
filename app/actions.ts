"use server"

import { encodedRedirect } from "@/utils/utils"
import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import {AuthService} from "@/app/services/AuthService"

const supabase = createClient();
const authService = new AuthService(supabase);

export const signUpAction = async (formData: FormData) => {
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

  const data = await authService.signUp(email, password, firstName, lastName, username)
  if (!data.user) {
    return encodedRedirect("error", "/signup", "Failed to create user")
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

  const { data} = await authService.signIn(email, password)
  if (!data) {
    return encodedRedirect("error", "/sign-in", "Failed to sign in")
  }

  return redirect("/dashboard")
}

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString()
  const origin = (await headers()).get("origin")

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required")
  }

  try {
    await authService.resetPassword(email, origin || undefined)
    return encodedRedirect("success", "/forgot-password", "Check your email for a link to reset your password.")
  } catch (error) {
    return encodedRedirect("error", "/forgot-password", "Failed to send password reset email")
  }
}

export const resetPasswordAction = async (formData: FormData) => {
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!password || !confirmPassword) {
    return encodedRedirect("error", "/protected/reset-password", "Password and confirm password are required")
  }

  if (password !== confirmPassword) {
    return encodedRedirect("error", "/protected/reset-password", "Passwords do not match")
  }

  const data = await authService.updateUser(password)
  if (!data) {
    return encodedRedirect("error", "/protected/reset-password", "Failed to update password")
  }

  return encodedRedirect("success", "/protected/reset-password", "Password updated successfully")
}

export const signOutAction = async () => {
  const supabase = await createClient()
  const authService = new AuthService(supabase)
  await authService.signOut()
  return redirect("/sign-in")
}
