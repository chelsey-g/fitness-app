// "use client"

// import { FaBullseye, FaCalculator, FaTrophy } from "react-icons/fa"

// import { FaQuoteLeft } from "react-icons/fa"
// import { FaRunning } from "react-icons/fa"
// import { GiBodyHeight } from "react-icons/gi"
// import Image from "next/image"
// import Link from "next/link"
// import React from "react"
// import { useRouter } from "next/navigation"

// export default function LandingPage() {
//   const router = useRouter()

//   const handleJoinNowButton = () => {
//     router.push("/login")
//   }

//   return (
//     <div className="w-full">
//       <div className="relative h-96 flex items-center justify-center">
//         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-prm-bkg z-10"></div>
//         <Image
//           className="w-full h-full object-cover"
//           layout="fill"
//           src="/images/background-image.png"
//           alt="Background"
//         />
//         <div className="relative z-20 text-center mt-20 mb-10">
//           <Image
//             className="mx-auto flex mt-10 opacity-80"
//             width={300}
//             height={150}
//             src="/images/text-logo.png"
//             alt="text-logo"
//           />
//           <h2 className="text-4xl text-white font-bold mb-4">
//             Fitness At Your Fingertips
//           </h2>
//           <p className="text-lg text-white mb-6 px-4 italic mb-20">
//             Your path to friendly competition, motivation, and a healthier
//             lifestyle.
//           </p>
//           <button
//             className="bg-trd-bkg hover:bg-green-700 text-white font-bold py-6 px-12 text-2xl rounded-lg shadow transition duration-300 ease-in-out"
//             onClick={handleJoinNowButton}
//           >
//             Get Started
//           </button>
//         </div>
//       </div>

//       <div className="mx-auto px-4 py-10 bg-prm-bkg">
//         <div className="max-w-4xl mx-auto mt-10">
//           <h2 className="text-3xl font-bold text-center mb-8 text-white">
//             Explore Our Tools
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             <div className="testimonial max-w-md text-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out bg-white">
//               <div className="flex justify-center mb-4">
//                 <GiBodyHeight className="text-4xl text-blue-500 mx-2" />
//                 <FaCalculator className="text-4xl text-green-500 mx-2" />
//               </div>
//               <h3 className="text-xl font-bold">BMI & Calorie Calculators</h3>
//               <p className="text-gray-600 mt-2">
//                 Calculate your Body Mass Index (BMI) and find out how many
//                 calories you need to maintain or achieve your goals.
//               </p>
//             </div>

//             <div className="testimonial max-w-md text-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out bg-white">
//               <FaBullseye className="text-4xl text-red-500 mx-auto mb-4" />
//               <h3 className="text-xl font-bold">Start a Goal</h3>
//               <p className="text-gray-600 mt-2">
//                 Set and track your personal fitness goals.
//               </p>
//             </div>
//             <div className="testimonial max-w-md text-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out bg-white">
//               <FaTrophy className="text-4xl text-yellow-500 mx-auto mb-4" />
//               <h3 className="text-xl font-bold">Create a Competition</h3>
//               <p className="text-gray-600 mt-2">
//                 Challenge your friends and stay motivated together.
//               </p>
//             </div>
//             <div className="testimonial max-w-md text-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out bg-white">
//               <FaRunning className="text-4xl text-red-500 mx-auto mb-4" />
//               <h3 className="text-xl font-bold">Personalized Workouts</h3>
//               <p className="text-gray-600 mt-2">
//                 Create customized workout routines tailored to your fitness
//                 goals.
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="mx-auto mt-20 max-w-4xl">
//           <h2 className="text-3xl font-bold text-center mb-8 text-white">
//             What Our Users Say
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
//             <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition duration-300 ease-in-out cursor-pointer h-48 flex flex-col justify-center">
//               <FaQuoteLeft className="text-3xl text-blue-500 mx-auto mb-4" />
//               <p className="italic mb-2">
//                 "This app has completely revolutionized my approach to fitness
//                 and challenges!"
//               </p>
//               <p className="font-bold">- Jane Doe</p>
//             </div>
//             <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition duration-300 ease-in-out cursor-pointer h-48 flex flex-col justify-center">
//               <FaQuoteLeft className="text-3xl text-green-500 mx-auto mb-4" />
//               <p className="italic mb-2">
//                 "I've never been more inspired to stay active and reach my
//                 goals!"
//               </p>
//               <p className="font-bold">- John Smith</p>
//             </div>
//             <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition duration-300 ease-in-out cursor-pointer h-48 flex flex-col justify-center">
//               <FaQuoteLeft className="text-3xl text-red-500 mx-auto mb-4" />
//               <p className="italic mb-2">
//                 "The friendly competition keeps me motivated and striving for
//                 more every day."
//               </p>
//               <p className="font-bold">- Emily Johnson</p>
//             </div>
//           </div>
//         </div>

//         <section
//           id="join"
//           className="text-center py-20 bg-prm-bkg text-white rounded-xl mt-15"
//         >
//           <h2 className="text-3xl font-bold mb-8">
//             Ready to Start Your Journey?
//           </h2>
//           <button
//             className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow transition duration-300 ease-in-out"
//             onClick={handleJoinNowButton}
//           >
//             Join Now
//           </button>
//         </section>
//       </div>
//     </div>
//   )
// }

import Navigation from "./Navigation"

export default function LandingPage() {
  return (
    <div>
      <Navigation />
    </div>
  )
}
