import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import { DropdownMenuDemo } from "./TrackerActions"

describe("DropdownMenuDemo Component", () => {
  const deleteWeightMock = vi.fn()

  it("renders the dropdown and opens the delete dialog", async () => {
    render(<DropdownMenuDemo deleteWeight={deleteWeightMock} />)

    // Check that the dropdown trigger button is rendered (role "button" is for the trigger)
    const dropdownTrigger = screen.getByRole("button", { name: "ellipsis" })
    expect(dropdownTrigger).toBeInTheDocument()

    // Click or mouse down to open the dropdown
    fireEvent.mouseDown(dropdownTrigger)
    fireEvent.keyDown(dropdownTrigger, { key: "Enter", code: "Enter" })

    screen.debug()

    // Wait for the dropdown content to appear
    await waitFor(() => {
      expect(screen.getByTestId("dropdown-content")).toBeInTheDocument()
    })

    // Wait for the delete option to appear and ensure it is rendered
    await waitFor(() => {
      const deleteOption = screen.getByTestId("delete-option")
      expect(deleteOption).toBeInTheDocument()
    })

    // Click the delete option to open the dialog
    const deleteOption = screen.getByTestId("delete-option")
    fireEvent.click(deleteOption)

    // // Wait for the dialog to appear
    const dialogTitle = await screen.findByText("Delete Weight Entry")
    expect(dialogTitle).toBeInTheDocument()

    // // Find and click the "Delete" button inside the dialog
    const confirmDeleteButton = screen.getByTestId("confirm-delete")
    expect(confirmDeleteButton).toBeInTheDocument()
    fireEvent.click(confirmDeleteButton)

    // // Ensure the deleteWeight function is called
    await waitFor(() => {
      expect(deleteWeightMock).toHaveBeenCalledTimes(1)
    })
  })
})
