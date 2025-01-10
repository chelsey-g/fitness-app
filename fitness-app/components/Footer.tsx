export default function Footer() {
  return (
    <div className="w-3/4 p-4 py-6 mx-auto">
      <hr className="my-6 border-gray-300 dark:border-gray-700" />
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-700 dark:text-gray-400">
            <a href="/terms" className="hover:underline">
              Terms of Service
            </a>{" "}
            |{" "}
            <a href="/privacy" className="hover:underline">
              Privacy Policy
            </a>
          </span>
        </div>
        <div>
          <span className="text-sm text-gray-700 dark:text-gray-400">
            © 2024-2025{" "}
            <a href="https://habitkick.app/" className="hover:underline">
              HabitKick
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </div>
  )
}
