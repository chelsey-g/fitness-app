import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import { FaEllipsisH } from "react-icons/fa"
import GoalsDropdown from "@/components/GoalsActions"
import userEvent from "@testing-library/user-event"

// Mock the necessary modules
vi.mock("react-icons/fa", () => ({
  FaEllipsisH: () => <div>Icon</div>,
}))

describe("GoalsDropdown Component", () => {
  it("renders the dropdown trigger button", () => {
    const mockDeleteGoals = vi.fn()

    render(<GoalsDropdown deleteGoals={mockDeleteGoals} />)

    // Check if the trigger button is rendered
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("opens the delete dialog when the Delete option is clicked", async () => {
    const mockDeleteGoals = vi.fn()

    render(<GoalsDropdown deleteGoals={mockDeleteGoals} />)

    // Click the dropdown button to trigger the dropdown
    const dropdownTrigger = screen.getByRole("button")
    userEvent.click(dropdownTrigger)

    // Click the "Delete" button to open the delete dialog
    const deleteButton = screen.getByRole("button")
    userEvent.click(deleteButton)
  })
})
