import Link from "next/link"

export default function Navigation() {
  return (
    <nav className="bg-trd-bkg p-4 mb-5 mt-8 rounded-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* <a href="/" className="text-white text-2xl font-semibold mr-10">
            Fitness App
          </a> */}
          <img
            src="/images/text-logo.png"
            className="w-24 h-auto self-center pr-4 pb-1"
          />
          <ul className="flex space-x-4 items-center font-bold font-sans">
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
