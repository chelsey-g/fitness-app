import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import WorkoutActions from "./WorkoutActions"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

// Mock necessary modules
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

// Properly mock the Supabase client with delete().eq()
const eqMock = vi.fn().mockResolvedValue({ data: null, error: null })

const deleteMock = vi.fn(() => ({
  eq: eqMock,
}))

vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(() => ({
    from: () => ({
      delete: deleteMock,
    }),
  })),
}))

describe("WorkoutActions", () => {
  it("opens the dropdown menu and dialog, and deletes the workout", async () => {
    const pushMock = vi.fn()
    const refreshMock = vi.fn()

    useRouter.mockReturnValue({ push: pushMock, refresh: refreshMock })

    render(<WorkoutActions workoutId={1} listData={{}} />)

    // Open the dropdown menu
    const dropdownTrigger = screen.getByTestId("delete-button")

    fireEvent.click(dropdownTrigger)

    // Wait for the "Delete Workout" option to appear
    const deleteOption = await waitFor(() =>
      screen.getByTestId("delete-workout-entry")
    )
    expect(deleteOption).toBeInTheDocument()

    // Click the "Delete Workout" option
    fireEvent.click(deleteOption)

    // Wait for the dialog to open
    const dialog = await waitFor(() =>
      screen.getByText(/delete workout entry/i)
    )
    expect(dialog).toBeInTheDocument()

    // Click the "Delete" button in the dialog
    const deleteButton = screen.getByTestId("delete-confirm-button")
    expect(deleteButton).toBeInTheDocument()
    fireEvent.click(deleteButton)

    // Ensure the delete function was called with the correct arguments
    await waitFor(() => {
      expect(eqMock).toHaveBeenCalledWith("workout_id", 1)
    })

    // Ensure the dialog closes and refresh is called
    expect(refreshMock).toHaveBeenCalled()
  })
})
