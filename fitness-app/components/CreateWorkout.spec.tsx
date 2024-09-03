import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import CreateWorkout from "./CreateWorkout"
import { useRouter } from "next/navigation"

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

const insertMock = vi.fn().mockResolvedValue({ error: null })
vi.mock("@/utils/supabase/client", () => ({
  createClient: () => ({
    from: () => ({
      insert: insertMock,
    }),
  }),
}))

describe("CreateWorkout", () => {
  it("renders the dialog, opens on button click, handles input, and submits the form", async () => {
    const showAlertMock = vi.fn()
    const pushMock = vi.fn()

    // Mock the useRouter to return the mocked push function
    useRouter.mockReturnValue({ push: pushMock })

    render(<CreateWorkout showAlert={showAlertMock} />)

    // Ensure the "Create Workout" button is rendered
    const createButton = screen.getByRole("button", { name: /create workout/i })
    expect(createButton).toBeInTheDocument()

    // Open the dialog by clicking the "Create Workout" button
    fireEvent.click(createButton)

    // Wait for the dialog to be visible by looking for the dialog title
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /create workout/i })
      ).toBeInTheDocument()
    })

    // Ensure the input field is in the document and type a workout name
    const input = screen.getByPlaceholderText("Workout Title")
    fireEvent.change(input, { target: { value: "Test Workout" } })
    expect(input).toHaveValue("Test Workout")

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /submit/i })
    fireEvent.click(submitButton)

    // Ensure that the workout is inserted into the database
    await waitFor(() => {
      expect(insertMock).toHaveBeenCalledWith([{ name: "Test Workout" }])
    })

    // Ensure showAlert is called
    expect(showAlertMock).toHaveBeenCalled()

    // Ensure the router redirects to /workouts
    expect(pushMock).toHaveBeenCalledWith("/workouts")

    // Check if the input field is cleared after submission
    expect(input).toHaveValue("")
  })
})
