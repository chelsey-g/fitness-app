// "use client"

// import { useEffect, useState, useRef } from "react"
// import { IoIosArrowDown } from "react-icons/io"
// import { RxHamburgerMenu } from "react-icons/rx"
// import {
//   FaChartLine,
//   FaBullseye,
//   FaTrophy,
//   FaUtensils,
//   FaSignOutAlt,
//   FaUserCog,
// } from "react-icons/fa"
// import { FaWeightScale } from "react-icons/fa6"
// import Link from "next/link"
// import Profile from "@/components/Profile"
// import { createClient } from "@/utils/supabase/client"
// import { useRouter } from "next/navigation"
// import DarkModeToggle from "@/components/DarkModeToggle"

// const dropdown = [
//   {
//     id: "tracker",
//     label: "Tracker",
//     links: [
//       { href: "/tracker", label: "Weight Log" },
//       { href: "/tracker/chart", label: "Tracker" },
//     ],
//   },
//   {
//     id: "competitions",
//     label: "Competitions",
//     links: [
//       { href: "/competitions/create", label: "Create Competition" },
//       { href: "/competitions", label: "Competitions" },
//       { href: "/competitions/history", label: "Competition History" },
//     ],
//   },
//   {
//     id: "goals",
//     label: "Goals",
//     links: [{ href: "/goals", label: "Goals" }],
//   },
//   {
//     id: "tools",
//     label: "Tools",
//     links: [
//       { href: "/calculator", label: "BMI Calculator" },
//       { href: "/recipes", label: "Recipe Search" },
//     ],
//   },
// ]

// const icons = {
//   tracker: FaChartLine,
//   goals: FaBullseye,
//   competitions: FaTrophy,
//   calculator: FaWeightScale,
//   recipes: FaUtensils,
// }

// export default function Navigation() {
//   const supabase = createClient()
//   const router = useRouter()
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null)

//   const dropdownRefs = useRef<Record<string, HTMLElement | null>>({})

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setIsLoggedIn(!!session)
//     })

//     supabase.auth.onAuthStateChange((event, session) => {
//       setIsLoggedIn(!!session)
//     })
//   }, [])

//   const toggleMenu = () => setIsMenuOpen((prev) => !prev)

//   const toggleDropdown = (id: string) => {
//     setOpenDropdown((prev) => (prev === id ? null : id))
//   }

//   const handleSignOut = async () => {
//     await supabase.auth.signOut()
//     router.push("/")
//   }

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as Node
//       if (
//         openDropdown &&
//         dropdownRefs.current[openDropdown] &&
//         !dropdownRefs.current[openDropdown]?.contains(target)
//       ) {
//         setOpenDropdown(null)
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside)

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [openDropdown])

//   const Dropdown = ({ id, label, links }: any) => (
//     <div className="relative" ref={(el) => (dropdownRefs.current[id] = el)}>
//       <button
//         onClick={() => toggleDropdown(id)}
//         className="flex items-center space-x-2"
//       >
//         <span>{label}</span>
//         <IoIosArrowDown />
//       </button>
//       {openDropdown === id && (
//         <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded z-10">
//           {links.map(({ href, label }: any) => (
//             <Link
//               key={href}
//               href={href}
//               className="block px-4 py-2 hover:bg-gray-100"
//             >
//               {label}
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   )

//   return (
//     <nav className="bg-mint-cream dark:bg-black p-4 shadow-md">
//       <div className="max-w-screen-lg mx-auto flex items-center justify-between">
//         <Link href={isLoggedIn ? "/dashboard" : "/"}>
//           <img src="/images/text-logo.png" alt="Logo" className="h-8" />
//         </Link>

//         {/* mobile nav */}
//         <div className="lg:hidden flex items-center space-x-4">
//           <button onClick={toggleMenu} className="text-xl">
//             <RxHamburgerMenu />
//           </button>
//           <DarkModeToggle />
//         </div>

//         {/* desktop nav */}
//         <div className="hidden lg:flex items-center space-x-6 tracking-tight font-semi-bold">
//           {isLoggedIn ? (
//             <>
//               {dropdown
//                 .filter((item) => item.id !== "goals")
//                 .map((item) => (
//                   <Dropdown key={item.id} {...item} />
//                 ))}
//               <Link href="/goals" className="px-4 py-2">
//                 Goals
//               </Link>
//               <div className="flex items-center space-x-4">
//                 <Profile />
//                 <DarkModeToggle />
//               </div>
//             </>
//           ) : (
//             <>
//               <Link
//                 href="/signup"
//                 className="px-4 py-2 bg-logo-green text-black rounded-md hover:opacity-90"
//               >
//                 Get Started
//               </Link>
//               <Link
//                 href="/login"
//                 className="px-4 py-2 border border-dashed rounded-md hover:opacity-90"
//               >
//                 Login
//               </Link>
//               <DarkModeToggle />
//             </>
//           )}
//         </div>
//       </div>
//       {/* mobile nav dropdown */}
//       {isMenuOpen && (
//         <div className="lg:hidden mt-4 rounded-lg p-4 space-y-4">
//           <div className="space-y-3">
//             {dropdown.flatMap(({ id, links }) =>
//               links
//                 .filter(({ href }) =>
//                   [
//                     "/competitions",
//                     "/tracker/chart",
//                     "/goals",
//                     "/calculator",
//                   ].includes(href)
//                 )
//                 .map(({ href, label }) => {
//                   const Icon = icons[id as keyof typeof icons] || FaUtensils
//                   return (
//                     <div key={href}>
//                       <Link
//                         href={href}
//                         className="flex items-center space-x-2 px-4 py-2 text-lg mb-1 hover:underline hover:underline-offset-4 hover:text-logo-green"
//                       >
//                         <Icon className="text-logo-green" />
//                         <span>{label}</span>
//                       </Link>
//                     </div>
//                   )
//                 })
//             )}
//             <div className="border-b border-gray-300" />
//             <Link
//               href="/profile"
//               className="flex items-center space-x-2 px-4 py-2 text-lg mb-1 hover:underline hover:underline-offset-4 hover:text-logo-green"
//             >
//               <FaUserCog className="text-logo-green" />
//               <span>Profile</span>
//             </Link>
//           </div>
//           <button
//             onClick={handleSignOut}
//             className="flex items-center justify-center space-x-2 w-full px-4 py-2 dark:bg-snd-bkg bg-logo-green dark:text-white text-lg text-center rounded hover:opacity-90"
//           >
//             <FaSignOutAlt />
//             <span>Logout</span>
//           </button>
//         </div>
//       )}
//     </nav>
//   )
// }

