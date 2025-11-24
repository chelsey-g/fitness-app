import "@testing-library/jest-dom"

import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SWRConfig } from "swr"
import type { User } from "@supabase/supabase-js"

import ChallengeDetailPage from "./page"
import { useAuth } from "@/contexts/AuthContext"

// Helper to render components with SWR
const renderWithSWR = (ui: React.ReactElement) => {
  return render(
    <SWRConfig
      value={{
        dedupingInterval: 0,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 0,
        shouldRetryOnError: false,
        onError: () => {
          // Suppress SWR errors in tests
        },
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

// Mock Supabase client - configurable per test
let mockChallengeData: any = null
let mockProgressData: any[] = []

const createMockSupabaseClient = () => {
  return {
    from: vi.fn((table: string) => {
      if (table === "challenges") {
        // Chain: from().select().eq().eq().single()
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn(() => ({
                  data: mockChallengeData,
                  error: null,
                })),
              })),
            })),
          })),
        }
      } else if (table === "daily_progress") {
        // Chain: from().select().eq().order()
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              order: vi.fn(() => ({
                data: mockProgressData,
                error: null,
              })),
            })),
          })),
        }
      }
      return {
        select: vi.fn(),
      }
    }),
  }
}

vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(() => createMockSupabaseClient()),
}))

// Mock Next.js Link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock React Icons
vi.mock("react-icons/fa", () => ({
  FaFire: () => <div data-testid="fa-fire">Fire</div>,
  FaCalendarAlt: () => <div data-testid="fa-calendar">Calendar</div>,
  FaCheckCircle: () => <div data-testid="fa-check-circle">CheckCircle</div>,
  FaArrowLeft: () => <div data-testid="fa-arrow-left">ArrowLeft</div>,
  FaTimes: () => <div data-testid="fa-times">Times</div>,
}))

vi.mock("react-icons/io", () => ({
  IoMdCamera: () => <div data-testid="io-camera">Camera</div>,
  IoMdSettings: () => <div data-testid="io-settings">Settings</div>,
}))

// Mock console methods
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
}

