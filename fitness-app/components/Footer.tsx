export default function Footer() {
  return (
    <div className="w-full p-4 py-6 lg:py-8 bg-footer-bkg">
      <div className="md:flex md:justify-between">
        <div className="mb-6 md:mb-0 flex flex-col items-start">
          <a href="https://flowbite.com/" className="block">
            <img
              src="/images/text-logo.png"
              className="h-8 mb-2"
              alt="HabitKick Logo"
            />
            <span className="text-gray-700 text-left text-xs dark:text-white">
              Your path to a healthier lifestyle awaits!
            </span>
          </a>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-700 uppercase dark:text-white">
              Resources
            </h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                <a href="https://flowbite.com/" className="hover:underline">
                  Test
                </a>
              </li>
              <li>
                <a href="https://tailwindcss.com/" className="hover:underline">
                  Test
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-700 uppercase dark:text-white">
              Follow us
            </h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                <a
                  href="https://github.com/themesberg/flowbite"
                  className="hover:underline "
                >
                  Test
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/4eeurUVvTy"
                  className="hover:underline"
                >
                  Test
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-700 uppercase dark:text-white">
              Legal
            </h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms &amp; Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="my-6 border-nav-bkg sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div className="sm:flex sm:items-center sm:justify-between text-gray-700">
        <span className="text-sm text-gray-700 sm:text-center dark:text-gray-400">
          © 2024{" "}
          <a href="https://habitkick.app/" className="hover:underline">
            HabitKick
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </div>
  )
}
