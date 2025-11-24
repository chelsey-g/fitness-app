import "@testing-library/jest-dom"

import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { User } from "@supabase/supabase-js"

import CompetitionPage from "./page"
import { useAuth } from "@/contexts/AuthContext"
import { createClient } from "@/utils/supabase/client"
import { competitionService } from "@/app/services/CompetitionService"


vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: {
      id: "test-user-id",
      email: "test@example.com",
      app_metadata: { provider: "email" },
      user_metadata: { first_name: "John", last_name: "Doe" },
      aud: "authenticated",
      created_at: new Date().toISOString(),
    },
    isLoading: false,
    session: null,
    signOut: vi.fn(),
    refreshAuth: vi.fn(),
  })),
}))

// Mock supabase client
const { mockSupabaseClient, mockSingle } = vi.hoisted(() => {
  const mockSingle = vi.fn()
  const queryBuilder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: mockSingle,
    delete: vi.fn().mockReturnThis(),
    match: vi.fn(),
  }
  
  return {
    mockSupabaseClient: {
      from: vi.fn(() => queryBuilder),
    },
    mockSingle,
  }
})

vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(() => mockSupabaseClient),
})) 

// Mock Next.js router
const { pushMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}))

// Mock CompetitionService
vi.mock("@/app/services/CompetitionService", () => ({
  competitionService: {
    getCompetitionById: vi.fn(),
    getCompetitions: vi.fn(),
    getCompetitionHistory: vi.fn(),
    createCompetition: vi.fn(),
    deleteCompetition: vi.fn(),
  },
}))

// Mock functions
vi.mock("@/app/functions", () => ({
  getAwardColor: vi.fn((position: number) => {
    if (position === 1) return "text-yellow-500"
    if (position === 2) return "text-gray-500"
    if (position === 3) return "text-yellow-800"
    return ""
  }),
  getOrdinalSuffix: vi.fn((num: number) => {
    if (num === 1) return "1st"
    if (num === 2) return "2nd"
    if (num === 3) return "3rd"
    const suffixes = ["th", "st", "nd", "rd"]
    const v = num % 100
    const mod = ((v - 20) % 10 + 10) % 10 // Handle negative modulo
    return num + (suffixes[mod] || suffixes[v] || suffixes[0])
  }),
}))

// // Mock React Icons
// vi.mock("react-icons/tb", () => ({
//   TbAwardFilled: () => <div data-testid="award-icon">Award</div>,
// }))

// vi.mock("react-icons/gi", () => ({
//   GiTrophyCup: () => <div data-testid="trophy-icon">Trophy</div>,
// }))

// Mock LeaveCompetition component
vi.mock("@/components/LeaveCompetition", () => ({
  default: ({ leaveCompetition }: { leaveCompetition: () => void }) => (
    <button
      data-testid="leave-competition-button"
      onClick={leaveCompetition}
    >
      Leave Competition
    </button>
  ),
}))


// Mock window.alert
global.alert = vi.fn()

// Mock console methods
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
}

