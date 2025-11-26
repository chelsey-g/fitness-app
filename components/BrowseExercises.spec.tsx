import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor, within } from "@testing-library/react"

import BrowseExercises from "./BrowseExercises"

// Mock the fetch function
global.fetch = vi.fn()

describe("BrowseExercises Component", () => {
  it("renders the loading state initially", () => {
    ;(fetch as vi.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve([]),
    })

    render(<BrowseExercises />)

    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("renders exercises after fetching", async () => {
    const mockExercises = [
      { name: "Push-Up", difficulty: "Medium" },
      { name: "Squat", difficulty: "Easy" },
    ]

    ;(fetch as vi.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockExercises),
    })

    render(<BrowseExercises />)

    await waitFor(() => {
      const pushUpCard = screen
        .getByText("Push-Up")
        .closest('div[role="article"]')
      expect(pushUpCard).toBeInTheDocument()

      const squatCard = screen.getByText("Squat").closest('div[role="article"]')
      expect(squatCard).toBeInTheDocument()

      // Using `within` to search inside a specific card
      expect(within(pushUpCard!).getByText("Difficulty:")).toBeInTheDocument()
      expect(within(pushUpCard!).getByText("Medium")).toBeInTheDocument()

      expect(within(squatCard!).getByText("Difficulty:")).toBeInTheDocument()
      expect(within(squatCard!).getByText("Easy")).toBeInTheDocument()
    })
  })

  it("displays 'Loading...' when no exercises are available", async () => {
    ;(fetch as vi.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve([]),
    })

    render(<BrowseExercises />)

    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument()
    })
  })

  it("handles fetch errors gracefully", async () => {
    ;(fetch as vi.Mock).mockRejectedValueOnce(new Error("API Error"))

    render(<BrowseExercises />)

    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument()
    })
  })
})
