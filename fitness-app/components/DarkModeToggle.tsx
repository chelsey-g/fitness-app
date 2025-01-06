"use client"

import { useState, useEffect } from "react"
import { FiSun, FiMoon } from "react-icons/fi"

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const storedTheme = localStorage.getItem("theme")

    if (
      storedTheme === "dark" ||
      (!storedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      root.classList.add("dark")
      setIsDarkMode(true)
    } else {
      root.classList.remove("dark")
      setIsDarkMode(false)
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)

    const root = document.documentElement
    if (newMode) {
      root.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      root.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center justify-center p-2 rounded-full border bg-mint-cream dark:bg-black hover:bg-gray-200 dark:hover:bg-gray-800"
      aria-label="Dark mode toggle"
    >
      {isDarkMode ? (
        <FiMoon className="text-gray-600 dark:text-gray-200 w-5 h-5" />
      ) : (
        <FiSun className="text-yellow-400 w-5 h-5" />
      )}
    </button>
  )
}
