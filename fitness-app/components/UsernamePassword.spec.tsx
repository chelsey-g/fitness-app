import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import UsernamePassword from "@/components/UsernamePassword"
import { createClient } from "@/utils/supabase/client"
import useSWR from "swr"

// Mock supabase client and SWR
vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { email: "test@example.com" } },
      }),
      updateUser: vi.fn().mockResolvedValue({
        data: { user: { email: "updated@example.com" } },
      }),
    },
  })),
}))

vi.mock("swr", () => ({
  default: vi.fn(() => ({
    data: { email: "test@example.com" },
    error: null,
    isLoading: false,
  })),
}))

describe("UsernamePassword Component", () => {
  it("renders the user's email", async () => {
    render(<UsernamePassword />)

    // Check if the user's email is displayed
    expect(screen.getByText("Email:")).toBeInTheDocument()
    expect(screen.getByText("test@example.com")).toBeInTheDocument()
  })

  it("opens the edit dialog when the Edit button is clicked", async () => {
    render(<UsernamePassword />)

    // Click the "Edit" button to open the dialog
    const editButton = screen.getByText("Edit")
    fireEvent.click(editButton)

    // Ensure the dialog opens and the input field is visible
    await waitFor(() => {
      expect(screen.getByText("Edit profile")).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText("test@example.com")
      ).toBeInTheDocument()
    })
  })

  it("updates the email when Save is clicked", async () => {
    const mockUpdateUser = vi.fn(() =>
      Promise.resolve({
        data: { user: { email: "updated@example.com" } },
      })
    )
    const mockSupabase = createClient()
    mockSupabase.auth.updateUser = mockUpdateUser

    render(<UsernamePassword />)

    // Open the dialog
    fireEvent.click(screen.getByText("Edit"))

    // Update the email input field
    const emailInput = screen.getByPlaceholderText("test@example.com")
    fireEvent.change(emailInput, { target: { value: "updated@example.com" } })

    // Click the Save button
    const saveButton = screen.getByText("Save")
    fireEvent.click(saveButton)
  })
})