describe("CompetitionPage", () => {
  

  beforeEach(() => {
    vi.clearAllMocks()
    // Set up default Supabase mock response
    mockSingle.mockResolvedValue({
      data: {
        id: "comp-123",
        name: "Summer Challenge",
        date_started: "2024-06-01",
        date_ending: "2024-07-01",
        created_by: "creator-id",
        created_at: "2024-05-01",
        has_prizes: false,

        rules: "No cheating allowed",
        competitions_players: [
            {
                player_id: "test-user-id",
                profiles: {
                    id: "test-user-id",
                    first_name: "John",
                    last_name: "Doe",
                },
            },
            {
                player_id: "test-user-id-2",
                profiles: {
                    id: "test-user-id-2",
                    first_name: "Jane",
                    last_name: "Smith",
                },
            },
        ],
      },
      error: null,
    })
  })

  it("redirects to login when user is not authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      session: null,
      signOut: vi.fn(),
      refreshAuth: vi.fn(),
    })

    render(<CompetitionPage params={{ id: "comp-123" }} />)

    expect(pushMock).toHaveBeenCalledWith("/login")
  })

  it("shows loading state when data is loading", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: "test-user-id",
        email: "test@example.com",
        app_metadata: { provider: "email" },
        user_metadata: { first_name: "John", last_name: "Doe" },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      },
      isLoading: true,
      session: null,
      signOut: vi.fn(),
      refreshAuth: vi.fn(),
    })

    render(<CompetitionPage params={{ id: "comp-123" }} />)

    expect(screen.getByText("Loading competition...")).toBeInTheDocument()
  })

  it("renders competition name and details", async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: "test-user-id",
        email: "test@example.com",
        app_metadata: { provider: "email" },
        user_metadata: { first_name: "John", last_name: "Doe" },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as User,
      isLoading: false,
      session: null,
      signOut: vi.fn(),
      refreshAuth: vi.fn(),
    })

    

    render(<CompetitionPage params={{ id: "comp-123" }} />)

    await waitFor(() => {
      expect(screen.getByTestId("competition-name")).toHaveTextContent("Summer Challenge")
    })
  })

  it("renders competition start and end dates", async () => {
    render(<CompetitionPage params={{ id: "comp-123" }} />)

    await waitFor(() => {
      expect(screen.getByText("Start Date")).toBeInTheDocument()
      expect(screen.getByText("End Date")).toBeInTheDocument()
    })
  })

  it("renders competition progress bar", async () => {
    render(<CompetitionPage params={{ id: "comp-123" }} />)

    await waitFor(() => {
      expect(screen.getByText("Competition Progress")).toBeInTheDocument()
    })
  })

  it("renders player leaderboard table", async () => {
    mockSingle.mockResolvedValue({
      data: {
        id: "comp-123",
        name: "Summer Challenge",
        date_started: "2024-06-01",
        date_ending: "2024-07-01",
        created_by: "creator-id",
        created_at: "2024-05-01",
        rules: "No cheating allowed",
        has_prizes: true,
        prizes: [
          {place: 1, type: "money", reward: 100},
          {place: 2, type: "money", reward: 50},
          {place: 3, type: "money", reward: 25},
        ],
        competitions_players: [
          {
            player_id: "test-user-id",
            profiles: {
              id: "test-user-id",
              first_name: "John",
              last_name: "Doe",
              weight_tracker: [],
            },
          },
          {
            player_id: "test-user-id-2",
            profiles: {
              id: "test-user-id-2",
              first_name: "Jane",
              last_name: "Smith",
              weight_tracker: [],
            },
          },
        ],
      },
      error: null,
    })

    render(<CompetitionPage params={{ id: "comp-123" }} />)

    // Wait for competition to load first
    await waitFor(() => {
      expect(screen.getByTestId("competition-name")).toHaveTextContent("Summer Challenge")
    })
  })

  it("renders player names in the leaderboard", async () => {
    render(<CompetitionPage params={{ id: "comp-123" }} />)

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument()
      expect(screen.getByText("Jane Smith")).toBeInTheDocument()
    })
  })

  it("renders prizes when competition has prizes", async () => {
    mockSingle.mockResolvedValue({
      data: {
        id: "comp-123",
        name: "Summer Challenge",
        date_started: "2024-06-01",
        date_ending: "2024-07-01",
        created_by: "creator-id",
        created_at: "2024-05-01",
        has_prizes: true,
        prizes: [
          {
            place: 1,
            type: "money",
            reward: 100,
          },
          {
            place: 2,
            type: "money",
            reward: 50,
          },
          {
            place: 3,
            type: "money",
            reward: 25,
          },
        ],
        rules: "No cheating allowed",
        competitions_players: [
          {
            player_id: "test-user-id",
            profiles: {
              id: "test-user-id",
              first_name: "John",
              last_name: "Doe",
              weight_tracker: [
                {weight: 200, date_entry: "2024-06-01"},
                {weight: 190, date_entry: "2024-06-02"},
                {weight: 180, date_entry: "2024-06-03"},
                {weight: 170, date_entry: "2024-06-04"},
                {weight: 160, date_entry: "2024-06-05"},
                {weight: 150, date_entry: "2024-06-06"},
                {weight: 140, date_entry: "2024-06-07"},
                {weight: 130, date_entry: "2024-06-08"},
                {weight: 121, date_entry: "2024-06-09"},
              ],
            },
          },
          {
            player_id: "test-user-id-2",
            profiles: {
              id: "test-user-id-2",
              first_name: "Jane",
              last_name: "Smith",
              weight_tracker: [
                {weight: 200, date_entry: "2024-06-01"},
                {weight: 190, date_entry: "2024-06-02"},
                {weight: 180, date_entry: "2024-06-03"},
                {weight: 170, date_entry: "2024-06-04"},
                {weight: 160, date_entry: "2024-06-05"},
                {weight: 150, date_entry: "2024-06-06"},
                {weight: 140, date_entry: "2024-06-07"},
                {weight: 130, date_entry: "2024-06-08"},
                {weight: 120, date_entry: "2024-06-09"},
              ],
            }
          },
        ],
      },
      error: null,
    })

    render(<CompetitionPage params={{ id: "comp-123" }} />)

    await waitFor(() => {
      expect(screen.getByTestId("competition-name")).toHaveTextContent("Summer Challenge")
    })

    
    await waitFor(() => {
      expect(screen.getByText("2nd")).toBeInTheDocument()
    })
  })

  it("renders rules when competition has rules", async () => {
    render(<CompetitionPage params={{ id: "comp-123" }} />)

    await waitFor(() => {
      expect(screen.getByText("Rules")).toBeInTheDocument()
      expect(screen.getByText("No cheating allowed")).toBeInTheDocument()
    })
  })

  it("renders 'Your Progress' section for the current user", async () => {
    render(<CompetitionPage params={{ id: "comp-123" }} />)

    await waitFor(() => {
      expect(screen.getByText("Your Progress")).toBeInTheDocument()
      expect(screen.getByText("Current Rank")).toBeInTheDocument()
      expect(screen.getByTestId("progress-header")).toBeInTheDocument()
      expect(screen.getByText("Last Updated")).toBeInTheDocument()
    })
  })

  it("shows Leave Competition button when user is not the creator", async () => {
    render(<CompetitionPage params={{ id: "comp-123" }} />)

    await waitFor(() => {
      expect(
        screen.getByTestId("leave-competition-button")
      ).toBeInTheDocument()
    })
  })

  it("handles leaving competition successfully", async () => {
    const user = userEvent.setup()
  
    vi.mocked(competitionService.deleteCompetition).mockResolvedValue(true)

    render(<CompetitionPage params={{ id: "comp-123" }} />)

    await waitFor(() => {
      expect(
        screen.getByTestId("leave-competition-button")
      ).toBeInTheDocument()
    })

    await user.click(screen.getByTestId("leave-competition-button"))

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/competitions")
    })
  })

  it("handles error when leaving competition fails", async () => {
    const user = userEvent.setup()
    vi.mocked(competitionService.deleteCompetition).mockRejectedValue(
      new Error("Failed to leave")
    )

    render(<CompetitionPage params={{ id: "comp-123" }} />)

    await waitFor(() => {
      expect(
        screen.getByTestId("leave-competition-button")
      ).toBeInTheDocument()
    })

    await user.click(screen.getByTestId("leave-competition-button"))

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        "Failed to leave competition. Please try again."
      )
    })
  })

  it("handles competition without prizes", async () => {
    const competitionWithoutPrizes = {
      ...mockSingle.mockResolvedValue({
        data: {
          id: "comp-123",
          name: "Summer Challenge",
          date_started: "2024-06-01",
          date_ending: "2024-07-01",
          created_by: "test-user-id",
          has_prizes: false,
          prizes: [],
        },
        error: null,
      }),
      has_prizes: false,
      prizes: [],
    }


    render(<CompetitionPage params={{ id: "comp-123" }} />)

    await waitFor(() => {
      expect(screen.getByText("Summer Challenge")).toBeInTheDocument()
      expect(screen.queryByText("Prize")).not.toBeInTheDocument()
    })
  })
})

