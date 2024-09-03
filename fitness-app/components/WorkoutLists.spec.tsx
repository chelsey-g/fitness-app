import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import WorkoutLists from "./WorkoutLists"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import useSWR from "swr"

// Mock necessary modules
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

vi.mock("swr", () => ({
  default: vi.fn(),
}))

const insertMock = vi.fn().mockResolvedValue({ error: null })
vi.mock("@/utils/supabase/client", () => ({
  createClient: () => ({
    from: () => ({
      insert: insertMock,
    }),
  }),
}))

describe("WorkoutLists", () => {
  const mockData = [
    {
      id: 1,
      name: "Workout 1",
      created_at: "2024-09-01",
      workouts_lists: [{ workouts: { count: 5 } }],
    },
    {
      id: 2,
      name: "Workout 2",
      created_at: "2024-09-02",
      workouts_lists: [{ workouts: { count: 3 } }],
    },
  ]

  it("handles create workout", async () => {
    const showAlertMock = vi.fn()

    useSWR.mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
    })

    const pushMock = vi.fn()
    const refreshMock = vi.fn()

    useRouter.mockReturnValue({ push: pushMock, refresh: refreshMock })

    render(<WorkoutLists />)

    // Find and click the "Create Workout" button to open the dialog
    const createButton = screen.getByRole("button", { name: /create workout/i })
    fireEvent.click(createButton)

    // Simulate typing in the input field and submitting the form
    const input = screen.getByPlaceholderText("Workout Title")
    fireEvent.change(input, { target: { value: "New Workout" } })

    const submitButton = screen.getByRole("button", { name: /submit/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      // Ensure the insert function was called with the correct argument
      expect(insertMock).toHaveBeenCalledWith([{ name: "New Workout" }])

      // Ensure the router redirects to /workouts
      expect(pushMock).toHaveBeenCalledWith("/workouts")
    })
  })
})
