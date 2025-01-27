import "./globals.css"

import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"

export const metadata = {
  title: "HabitKick",
  description: "Your one-stop destination for fitness and wellness.",
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // return (
  //   <html lang="en">
  //     <Navigation />
  //     <body
  //       className={cn(
  //         "min-h-screen bg-mint-cream dark:bg-black font-sans antialiased",
  //         fontSans.variable
  //       )}
  //     >
  //       <main className="">{children}</main>
  //     </body>
  //   </html>
  // )
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen flex flex-col bg-mint-cream dark:bg-black font-sans antialiased",
          fontSans.variable
        )}
      >
        <Navigation />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
