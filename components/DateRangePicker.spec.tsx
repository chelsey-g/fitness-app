import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"

import MonthDropdown from "@/components/DateRangePicker"
import userEvent from "@testing-library/user-event"

// Mock system time and use UTC to ensure consistent date handling
vi.useFakeTimers()
vi.setSystemTime(new Date("2022-12-30T00:00:00Z")) // Set the time to a specific UTC time

describe("MonthDropdown Component", () => {
  it("renders the DateRangePicker", () => {
    const mockHandleDateChange = vi.fn()

    render(
      <MonthDropdown
        initialStartDate={undefined}
        initialEndDate={undefined}
        handleDateChange={mockHandleDateChange}
      />
    )

    expect(screen.getByTestId("date-range-picker")).toBeInTheDocument()
  })

  // it("calls handleDateChange with the correct date range when a date is selected", async () => {
  //   const mockHandleDateChange = vi.fn()

  //   render(
  //     <MonthDropdown
  //       initialStartDate="2022-12-30"
  //       initialEndDate="2023-12-29"
  //       handleDateChange={mockHandleDateChange}
  //     />
  //   )

  //   const dateRangePicker = screen.getByTestId("date-range-picker")
  //   userEvent.click(dateRangePicker)

  //   await waitFor(() => {
  //     const expectedStartDate = "2022-12-30" // Expected dates in UTC
  //     const expectedEndDate = "2023-12-29"

  //     console.log("Expected Dates: ", [expectedStartDate, expectedEndDate])
  //     console.log("Received Dates: ", mockHandleDateChange.mock.calls[0])

  //     expect(mockHandleDateChange).toHaveBeenCalledWith([
  //       expectedStartDate,
  //       expectedEndDate,
  //     ])
  //   })

  //   vi.useRealTimers() // Restore original timers
  // }, 10000) // Increase timeout to 10 seconds to prevent test from timing out
})
