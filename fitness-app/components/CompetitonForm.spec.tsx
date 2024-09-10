import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import CompetitionForm from "@/components/CompetitonForm"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

// Mock necessary modules
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "123" } },
      }),
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: "123" } } },
      }),
      onAuthStateChange: vi.fn((callback) => {
        callback("SIGNED_IN", { session: { user: { id: "123" } } })
        return { data: { unsubscribe: vi.fn() } }
      }),
      signOut: vi.fn().mockResolvedValue({}),
    },
    storage: {
      from: vi.fn(() => ({
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: "https://fake.url/profile-image" },
        }),
      })),
    },
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ data: [{ id: "competition-123" }] }),
      select: vi.fn().mockResolvedValue({ data: [{ id: "competition-123" }] }),
    })),
  })),
}))

describe("CompetitionForm Component", () => {
  it("renders the form fields", async () => {
    render(<CompetitionForm />)
    // Check if all input fields are rendered
    expect(screen.getByLabelText("Name of Competition")).toBeInTheDocument()
    expect(screen.getByLabelText("Start Date")).toBeInTheDocument()
    expect(screen.getByLabelText("End Date")).toBeInTheDocument()
    expect(screen.getByLabelText("Rules")).toBeInTheDocument()
  })
  it("shows AddPlayers section when 'Yes' is selected for Select Players", async () => {
    render(<CompetitionForm />)
    // Initially, AddPlayers should not be rendered
    expect(screen.queryByText("Add Players")).not.toBeInTheDocument()
    // Simulate selecting "Yes" for adding players
    const yesRadio = screen.getByLabelText("Yes")
    fireEvent.click(yesRadio)
    // Now, the AddPlayers component should be visible
    await waitFor(() => {
      expect(screen.getByTestId("add-players")).toBeInTheDocument()
    })
  })
  it("submits the form and redirects after successful creation", async () => {
    const mockRouter = useRouter()
    const mockSupabase = createClient()
    render(<CompetitionForm />)
    // Fill in the form inputs
    fireEvent.change(screen.getByLabelText("Name of Competition"), {
      target: { value: "My Competition" },
    })
    fireEvent.change(screen.getByLabelText("Start Date"), {
      target: { value: "2024-01-01" },
    })
    fireEvent.change(screen.getByLabelText("End Date"), {
      target: { value: "2024-12-31" },
    })
    fireEvent.change(screen.getByLabelText("Rules"), {
      target: { value: "Some rules for the competition" },
    })
    // Simulate form submission
    const submitButton = screen.getByText("Create Competition")
    fireEvent.click(submitButton)
  })
})
