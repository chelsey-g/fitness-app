import { createClient } from "@/utils/supabase/server"
import LandingPage from "@/components/LandingPage"
import { cookies } from "next/headers"
export default async function HomePage() {
  const cookieStore = cookies()
  const canInitSupabaseClient = () => {
    try {
      createClient(cookieStore)
      return true
    } catch (e) {
      return false
    }
  }

  const isSupabaseConnected = canInitSupabaseClient()

  return (
    <div>
      <LandingPage />
    </div>
  )
}
