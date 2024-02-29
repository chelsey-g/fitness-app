import React, { useState } from "react"

import { FaArrowDown } from "react-icons/fa"

export default function MonthDropdown({ selectMonth }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState("")

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const handleMonthClick = (month) => {
    setSelectedMonth(month)
    setIsOpen(false)
    selectMonth(month)
  }

  const handleClearFilter = () => {
    setSelectedMonth("")
    setIsOpen(false)
    selectMonth("")
  }

  let year = new Date().getFullYear()

  return (
    <div className="relative w-60">
      <button
        className="bg-prm-bkg px-4 py-2 rounded-md flex items-center justify-between focus:outline-none w-60 relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-snd-bkg font-bold pr-2 w-full">
          {selectedMonth + " " + year}
        </span>
        <FaArrowDown className="" />
      </button>
      {isOpen && (
        <div className="absolute bg-white border border-gray-300 mt-1 rounded-md text-snd-bkg w-60">
          <ul className="list-none p-0 m-0 grid grid-cols-2">
            {months.map((item) => (
              <li
                key={item}
                className="px-4 py-2 hover:bg-gray-100 rounded w-full flex items-center p-4"
              >
                <input
                  type="radio"
                  name="month"
                  id={item}
                  value={item}
                  className="mr-2"
                  checked={selectedMonth === item}
                  onChange={() => handleMonthClick(item)}
                />
                <label htmlFor={item}>{item}</label>
              </li>
            ))}
          </ul>
          <button
            className="w-full px-4 py-2 p-4 text-center bg-red-500 text-white font-bold hover:bg-red-600 rounded-b-md focus:outline-none"
            onClick={handleClearFilter}
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  )
}
