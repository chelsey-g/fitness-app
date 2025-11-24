import "@testing-library/jest-dom"

import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useAuth } from "@/contexts/AuthContext"
import { competitionService } from "@/app/services/CompetitionService"
import type { User } from "@supabase/supabase-js"

import CompetitionHistoryPage from "./page"

// Mock AuthContext
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(() => ({ user: { id: "test-user-id", email: "test@example.com", app_metadata: { provider: "email" }, user_metadata: { first_name: "John", last_name: "Doe" }, aud: "authenticated", created_at: new Date().toISOString() } as User }))
}))

//Mock Competitions Service
vi.mock("@/app/services/CompetitionService", () => ({
  competitionService: {
    getCompetitionHistory: vi.fn()
  }
}))

// Mock Next.js router
const pushMock = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}))

// Mock Next.js Link to avoid Next.js internals in tests
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock getRandomColor to keep classNames deterministic
vi.mock("@/app/functions", () => ({
  getRandomColor: vi.fn(() => "bg-blue-500"),
}))

// Helpers to build a mocked Supabase client
function buildSupabaseSelectResponse(rows: any[] = [], error: any = null) {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({ data: rows, error }),
  }
}

function mockSupabaseWithRows(rows: any[] = [], error: any = null) {
  const fromMock = vi.fn(() => buildSupabaseSelectResponse(rows, error))

  // Minimal delete chain used by handleDeleteCompetition (not exercised deeply here)
  const deleteChain = { delete: vi.fn(() => ({ eq: vi.fn(() => ({ eq: vi.fn(async () => ({ error: null })) })) })) }

  vi.mocked(createClient).mockReturnValue({
    from: (table: string) => (table === "competitions" ? Object.assign(fromMock(), deleteChain) : fromMock()),
  } as any)
}

// Mock Supabase client factory
import { createClient } from "@/utils/supabase/client"
vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(),
  })),
}))

describe("CompetitionHistoryPage", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockClear()
    // vi.mocked(competitionService.getCompetitionHistory).mockClear()
  })

  it("redirects to login when user is not authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
        user: null,
        isLoading: false,
        session: null,
        signOut: vi.fn(),
        refreshAuth: vi.fn()
    })

    render(<CompetitionHistoryPage />)

    expect(pushMock).toHaveBeenCalledWith("/login")
  })

  it("navigates to active competitions when button is clicked", async () => {
    const past = new Date()
    past.setDate(past.getDate() - 1)

    vi.mocked(useAuth).mockReturnValue({
      user: { id: "test-user-id", email: "test@example.com", app_metadata: { provider: "email" }, user_metadata: { first_name: "John", last_name: "Doe" }, aud: "authenticated", created_at: new Date().toISOString() } as User,
      isLoading: false,
      session: null,
      signOut: vi.fn(),
      refreshAuth: vi.fn()
    })

    vi.mocked(competitionService.getCompetitionHistory).mockResolvedValue([
      { id: "c1", name: "January Shred", date_started: "2025-01-01", date_ending: "2025-01-05", created_by: "test-user-id" },
      { id: "c2", name: "Spring Cut", date_started: "2025-01-01", date_ending: "2025-01-30", created_by: "test-user-id" },
    ])

    render(<CompetitionHistoryPage />)
  })
  it("renders expired competitions with links and end dates", async () => {

    vi.mocked(useAuth).mockReturnValue({
     user: { id: "test-user-id", email: "test@example.com", app_metadata: { provider: "email" }, user_metadata: { first_name: "John", last_name: "Doe" }, aud: "authenticated", created_at: new Date().toISOString() } as User,
     isLoading: false,
     session: null,
     signOut: vi.fn(),
     refreshAuth: vi.fn()
    })
 
     vi.mocked(competitionService.getCompetitionHistory).mockResolvedValue([
       { id: "c1", name: "January Shred", date_started: "2025-01-01", date_ending: "2025-01-05", created_by: "test-user-id" },
       { id: "c2", name: "Spring Cut", date_started: "2025-01-01", date_ending: "2025-01-30", created_by: "test-user-id" },
     ])
 
     render(<CompetitionHistoryPage />)
 
     await waitFor(() => {
       // Names linked to details pages
       expect(screen.getByText("January Shred")).toBeInTheDocument()
       expect(screen.getByText("Spring Cut")).toBeInTheDocument()
       expect(screen.getAllByText(/End Date:/i).length).toBeGreaterThanOrEqual(1)
     })
  })


})
