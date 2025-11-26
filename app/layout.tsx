import "./globals.css"

import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { AuthProvider } from "@/contexts/AuthContext"
import { createClient } from "@/utils/supabase/server"  

export const metadata = {
  title: "HabitKick",
  description: "Your one-stop destination for fitness and wellness.",
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen flex flex-col bg-mint-cream dark:bg-black font-sans antialiased",
          fontSans.variable
        )}
      >
        <AuthProvider initialUser={user} initialSession={session}>
          <Navigation />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
