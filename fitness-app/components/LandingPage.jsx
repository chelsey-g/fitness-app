"use client"

import Image from "next/image"
import { Link } from "react-scroll"
import React from "react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()

  const handleGetStartedButton = () => {
    router.push("/home")
  }
  const handleJoinNowButton = () => {
    router.push("/login")
  }

  return (
    <div className="">
      <div className="">
        <header className="flex items-center justify-between px-4 py-2 pt-5 sticky top-0 z-50 backdrop-filter">
          <Image
            className="w-48 h-auto pl-5"
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
                  className="cursor-pointer text-white hover:text-gray-300 bg-trd-bkg px-4 py-2 rounded-lg shadow transition duration-300 ease-in-out font-bold"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="features"
                  smooth={true}
                  duration={500}
                  className="cursor-pointer text-white hover:text-gray-300 bg-trd-bkg px-4 py-2 rounded-lg shadow transition duration-300 ease-in-out font-bold"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="testimonials"
                  smooth={true}
                  duration={500}
                  className="cursor-pointer text-white hover:text-gray-300 bg-trd-bkg px-4 py-2 rounded-lg shadow transition duration-300 ease-in-out font-bold"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  to="join"
                  smooth={true}
                  duration={500}
                  className="cursor-pointer text-white hover:text-gray-300 bg-trd-bkg px-4 py-2 rounded-lg shadow transition duration-300 ease-in-out font-bold"
                >
                  Join
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <div className="relative">
          <img
            className="w-full h-auto rounded"
            src="/images/background-image.jpg"
            alt="Background"
          />
          <div className="absolute top-[-150px] left-0 w-full h-full flex flex-col items-center justify-center">
            <h2 className="text-4xl text-white font-bold mb-4 ">
              Fitness At Your Fingertips
            </h2>
            <p className="text-lg text-white mb-6">
              Your path to friendly competition, motivation, and a healthier
              lifestyle. Start your fitness journey with us today!
            </p>
            <div className="bg-snd-bkg hover:bg-prm-bkg text-white font-bold py-3 px-6 rounded-lg shadow transition duration-300 ease-in-out">
              <button onClick={handleGetStartedButton}>Get Started</button>
            </div>
          </div>
        </div>
        <div className="mx-auto px-4 pt-5">
          <section id="features" className="py-20 bg-prm-bkg text-gray-800">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Features
            </h2>
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

          <section
            id="testimonials"
            className="bg-gray-100 py-20 text-black rounded-xl"
          >
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
              <div className="testimonial max-w-md text-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
                <p className="italic">
                  "This app has transformed the way I approach fitness and
                  challenges!" - Jane Doe
                </p>
              </div>
              <div className="testimonial max-w-md text-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
                <p className="italic">
                  "This app has transformed the way I approach fitness and
                  challenges!" - Jane Doe
                </p>
              </div>
            </div>
          </section>
          <section id="join" className="text-center py-20 text-white">
            <h2 className="text-3xl font-bold mb-8">
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
    </div>
  )
}
