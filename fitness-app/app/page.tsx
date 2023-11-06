
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Navigation from '@/components/Navigation'

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
   <Navigation />

      <div className="container mx-auto my-8 p-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Welcome to Fitness App</h1>
        <p className="text-gray-600">Your one-stop destination for fitness and wellness.</p>
      </div>

      <footer className="bg-gray-200 py-4">
        <div className="container mx-auto text-center">
          <p className="text-gray-600">&copy; {new Date().getFullYear()} FitnessApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