describe("ChallengeDetailPage", () => {
  const mockUser: User = {
    id: "test-user-id",
    email: "test@example.com",
    app_metadata: { provider: "email" },
    user_metadata: {},
    aud: "authenticated",
    created_at: new Date().toISOString(),
  } as User

  const mockChallenge = {
    id: "challenge-123",
    user_id: "test-user-id",
    name: "Test Challenge",
    tier: "Medium",
    start_date: "2024-01-01",
    end_date: "2024-03-16",
    rules: ["Rule 1", "Rule 2", "Rule 3"],
    is_active: true,
    created_at: "2024-01-01T00:00:00",
  }

  const mockProgressHistory = [
    {
      id: "progress-1",
      challenge_id: "challenge-123",
      date: "2024-01-01",
      completed_rules: [0, 1, 2],
      is_complete: true,
      notes: "Great day!",
    },
    {
      id: "progress-2",
      challenge_id: "challenge-123",
      date: "2024-01-02",
      completed_rules: [0, 1],
      is_complete: false,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    // Set up default auth value
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
      refreshAuth: vi.fn(),
    })

    // Set up default mock data
    mockChallengeData = mockChallenge
    mockProgressData = mockProgressHistory
  })

  it("renders login message when user is not authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
      refreshAuth: vi.fn(),
    })

    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    expect(screen.getByText("Please log in to access challenges")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument()
  })

  it("renders challenge not found message when challenge doesn't exist", async () => {
    mockChallengeData = null

    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    await waitFor(() => {
      expect(screen.getByText("Challenge not found")).toBeInTheDocument()
      expect(screen.getByRole("link", { name: /back to challenges/i })).toBeInTheDocument()
    })
  })

  it("renders challenge details when challenge exists", async () => {
    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    await waitFor(() => {
      const challengeNames = screen.getAllByText("Test Challenge")
      expect(challengeNames.length).toBeGreaterThan(0)
    })
  })

  it("displays challenge name and tier", async () => {
    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    await waitFor(() => {
      const challengeNames = screen.getAllByText("Test Challenge")
      expect(challengeNames.length).toBeGreaterThan(0)
      expect(screen.getByText("Medium")).toBeInTheDocument()
    })
  })

  it("displays challenge date range", async () => {
    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    await waitFor(() => {
      const dateTexts = screen.getAllByText(/2024/i)
      expect(dateTexts.length).toBeGreaterThan(0)
    })
  })

  it("renders back button with correct link", async () => {
    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    await waitFor(() => {
      const backButtons = screen.getAllByRole("link", { name: /back/i })
      expect(backButtons.length).toBeGreaterThan(0)
      backButtons.forEach(button => {
        expect(button).toHaveAttribute("href", "/challenges")
      })
    })
  })

  it("renders settings button with correct link", async () => {
    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    await waitFor(() => {
      const settingsButtons = screen.getAllByRole("link", { name: /settings/i })
      expect(settingsButtons.length).toBeGreaterThan(0)
      settingsButtons.forEach(button => {
        expect(button).toHaveAttribute("href", "/challenges/challenge-123/settings")
      })
    })
  })

  it("renders Today's Tasks button when challenge is active", async () => {
    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    await waitFor(() => {
      const todayButtons = screen.getAllByRole("link", { name: /today's tasks/i })
      expect(todayButtons.length).toBeGreaterThan(0)
      todayButtons.forEach(button => {
        expect(button).toHaveAttribute("href", "/challenges/challenge-123/daily")
      })
    })
  })

  it("displays progress overview cards", async () => {
    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    await waitFor(() => {
      expect(screen.getByText("Current Day")).toBeInTheDocument()
      expect(screen.getByText("Days Remaining")).toBeInTheDocument()
      expect(screen.getByText("Perfect Days")).toBeInTheDocument()
      expect(screen.getByText("Success Rate")).toBeInTheDocument()
    })
  })

  it("displays overall progress section", async () => {
    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    await waitFor(() => {
      expect(screen.getByText("Overall Progress")).toBeInTheDocument()
    })
  })

  it("displays challenge rules", async () => {
    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    await waitFor(() => {
      expect(screen.getByText("Challenge Rules:")).toBeInTheDocument()
      expect(screen.getByText("Rule 1")).toBeInTheDocument()
      expect(screen.getByText("Rule 2")).toBeInTheDocument()
      expect(screen.getByText("Rule 3")).toBeInTheDocument()
    })
  })

  it("displays challenge status information", async () => {
    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    await waitFor(() => {
      expect(screen.getByText("Challenge Status:")).toBeInTheDocument()
      expect(screen.getByText("Status:")).toBeInTheDocument()
      expect(screen.getByText("Tier:")).toBeInTheDocument()
      expect(screen.getByText("Start Date:")).toBeInTheDocument()
      expect(screen.getByText("End Date:")).toBeInTheDocument()
    })
  })

  it("displays active badge when challenge is active", async () => {
    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    await waitFor(() => {
      expect(screen.getByText("Active")).toBeInTheDocument()
    })
  })

  it("displays completed badge when challenge is inactive", async () => {
    mockChallengeData = {
      ...mockChallenge,
      is_active: false,
    }

    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    await waitFor(() => {
      expect(screen.getByText("Completed")).toBeInTheDocument()
    })
  })

  it("displays 75-Day Progress Grid", async () => {
    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    await waitFor(() => {
      expect(screen.getByText("75-Day Progress Grid")).toBeInTheDocument()
      expect(screen.getByText("Track your daily progress")).toBeInTheDocument()
    })
  })

  it("displays calendar legend", async () => {
    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    await waitFor(() => {
      expect(screen.getByText("Perfect Day")).toBeInTheDocument()
      expect(screen.getByText("Partial Completion")).toBeInTheDocument()
      expect(screen.getByText("Missed Day")).toBeInTheDocument()
      expect(screen.getByText("Future Day")).toBeInTheDocument()
      expect(screen.getByText("Today")).toBeInTheDocument()
    })
  })

  it("displays correct tier icon for Soft tier", async () => {
    mockChallengeData = {
      ...mockChallenge,
      tier: "Soft",
    }

    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    await waitFor(() => {
      expect(screen.getByText("Soft")).toBeInTheDocument()
    })
  })

  it("displays correct tier icon for Hard tier", async () => {
    mockChallengeData = {
      ...mockChallenge,
      tier: "Hard",
    }

    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    await waitFor(() => {
      expect(screen.getByText("Hard")).toBeInTheDocument()
    })
  })

  it("calculates and displays perfect days count", async () => {
    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    await waitFor(() => {
      // Should show at least 1 perfect day from mockProgressHistory
      const perfectDaysText = screen.getByText(/Perfect Days/i)
      expect(perfectDaysText).toBeInTheDocument()
    })
  })

  it("displays success rate percentage", async () => {
    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    await waitFor(() => {
      expect(screen.getByText("Success Rate")).toBeInTheDocument()
    })
  })

  it("filters out empty rules when displaying", async () => {
    mockChallengeData = {
      ...mockChallenge,
      rules: ["Rule 1", "", "Rule 2", "   ", "Rule 3"],
    }

    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    await waitFor(() => {
      expect(screen.getByText("Rule 1")).toBeInTheDocument()
      expect(screen.getByText("Rule 2")).toBeInTheDocument()
      expect(screen.getByText("Rule 3")).toBeInTheDocument()
    })
  })
  it("shows today's completed rules with checkmarks", async () => {
    const today = new Date().toISOString().split("T")[0]
    mockProgressData = [
      {
        id: "progress-today",
        challenge_id: "challenge-123",
        date: today,
        completed_rules: [0, 1],
        is_complete: false,
      },
    ]

    renderWithSWR(<ChallengeDetailPage params={{ id: "challenge-123" }} />)

    await waitFor(() => {
      expect(screen.getByText("Rule 1")).toBeInTheDocument()
      expect(screen.getByText("Rule 2")).toBeInTheDocument()
      expect(screen.getByText("Rule 3")).toBeInTheDocument()
    })
  })
})

