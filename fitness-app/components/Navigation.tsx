import Link from "next/link"

export default function Navigation() {
  return (
    <nav className="bg-blue-500 p-4 mb-5 mt-8 rounded-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <a href="/" className="text-white text-2xl font-semibold mr-10">
            Fitness App
          </a>
          <ul className="flex space-x-4">
            <li>
              <a href="/" className="text-white hover:text-gray-300">
                Home
              </a>
            </li>
            <li>
              <Link href="/tracker" className="text-white hover:text-gray-300">
                Tracker
              </Link>
            </li>
            <li>
              <a
                href="/competitions"
                className="text-white hover:text-gray-300"
              >
                Competitions
              </a>
            </li>
            <li>
              <a
                href="/competitions"
                className="text-white hover:text-gray-300"
              >
                Challenges
              </a>
            </li>
            {/* <li>
              <Link href="/workouts" className="text-white hover:text-gray-300">
                Workouts
              </Link>
            </li> */}
            <li>
              <a href="/login" className="text-white hover:text-gray-300">
                Login
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-gray-300">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
