import "@testing-library/jest-dom"

import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SWRConfig } from "swr"
import { useAuth } from "@/contexts/AuthContext"
import { competitionService } from "@/app/services/CompetitionService"
import type { User } from "@supabase/supabase-js"

import CompetitionsPage from "./page"

// Helper to render components with SWR cache disabled
const renderWithSWR = (ui: React.ReactElement) => {
  return render(
    <SWRConfig
      value={{
        provider: () => new Map(), // Fresh cache for each render
        dedupingInterval: 0, // Disable request deduplication
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 0,
      }}
    >
      {ui}
    </SWRConfig>
  )
}

// Mock AuthContext
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}))

// Mock CompetitionService
vi.mock("@/app/services/CompetitionService", () => ({
  competitionService: {
    getCompetitions: vi.fn(),
    deleteCompetition: vi.fn(),
  },
}))

// Mock Next.js router
const pushMock = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}))

// Mock Next.js Link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock getRandomColor
vi.mock("@/app/functions", () => ({
  getRandomColor: vi.fn(() => "bg-blue-500"),
}))

// Mock DeleteDialog
vi.mock("@/components/DeleteDialog", () => ({
  default: ({
    onDelete,
    title,
    message,
  }: {
    onDelete: () => void
    title: string
    message: string
  }) => (
    <div data-testid="delete-dialog">
      <button data-testid="delete-button" onClick={onDelete}>
        {title} - {message}
      </button>
    </div>
  ),
}))

