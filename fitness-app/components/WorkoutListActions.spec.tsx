import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"

import { WorkoutDropdown } from "./WorkoutListActions"
import userEvent from "@testing-library/user-event"

describe("WorkoutDropdown Component", () => {
  const deleteWorkoutMock = vi.fn()
  const showAlertMock = vi.fn()

  it("renders the dropdown and opens the delete dialog", async () => {
    render(
      <WorkoutDropdown
        deleteWorkout={deleteWorkoutMock}
        showAlert={showAlertMock}
      />
    )

    // Check that the dropdown trigger button is rendered
    const dropdownTrigger = screen.getByTestId("delete-workout")
    expect(dropdownTrigger).toBeInTheDocument()

    // Use userEvent to click and open the dropdown
    await userEvent.click(dropdownTrigger)

    // Wait for the delete option to appear
    const deleteOption = screen.getByText("Delete Workout")
    expect(deleteOption).toBeInTheDocument()

    // Use userEvent to click the delete option
    await userEvent.click(deleteOption)

    // Wait for the dialog to appear
    const dialogTitle = await screen.findByText("Delete Workout Entry")
    expect(dialogTitle).toBeInTheDocument()

    // Find and click the "Delete" button inside the dialog
    const confirmDeleteButton = screen.getByTestId("delete-button")
    expect(confirmDeleteButton).toBeInTheDocument()
    await userEvent.click(confirmDeleteButton)
  })
})
