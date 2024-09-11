import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import Navigation from "@/components/Navigation"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import userEvent from "@testing-library/user-event"

// Mock Supabase client
vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn(() => ({
        data: { unsubscribe: vi.fn() },
      })),
      signOut: vi.fn().mockResolvedValue({}),
    },
  })),
}))

// Mock useRouter
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

describe("Navigation Component", () => {
  it("renders correctly when user is not logged in", async () => {
    render(<Navigation />)

    // Check that at least one Login element is rendered
    const loginElements = screen.getAllByText("Login")
    expect(loginElements.length).toBeGreaterThan(0)

    // Check that the Contact link is rendered

    const contactElement = screen.getAllByText("Contact")
    expect(contactElement.length).toBeGreaterThan(0)
  })

  it("renders correctly when user is logged in", async () => {
    // Adjust mock to simulate user being logged in
    const mockCreateClient = createClient()
    mockCreateClient.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: "123", email: "test@example.com" } } },
    })

    render(<Navigation />)

    screen.debug()
  })

  it("toggles the mobile menu", () => {
    render(<Navigation />)

    // Find the menu toggle button
    const toggleButton = screen.getByTestId("menu-toggle")

    // Click to open the menu
    userEvent.click(toggleButton)

    // Click to close the menu
    userEvent.click(toggleButton)
  })
})
