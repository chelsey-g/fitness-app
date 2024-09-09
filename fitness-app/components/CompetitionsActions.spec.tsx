import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import DropdownMenuDemo from "@/components/CompetitionsActions"
import userEvent from "@testing-library/user-event"

describe("DropdownMenuDemo Component", () => {
  it("renders the dropdown trigger button and calls deleteCompetition when clicked", async () => {
    const mockDeleteCompetition = vi.fn()

    render(<DropdownMenuDemo deleteCompetition={mockDeleteCompetition} />)

    // Ensure the dropdown trigger is rendered
    const dropdownTrigger = screen.getByTestId("dropdown-trigger")
    expect(dropdownTrigger).toBeInTheDocument()

    // Click the trigger button to open the dropdown
    await userEvent.click(dropdownTrigger)

    // Ensure the dropdown content is visible after clicking the trigger
    const deleteCompetitionItem = screen.getByText("Delete Competition")
    expect(deleteCompetitionItem).toBeInTheDocument()

    // Click the "Delete Competition" dropdown item
    await userEvent.click(deleteCompetitionItem)

    // Ensure deleteCompetition function is called
    expect(mockDeleteCompetition).toHaveBeenCalledTimes(1)
  })
})