describe("CompetitionsPage", () => {
  beforeEach(() => {
    // Clear mocks to ensure test isolation
    // With SWR cache disabled via renderWithSWR, each test gets fresh data
    vi.mocked(competitionService.getCompetitions).mockClear()
    vi.mocked(competitionService.deleteCompetition).mockClear()
    vi.mocked(useAuth).mockClear()
    pushMock.mockClear()
    
    // Set default auth value
    vi.mocked(useAuth).mockReturnValue({
      user: { id: "test-user-id" } as User,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
      refreshAuth: vi.fn(),
    })
    
    // Each test will set its own getCompetitions mock value
    // SWR cache is disabled, so no caching between tests
  })

  it("renders empty state when there are no active competitions", async () => {
    vi.mocked(competitionService.getCompetitions).mockResolvedValue([])

    renderWithSWR(<CompetitionsPage />)

    await waitFor(() => {
      expect(screen.getByText("No Active Competitions")).toBeInTheDocument()
      expect(
        screen.getByText("Create or join a competition to get started.")
      ).toBeInTheDocument()
    })
  })

  it("renders active competitions with correct information", async () => {
    // Set up mocks BEFORE rendering
    // SWR cache is disabled, so this will be fresh data
    vi.mocked(competitionService.getCompetitions).mockResolvedValue([
        {
            id: "comp-1",
            name: "Summer Challenge",
            date_started: "2024-06-01",
            date_ending: "2025-12-31",
            created_by: "test-user-id",
        },
    ])
    
    vi.mocked(useAuth).mockReturnValue({
        user: { id: "test-user-id" } as User,
        session: null,
        isLoading: false,
        signOut: vi.fn(),
        refreshAuth: vi.fn(),
    })
    
    renderWithSWR(<CompetitionsPage />)

    // Wait for loading to complete and data to render
    await waitFor(
      () => {
        expect(screen.queryByText("Loading competitions...")).not.toBeInTheDocument()
      },
      { timeout: 3000 }
    )

    await waitFor(
      () => {
        expect(screen.getByText("Summer Challenge")).toBeInTheDocument()
        expect(screen.getByTestId("competition-count")).toHaveTextContent("You currently have 1 active competition.")
      },
      { timeout: 3000 }
    )
  })

  it("filters out expired competitions", async () => {
    const mockCompetitions = [
      {
        id: "comp-1",
        name: "Active Competition",
        date_started: "2024-06-01",
        date_ending: "2025-12-31",
        created_by: "test-user-id",
      },
      {
        id: "comp-2",
        name: "Expired Competition",
        date_started: "2024-01-01",
        date_ending: "2024-01-15",
        created_by: "test-user-id",
      },
    ]

    vi.mocked(competitionService.getCompetitions).mockResolvedValue(
      mockCompetitions
    )

    render(<CompetitionsPage />)

    await waitFor(() => {
      expect(screen.getByText("Active Competition")).toBeInTheDocument()
      expect(screen.queryByText("Expired Competition")).not.toBeInTheDocument()
    })
  })

  it("displays admin badge for competitions created by the user", async () => {
    const mockCompetitions = [
      {
        id: "comp-1",
        name: "My Competition",
        date_started: "2024-06-01",
        date_ending: "2025-12-31",
        created_by: "test-user-id",
      },
    ]

    vi.mocked(competitionService.getCompetitions).mockResolvedValue(
      mockCompetitions
    )

    renderWithSWR(<CompetitionsPage />)

    await waitFor(() => {
      expect(screen.getByText("Admin")).toBeInTheDocument()
    })
  })

  it("navigates to create competition page when button is clicked", async () => {
    const user = userEvent.setup()

    vi.mocked(competitionService.getCompetitions).mockResolvedValue([])

    render(<CompetitionsPage />)

    await waitFor(() => {
      expect(screen.getByText("Create Competition")).toBeInTheDocument()
    })

    const createButton = screen.getByText("Create Competition")
    await user.click(createButton)

    expect(pushMock).toHaveBeenCalledWith("/competitions/create")
  })

  it("navigates to competition history page when button is clicked", async () => {
    const user = userEvent.setup()

    vi.mocked(competitionService.getCompetitions).mockResolvedValue([])

    render(<CompetitionsPage />)

    await waitFor(() => {
      expect(screen.getByText("Competition History")).toBeInTheDocument()
    })

    const historyButton = screen.getByText("Competition History")
    await user.click(historyButton)

    expect(pushMock).toHaveBeenCalledWith("/competitions/history")
  })

  it("shows delete dialog for competitions created by the user", async () => {
    const mockCompetitions = [
      {
        id: "comp-1",
        name: "My Competition",
        date_started: "2024-06-01",
        date_ending: "2025-12-31",
        created_by: "test-user-id",
      },
    ]

    vi.mocked(competitionService.getCompetitions).mockResolvedValue(
      mockCompetitions
    )
    vi.mocked(competitionService.deleteCompetition).mockResolvedValue(true)

    render(<CompetitionsPage />)

    await waitFor(() => {
      expect(screen.getByTestId("delete-dialog")).toBeInTheDocument()
    })
  })


  it("deletes competition when delete is confirmed", async () => {
    const user = userEvent.setup()

    const mockCompetitions = [
      {
        id: "comp-1",
        name: "My Competition",
        date_started: "2024-06-01",
        date_ending: "2025-12-31",
        created_by: "test-user-id",
      },
    ]

    vi.mocked(competitionService.getCompetitions).mockResolvedValue(
      mockCompetitions
    )
    vi.mocked(competitionService.deleteCompetition).mockResolvedValue(true)

    render(<CompetitionsPage />)

    await waitFor(() => {
      expect(screen.getByTestId("delete-button")).toBeInTheDocument()
    })

    const deleteButton = screen.getByTestId("delete-button")
    await user.click(deleteButton)

    await waitFor(() => {
      expect(competitionService.deleteCompetition).toHaveBeenCalledWith(
        "comp-1",
        "test-user-id"
      )
    })
  })


  it("renders competition links with correct hrefs", async () => {
    const mockCompetitions = [
      {
        id: "comp-1",
        name: "Summer Challenge",
        date_started: "2024-06-01",
        date_ending: "2025-12-31",
        created_by: "test-user-id",
      },
    ]

    vi.mocked(competitionService.getCompetitions).mockResolvedValue(
      mockCompetitions
    )

    renderWithSWR(<CompetitionsPage />)

    await waitFor(() => {
      const link = screen.getByText("Summer Challenge").closest("a")
      expect(link).toHaveAttribute("href", "/competitions/comp-1")
    })
  })
})

