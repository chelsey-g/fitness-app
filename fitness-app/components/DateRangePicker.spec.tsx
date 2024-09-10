import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import MonthDropdown from "@/components/DateRangePicker"
import userEvent from "@testing-library/user-event"

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

    // Check if the DateRangePicker is rendered
    expect(screen.getByTestId("date-range-picker")).toBeInTheDocument()
  })

  it("calls handleDateChange with the correct date range when a date is selected", async () => {
    const mockHandleDateChange = vi.fn()

    render(
      <MonthDropdown
        initialStartDate="2022-12-30"
        initialEndDate="2023-12-29"
        handleDateChange={mockHandleDateChange}
      />
    )

    // Select the DateRangePicker element
    const dateRangePicker = screen.getByTestId("date-range-picker")

    // Simulate the user opening the date range picker
    userEvent.click(dateRangePicker)

    // Wait for handleDateChange to be called with the correct values
    await waitFor(() => {
      expect(mockHandleDateChange).toHaveBeenCalledWith([
        "2022-12-29",
        "2023-12-28",
      ])
    })
  })
})
