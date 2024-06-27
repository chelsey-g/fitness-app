"use client"

import Image from "next/image"
import Link from "next/link"
import React from "react"
import { Link as ScrollLink } from "react-scroll"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()

  const handleJoinNowButton = () => {
    router.push("/login")
  }

  return (
    <div className="w-full">
      {/* <nav className="space-x-4">
        <ul className="flex flex-col lg:flex-row lg:space-x-5">
          <li className="lg:px-4 lg:py-2">
            <ScrollLink
              to="hero"
              smooth={true}
              duration={500}
              className="cursor-pointer text-white hover:text-gray-300 bg-trd-bkg px-4 py-2 rounded-lg shadow transition duration-300 ease-in-out font-bold"
            >
              Home
            </ScrollLink>
          </li>
          <li className="lg:px-4 lg:py-2">
            <ScrollLink
              to="features"
              smooth={true}
              duration={500}
              className="cursor-pointer text-white hover:text-gray-300 bg-trd-bkg px-4 py-2 rounded-lg shadow transition duration-300 ease-in-out font-bold"
            >
              Features
            </ScrollLink>
          </li>
          <li className="lg:px-4 lg:py-2">
            <ScrollLink
              to="testimonials"
              smooth={true}
              duration={500}
              className="cursor-pointer text-white hover:text-gray-300 bg-trd-bkg px-4 py-2 rounded-lg shadow transition duration-300 ease-in-out font-bold"
            >
              Testimonials
            </ScrollLink>
          </li>
          <li className="lg:px-4 lg:py-2">
            <Link
              href="/login"
              className="cursor-pointer text-white hover:text-gray-300 bg-trd-bkg px-4 py-2 rounded-lg shadow transition duration-300 ease-in-out font-bold"
            >
              Sign Up
            </Link>
          </li>
        </ul>
      </nav> */}
      <div className="relative h-72 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-prm-bkg z-10"></div>
        <Image
          className="w-full h-full object-cover"
          layout="fill"
          src="/images/background-image.jpg"
          alt="Background"
        />
        <div className="relative z-20 text-center mt-20">
          <Image
            className="mx-auto mb-5 opacity-80"
            width={300}
            height={150}
            src="/images/text-logo.png"
            alt="text-logo"
          />
          <h2 className="text-4xl text-white font-bold mb-4">
            Fitness At Your Fingertips
          </h2>
          <p className="text-lg text-white mb-6 px-4 italic">
            Your path to friendly competition, motivation, and a healthier
            lifestyle.
          </p>
          <button
            className="bg-trd-bkg hover:bg-green-700 text-white font-bold py-4 px-8 text-xl rounded-lg shadow transition duration-300 ease-in-out mt-20"
            onClick={handleJoinNowButton}
          >
            Get Started
          </button>
        </div>
      </div>
      <div className="mx-auto px-4 py-10 bg-prm-bkg">
        <section id="features" className="py-20 text-gray-800">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-white">
            Features
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="feature max-w-sm p-6 border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white">
              <h3 className="text-2xl font-semibold mb-4 text-center">
                Compete with Friends
              </h3>
              <p className="text-center text-gray-700">
                Engage in exciting challenges with friends to stay motivated and
                push each other to new heights.
              </p>
            </div>
            <div className="feature max-w-sm p-6 border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white">
              <h3 className="text-2xl font-semibold mb-4 text-center">
                Track Your Progress
              </h3>
              <p className="text-center text-gray-700">
                Keep a detailed record of your fitness journey with
                comprehensive progress tracking tools.
              </p>
            </div>
            <div className="feature max-w-sm p-6 border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white">
              <h3 className="text-2xl font-semibold mb-4 text-center ">
                Personalized Plans
              </h3>
              <p className="text-center text-gray-700">
                Create customized workout plans tailored to meet your unique
                fitness goals.
              </p>
            </div>
          </div>
        </section>
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          What Our Users Say
        </h2>
        <section
          id="testimonials"
          className="bg-gray-100 py-20 text-black rounded-xl"
        >
          <div className="flex flex-wrap justify-center gap-6">
            <div className="testimonial max-w-md text-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out bg-white ml-4">
              <p className="italic mb-2">
                "This app has transformed the way I approach fitness and
                challenges!"
              </p>
              <p className="font-bold">- Jane Doe</p>
            </div>
            <div className="testimonial max-w-md text-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out bg-white">
              <p className="italic mb-2">
                "I've never felt more motivated to stay active!"
              </p>
              <p className="font-bold">- John Smith</p>
            </div>
            <div className="testimonial max-w-md text-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out bg-white mr-4">
              <p className="italic mb-2">
                "The friendly competition keeps me going every day."
              </p>
              <p className="font-bold">- Emily Johnson</p>
            </div>
          </div>
        </section>
        <section
          id="join"
          className="text-center py-20 bg-prm-bkg text-white rounded-xl"
        >
          <h2 className="text-3xl font-bold mb-8">
            Ready to Start Your Journey?
          </h2>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow transition duration-300 ease-in-out"
            onClick={handleJoinNowButton}
          >
            Join Now
          </button>
        </section>
      </div>
    </div>
  )
}
