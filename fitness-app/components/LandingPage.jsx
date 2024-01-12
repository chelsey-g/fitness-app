"use client"

import { Link } from "react-scroll"
import React from "react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()

  const handleJoinNowButton = () => {
    router.push("/login")
  }
  return (
    <div className="bg-gradient-to-b from-prm-bkg to-snd-bkg">
      <header className="flex items-center justify-between px-4 py-2 sticky top-0 z-50 backdrop-filter">
        <img
          className="w-48 h-auto"
          src="/images/text-logo.png"
          alt="text-logo"
        />
        <nav className="space-x-4">
          <ul className="flex space-x-10">
            <li>
              <Link
                to="hero"
                smooth={true}
                duration={500}
                className="cursor-pointer text-white hover:text-gray-300 bg-trd-bkg px-4 py-2 rounded-lg shadow transition duration-300 ease-in-out font-bold font-mono"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="features"
                smooth={true}
                duration={500}
                className="cursor-pointer text-white hover:text-gray-300 bg-trd-bkg px-4 py-2 rounded-lg shadow transition duration-300 ease-in-out font-bold font-mono"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to="testimonials"
                smooth={true}
                duration={500}
                className="cursor-pointer text-white hover:text-gray-300 bg-trd-bkg px-4 py-2 rounded-lg shadow transition duration-300 ease-in-out font-bold font-mono"
              >
                Testimonials
              </Link>
            </li>
            <li>
              <Link
                to="join"
                smooth={true}
                duration={500}
                className="cursor-pointer text-white hover:text-gray-300 bg-trd-bkg px-4 py-2 rounded-lg shadow transition duration-300 ease-in-out font-bold font-mono"
              >
                Join
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <div className="mx-auto px-4">
        <section id="hero" className="text-center py-20">
          {/* <p className="text-xl mb-8 text-gray-200 leading-relaxed"> */}
          <img
            className="w-full h-auto"
            src="/images/background-image.jpg"
            alt="text-logo"
          />
          {/* </p> */}
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow transition duration-300 ease-in-out">
            Get Started
          </button>
        </section>

        <section id="features" className="py-20 bg-white text-gray-800">
          <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="feature max-w-sm p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
              <h3 className="text-2xl font-semibold mb-3">
                Compete with Friends
              </h3>
              <p>Engage in friendly competitions and stay motivated.</p>
            </div>
            <div className="feature max-w-sm p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
              <h3 className="text-2xl font-semibold mb-3">
                Compete with Friends
              </h3>
              <p>Engage in friendly competitions and stay motivated.</p>
            </div>
            <div className="feature max-w-sm p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
              <h3 className="text-2xl font-semibold mb-3">
                Compete with Friends
              </h3>
              <p>Engage in friendly competitions and stay motivated.</p>
            </div>
          </div>
        </section>

        <section id="testimonials" className="bg-gray-100 py-20 text-gray-800">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="testimonial max-w-md text-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
              <p className="italic">
                "This app has transformed the way I approach fitness and
                challenges!" - Jane Doe
              </p>
            </div>
          </div>
        </section>
        <section id="join" className="text-center py-20 bg-gray-800 text-white">
          <h2 className="text-4xl font-bold mb-8">
            Ready to Start Your Journey?
          </h2>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow transition duration-300 ease-in-out font-bold"
            onClick={handleJoinNowButton}
          >
            Join Now
          </button>
        </section>
      </div>
    </div>
  )
}
