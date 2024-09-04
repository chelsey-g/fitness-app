import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import AddPlayers from "./AddPlayers"
import { createClient } from "@/utils/supabase/client"

// Mocking Supabase client
vi.mock("@/utils/supabase/client", () => ({
  createClient: () => ({
    from: () => ({
      select: vi.fn().mockResolvedValue({
        data: [
          { id: "1", first_name: "John" },
          { id: "2", first_name: "Jane" },
        ],
        error: null,
      }),
    }),
  }),
}))

describe("AddPlayers Component", () => {
  it("renders and fetches profiles", async () => {
    render(<AddPlayers selectPlayers={vi.fn()} />)

    // Wait for the profiles to be loaded
    await waitFor(() => {
      const dropdown = screen.getByRole("combobox")
      expect(dropdown).toBeInTheDocument()
    })

    // Simulate opening the dropdown
    const dropdown = screen.getByRole("combobox")
    fireEvent.mouseDown(dropdown)

    // Wait for options to appear
    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument()
      expect(screen.getByText("Jane")).toBeInTheDocument()
    })
  })

  it("allows selecting multiple players", async () => {
    const selectPlayersMock = vi.fn()
    render(<AddPlayers selectPlayers={selectPlayersMock} />)

    // Wait for the profiles to be fetched
    await waitFor(() => {
      const dropdown = screen.getByRole("combobox")
      expect(dropdown).toBeInTheDocument()
    })

    // Simulate opening the dropdown
    const dropdown = screen.getByRole("combobox")
    fireEvent.mouseDown(dropdown)

    // Select the options for John and Jane
    const johnOption = screen.getByText("John")
    fireEvent.click(johnOption)

    const janeOption = screen.getByText("Jane")
    fireEvent.click(janeOption)

    // Verify that the selectPlayers function is called with the correct IDs
    await waitFor(() => {
      expect(selectPlayersMock).toHaveBeenCalledWith(["1", "2"])
    })
  })
})
