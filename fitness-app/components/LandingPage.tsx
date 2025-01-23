import Footer from "./Footer"
import Link from "next/link"
import { CgArrowRight } from "react-icons/cg"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-16 px-8 relative">
        <div className="w-3/4 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h1 className="text-5xl font-bold mb-4">
              Kickstart your habits with{" "}
              <span className="text-logo-green">HabitKick</span>.
            </h1>
            <p className="text-lg text-gray-400 mb-6">
              Your ultimate tool to build and maintain healthy habits. Invite
              friends or start today and see the difference.
            </p>
            <div className="flex space-x-4">
              <Link
                className="px-4 py-2 rounded-md bg-logo-green dark:bg-snd-bkg text-black dark:text-white font-medium hover:opacity-90"
                href="/signup"
              >
                Try for free
              </Link>
              <Link
                className="flex items-center px-4 py-2 rounded-md border border-dashed border-logo-green text-black dark:text-white font-medium hover:opacity-90"
                href="/signup"
              >
                Learn more <CgArrowRight className="ml-1" />
              </Link>
            </div>
          </div>
          <div className="relative h-64 flex items-center justify-center">
            <div className="w-32 h-32 bg-logo-green opacity-20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute w-24 h-24 bg-snd-bkg opacity-40 rounded-full blur-2xl animate-pulse"></div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
