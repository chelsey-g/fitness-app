import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import AddList from "./AddList"
import { createClient } from "../utils/supabase/client"

// Mocking Supabase client
vi.mock("../utils/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 1, email: "testuser@example.com" } },
      }),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockResolvedValue({
      data: [
        { id: 1, name: "Workout 1" },
        { id: 2, name: "Workout 2" },
      ],
    }),
    insert: vi.fn().mockResolvedValue({
      data: [{ id: 3, name: "New Workout List" }],
    }),
  }),
}))

describe("AddList Component", () => {
  it("renders the component and displays the fetched list items", async () => {
    render(<AddList exerciseData={[]} onChange={vi.fn()} />)

    const dropdownTrigger = screen.getByRole("combobox")
    fireEvent.mouseDown(dropdownTrigger)

    // Wait for the dropdown to load the items
    await waitFor(() => {
      const dropdownItems = screen.getAllByRole("option")
      expect(dropdownItems).toHaveLength(2)
      expect(screen.getByText("Workout 1")).toBeInTheDocument()
      expect(screen.getByText("Workout 2")).toBeInTheDocument()
    })
  })

  screen.debug()

  it("allows the user to add a new workout list", async () => {
    render(<AddList exerciseData={[]} onChange={vi.fn()} />)

    // Click on the dropdown to open it
    const dropdownTrigger = screen.getByRole("combobox")
    fireEvent.mouseDown(dropdownTrigger)

    // Wait for the dropdown to render and locate the input by placeholder
    await waitFor(() => {
      const input = screen.getByPlaceholderText("Please enter item")
      fireEvent.change(input, { target: { value: "New Workout List" } })
      expect(input).toHaveValue("New Workout List")
    })

    // Click the "New Workout List" button
    const addButton = screen.getByText("New Workout List")
    fireEvent.click(addButton)

    // Wait for the new item to be added
    await waitFor(() => {
      expect(screen.getByText("New Workout List")).toBeInTheDocument()
    })
  })

  it("clears the input after adding a new workout list", async () => {
    render(<AddList exerciseData={[]} onChange={vi.fn()} />)

    // Click on the dropdown to open it
    const dropdownTrigger = screen.getByRole("combobox")
    fireEvent.mouseDown(dropdownTrigger)

    // Enter a new list name in the input field
    const input = screen.getByPlaceholderText("Please enter item")
    fireEvent.change(input, { target: { value: "New Workout List" } })
    expect(input).toHaveValue("New Workout List")

    // Click the "New Workout List" button
    const addButton = screen.getByText("New Workout List")
    fireEvent.click(addButton)

    // Wait for the input field to clear
    await waitFor(() => {
      expect(input).toHaveValue("")
    })
  })
})