"use client"

import { useEffect, useState, useRef } from "react"
import { IoIosArrowDown } from "react-icons/io"
import { RxHamburgerMenu } from "react-icons/rx"
import {
  FaChartLine,
  FaBullseye,
  FaTrophy,
  FaUtensils,
  FaSignOutAlt,
  FaUserCog,
} from "react-icons/fa"
import { FaWeightScale } from "react-icons/fa6"
import Link from "next/link"
import Profile from "@/components/Profile"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import DarkModeToggle from "@/components/DarkModeToggle"

const dropdown = [
  {
    id: "tracker",
    label: "Tracker",
    links: [
      { href: "/tracker", label: "Weight Log" },
      { href: "/tracker/chart", label: "Tracker" },
    ],
  },
  {
    id: "competitions",
    label: "Competitions",
    links: [
      { href: "/competitions/create", label: "Create Competition" },
      { href: "/competitions", label: "Competitions" },
      { href: "/competitions/history", label: "Competition History" },
    ],
  },
  {
    id: "goals",
    label: "Goals",
    links: [{ href: "/goals", label: "Goals" }],
  },
  {
    id: "tools",
    label: "Tools",
    links: [
      { href: "/calculator", label: "BMI Calculator" },
      { href: "/recipes", label: "Recipe Search" },
    ],
  },
]

const icons = {
  tracker: FaChartLine,
  goals: FaBullseye,
  competitions: FaTrophy,
  calculator: FaWeightScale,
  recipes: FaUtensils,
}

export default function Navigation() {
  const supabase = createClient()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const dropdownRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
    })

    supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session)
    })
  }, [])

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  const toggleDropdown = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id))
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        openDropdown &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown]?.contains(target)
      ) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openDropdown])

  const Dropdown = ({ id, label, links }: any) => (
    <div className="relative" ref={(el) => (dropdownRefs.current[id] = el)}>
      <button
        onClick={() => toggleDropdown(id)}
        className="flex items-center space-x-2"
      >
        <span>{label}</span>
        <IoIosArrowDown />
      </button>
      {openDropdown === id && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded z-10">
          {links.map(({ href, label }: any) => (
            <Link
              key={href}
              href={href}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <nav className="bg-mint-cream dark:bg-black p-4 shadow-md">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between">
        <Link href={isLoggedIn ? "/dashboard" : "/"}>
          <img src="/images/text-logo.png" alt="Logo" className="h-8" />
        </Link>

        {/* mobile nav */}
        <div className="lg:hidden flex items-center space-x-4">
          <button onClick={toggleMenu} className="text-xl">
            <RxHamburgerMenu />
          </button>
          <DarkModeToggle />
        </div>

        {/* desktop nav */}
        <div className="hidden lg:flex items-center space-x-6 tracking-tight font-semi-bold">
          {isLoggedIn ? (
            <>
              {dropdown
                .filter((item) => item.id !== "goals")
                .map((item) => (
                  <Dropdown key={item.id} {...item} />
                ))}
              <Link href="/goals" className="px-4 py-2">
                Goals
              </Link>
              <div className="flex items-center space-x-4">
                <Profile />
                <DarkModeToggle />
              </div>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="px-4 py-2 bg-logo-green text-black rounded-md hover:opacity-90"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 border border-dashed rounded-md hover:opacity-90"
              >
                Login
              </Link>
              <DarkModeToggle />
            </>
          )}
        </div>
      </div>
      {/* mobile nav dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 rounded-lg p-4 space-y-4">
          <div className="space-y-3">
            {dropdown.flatMap(({ id, links }) =>
              links
                .filter(({ href }) =>
                  [
                    "/competitions",
                    "/tracker/chart",
                    "/goals",
                    "/calculator",
                  ].includes(href)
                )
                .map(({ href, label }) => {
                  const Icon = icons[id as keyof typeof icons] || FaUtensils
                  return (
                    <div key={href}>
                      <Link
                        href={href}
                        className="flex items-center space-x-2 px-4 py-2 text-lg mb-1 hover:underline hover:underline-offset-4 hover:text-logo-green"
                      >
                        <Icon className="text-logo-green" />
                        <span>{label}</span>
                      </Link>
                    </div>
                  )
                })
            )}
            <div className="border-b border-gray-300" />
            <Link
              href="/profile"
              className="flex items-center space-x-2 px-4 py-2 text-lg mb-1 hover:underline hover:underline-offset-4 hover:text-logo-green"
            >
              <FaUserCog className="text-logo-green" />
              <span>Profile</span>
            </Link>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center space-x-2 w-full px-4 py-2 dark:bg-snd-bkg bg-logo-green dark:text-white text-lg text-center rounded hover:opacity-90"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  )
}
