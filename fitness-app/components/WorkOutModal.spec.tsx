import "@testing-library/jest-dom"

import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import App from "./WorkOutModal"
import { createClient } from "../utils/supabase/client"
import { useRouter } from "next/navigation"

// Mock necessary modules
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

const insertMock = vi.fn().mockResolvedValue({ data: { id: 1 }, error: null })

vi.mock("../utils/supabase/client", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi
        .fn()
        .mockResolvedValue({ data: [{ id: 1, name: "List 1" }], error: null }),
      insert: insertMock, // Mocking insert correctly
      single: vi.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
    })),
    auth: {
      getUser: vi
        .fn()
        .mockResolvedValue({ data: { user: { id: "test-user" } } }),
    },
  })),
}))

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

describe("App Component", () => {
  const exerciseData = [
    {
      name: "Push Up",
      muscle: "Chest",
      difficulty: "Medium",
      equipment: "Bodyweight",
      instructions: "Do a push up.",
    },
  ]

  it("opens and closes the modal", async () => {
    render(
      <App
        isWorkOutModalVisible={false}
        exerciseData={exerciseData}
        handleOkButton={vi.fn()}
        handleAddWorkout={vi.fn()}
      />
    )

    // Initially, modal should not be visible
    expect(screen.queryByText("Add Workout To Workout List")).toBeNull()

    // Click the "Add Workout" button to open the modal
    const addButton = screen.getByText("Add Workout")
    fireEvent.click(addButton)

    // Modal should be visible after clicking "Add Workout"
    expect(screen.getByText("Add Workout To Workout List")).toBeInTheDocument()

    // Close the modal by clicking the cancel button
    fireEvent.click(screen.getByTestId("Cancel"))

    // Modal should be closed after clicking the cancel button
    await waitFor(() => {
      expect(screen.queryByText("Add Workout To Workout List"))
    })
  })

  it("submits the form successfully", async () => {
    const pushMock = vi.fn()
    useRouter.mockReturnValue({ push: pushMock })

    render(
      <App
        isWorkOutModalVisible={false}
        exerciseData={exerciseData}
        handleOkButton={vi.fn()}
        handleAddWorkout={vi.fn()}
      />
    )

    // Open the modal
    fireEvent.click(screen.getByText("Add Workout"))

    // Select the list (mock AddList component's interaction)
    const selectList = screen.getByRole("combobox")
    fireEvent.change(selectList, { target: { value: "1" } })

    // Submit the form
    fireEvent.submit(screen.getByTestId("submit"))

    // Wait for form submission and ensure Supabase insert is called
    await waitFor(() => {
      expect(createClient().from().insert).toHaveBeenCalledWith({
        name: "Push Up",
        details: exerciseData[0],
      })
    })

    // Ensure redirection
    expect(pushMock).toHaveBeenCalledWith("/workouts")
  })
})
