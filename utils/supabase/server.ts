
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"

export async function createClient(cookieStore = cookies()) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(
          name: string,
          value: string,
          options: Omit<ResponseCookie, "name" | "value">
        ) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string) {
          cookieStore.delete(name)
        },
      },
    }
  )
}
