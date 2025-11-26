import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import Navigation from "@/components/Navigation"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import userEvent from "@testing-library/user-event"
import { useAuth } from "@/contexts/AuthContext"
import { User } from "@supabase/supabase-js"

// Mock DarkModeToggle component to avoid window.matchMedia issues
vi.mock("@/components/DarkModeToggle", () => ({
  default: () => <div data-testid="dark-mode-toggle">Dark Mode Toggle</div>,
}))

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

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: { id: "123", email: "test@example.com" },
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
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      session: null,
      signOut: vi.fn(),
      refreshAuth: vi.fn(),
    })

    render(<Navigation />)

    expect(screen.getByText("Get Started")).toBeInTheDocument()
    expect(screen.getByText("Login")).toBeInTheDocument()
  })

  it("renders correctly when user is logged in", async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: "123", email: "test@example.com", app_metadata: { provider: "email" }, user_metadata: { first_name: "John", last_name: "Doe" }, aud: "authenticated", created_at: new Date().toISOString() },
      isLoading: false,
      session: null,
      signOut: vi.fn(),
      refreshAuth: vi.fn(),
    })

    render(<Navigation />)

    expect(screen.getByText("Tracker")).toBeInTheDocument()
    expect(screen.getByText("Challenges")).toBeInTheDocument()
    expect(screen.getByText("Tools")).toBeInTheDocument()
    expect(screen.getByText("Goals")).toBeInTheDocument()

  })
  
})
