import "react-datepicker/dist/react-datepicker.css"

import React, { useEffect, useState } from "react"

import DatePicker from "react-datepicker"
import { FaArrowDown } from "react-icons/fa"
import dayjs from "dayjs"

export default function MonthDropdown({
  initialStartDate,
  initialEndDate,
  handleDateChange,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [startDate, setStartDate] = useState(initialStartDate || null)
  const [endDate, setEndDate] = useState(initialEndDate || null)

  const handleChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  useEffect(() => {
    handleDateChange([
      startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
      endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
    ])
  }, [startDate, endDate])
  return (
    <div className="relative w-60">
      <button
        className="bg-prm-bkg px-4 py-2 rounded-md flex items-center justify-between focus:outline-none w-60 relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-snd-bkg font-bold pr-2 w-full">Filter Dates</span>
        <FaArrowDown className="" />
      </button>
      {isOpen && (
        <div className="absolute bg-white border border-gray-300 mt-1 rounded-md text-snd-bkg w-60">
          {
            <DatePicker
              selected={startDate}
              onChange={handleChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              selectsDisabledDaysInRange
              inline
            />
          }
        </div>
      )}
    </div>
  )
}
