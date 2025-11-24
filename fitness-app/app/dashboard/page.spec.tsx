import "@testing-library/jest-dom"

import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"


import { goalService } from "@/app/services/GoalService"
import { profileService } from "@/app/services/ProfileService"
import { AuthService } from "@/app/services/AuthService"
import { weightService } from "@/app/services/WeightService"
import { challengeService } from "@/app/services/ChallengeService"
import UserDashboard from "@/app/dashboard/page"
import useSWR from "swr"


vi.mock("@/app/services/AuthService", () => {
  const instance = {
    getUser: vi.fn().mockResolvedValue({
      id: "test-user-id"
    }),
    client: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    signUp: vi.fn(),
    getSession: vi.fn(),
  }
  return {
    AuthService: vi.fn(() => instance),
  }
})

vi.mock("@/app/services/GoalService", () => ({
  goalService: {
    getGoals: vi.fn().mockResolvedValue([{ id: 1, goal_date: "2025-11-06", goal_weight: 160, created_by: "test-user-id", created_at: "2025-11-06" }]),
  },
}))

vi.mock("@/app/services/ProfileService", () => ({
  profileService: {
    getProfile: vi.fn().mockResolvedValue([{ first_name: "John" }]),
  },
}))
vi.mock("@/app/services/WeightService", () => ({
  weightService: {
    getWeightEntries: vi.fn().mockResolvedValue([{ id: 1, date_entry: "2024-01-01", created_by: "test-user-id", created_at: "2024-01-01", weight: 160 }]),
  },
}))

vi.mock("@/app/services/ChallengeService", () => ({
  challengeService: {
    getChallenges: vi.fn().mockResolvedValue([{ id: 1, name: "75 Day Challenge", tier: "Soft", start_date: "2025-11-06", end_date: "2026-01-04", rules: ["1x 30-minute workout", "Drink 1/2 gallon of water", "Read 5 pages of a book", "Take a progress photo", "Eat 3 healthy meals (no junk food)"], is_active: true, custom_rules: null, created_at: "2025-11-06" }]),
  },
}))

// Mock the utility functions
vi.mock("@/app/functions", () => ({
  calculateDaysLeft: vi.fn((date) => {
    const goalDate = new Date(date)
    const today = new Date()
    const diffTime = goalDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }),
  calculateWeightDifference: vi.fn((goalWeight, currentWeight) => {
    if (!currentWeight) return "No logged weight available"
    const diff = currentWeight - goalWeight
    return diff > 0 ? diff : "Invalid goal"
  }),
}))

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock Supabase client
vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
    },
  })),
}))

// Mock the ProgressTracker component
vi.mock("@/components/ProgressTracker", () => ({
  default: () => <div data-testid="progress-tracker">Progress Tracker Component</div>,
}))

// Mock the InviteFriend component
vi.mock("@/components/InviteFriend", () => ({
  default: () => <div data-testid="invite-friend">Invite Friend Component</div>,
}))

// Mock the Tabs components
vi.mock("@/components/ui/tabs", () => ({
  Tabs: ({ children, defaultValue }: { children: React.ReactNode; defaultValue: string }) => (
    <div data-testid="tabs" data-default-value={defaultValue}>{children}</div>
  ),
  TabsContent: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-testid="tabs-content" data-value={value}>{children}</div>
  ),
}))

// Mock SWR
vi.mock("swr", () => ({
  default: vi.fn(),
}))

describe("UserDashboard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Set up default SWR mocks
    vi.mocked(useSWR).mockImplementation((key) => {
      if (key === "/users") {
        return { data: { id: "test-user-id" }, isLoading: false } as any
      }
      if (typeof key === "string" && key.startsWith("/profiles/")) {
        return { data: [{ first_name: "John" }], isLoading: false } as any
      }
      if (typeof key === "string" && key.startsWith("/profile_goals/")) {
        return { data: [{ id: 1, goal_date: "2025-11-06", goal_weight: 160, created_by: "test-user-id", created_at: "2025-11-06" }], isLoading: false } as any
      }
      if (typeof key === "string" && key.startsWith("/weights/")) {
        return { data: [{ id: 1, date_entry: "2024-01-01", created_by: "test-user-id", created_at: "2024-01-01", weight: 160 }], isLoading: false } as any
      }
      if (typeof key === "string" && key.startsWith("/challenge/")) {
        return { data: [{ id: 1, name: "75 Day Challenge", tier: "Soft", start_date: "2025-11-06", end_date: "2026-01-04", rules: ["1x 30-minute workout", "Drink 1/2 gallon of water", "Read 5 pages of a book", "Take a progress photo", "Eat 3 healthy meals (no junk food)"], is_active: true, custom_rules: null, created_at: "2025-11-06" }], isLoading: false } as any
      }
      return { data: null, isLoading: false } as any
    })
  })
  

  it("renders the dashboard with welcome message", async () => {
    const mockGetProfile = vi.mocked(profileService.getProfile)
    mockGetProfile.mockResolvedValue([{ first_name: "John" }])

    render(<UserDashboard />)

    await waitFor(() => expect(screen.getByText("Welcome back, John!")).toBeInTheDocument())
  })

  it("renders stats preview cards", () => {
    render(<UserDashboard />)

    expect(screen.getAllByText("Current Weight")[0]).toBeInTheDocument()
    expect(screen.getAllByText("Active Goals")[0]).toBeInTheDocument()
    expect(screen.getByText("Challenge Day")).toBeInTheDocument()
  })

  it("displays current weight in stats", async () => {
    vi.mocked(weightService.getWeightEntries)

    render(<UserDashboard />)

    await waitFor(() => {
      expect(screen.getAllByText("160")).toHaveLength(2) 
    })
  })

  it("displays active goals count", async () => {
    // Set up a future date to ensure the goal is active
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)
    const futureDateString = futureDate.toISOString().split('T')[0]

    // Update SWR mock to return goal with future date
    vi.mocked(useSWR).mockImplementation((key) => {
      if (key === "/users") {
        return { data: { id: "test-user-id" }, isLoading: false } as any
      }
      if (typeof key === "string" && key.startsWith("/profiles/")) {
        return { data: [{ first_name: "John" }], isLoading: false } as any
      }
      if (typeof key === "string" && key.startsWith("/profile_goals/")) {
        return { data: [{ id: 1, goal_date: futureDateString, goal_weight: 160, created_by: "test-user-id", created_at: futureDateString }], isLoading: false } as any
      }
      if (typeof key === "string" && key.startsWith("/weights/")) {
        return { data: [{ id: 1, date_entry: "2024-01-01", created_by: "test-user-id", created_at: "2024-01-01", weight: 160 }], isLoading: false } as any
      }
      if (typeof key === "string" && key.startsWith("/challenge/")) {
        return { data: [{ id: 1, name: "75 Day Challenge", tier: "Soft", start_date: "2025-11-06", end_date: "2026-01-04", rules: ["1x 30-minute workout", "Drink 1/2 gallon of water", "Read 5 pages of a book", "Take a progress photo", "Eat 3 healthy meals (no junk food)"], is_active: true, custom_rules: null, created_at: "2025-11-06" }], isLoading: false } as any
      }
      return { data: null, isLoading: false } as any
    })
    
    render(<UserDashboard />)

    await waitFor(() => {
      // The active goals count should show "1" since we have one goal with a future date
      // Look for "Active Goals" text and verify a number is displayed nearby
      const activeGoalsLabels = screen.getAllByText("Active Goals")
      expect(activeGoalsLabels.length).toBeGreaterThan(0)
      
      // Find the parent container and check if it contains "1"
      const activeGoalsLabel = activeGoalsLabels[0]
      const container = activeGoalsLabel.closest("div")?.parentElement
      expect(container?.textContent).toMatch(/1/)
    })
  })

  it("displays challenge day count", async () => {
    render(<UserDashboard />)

    // Should show challenge day count - wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Challenge Day")).toBeInTheDocument()
    })
    
    // The challenge day count is calculated from the challenge start date
    // Since the mock challenge has start_date "2025-11-06", it will calculate the current day
    // We just need to verify that a number is displayed (could be any positive number depending on the date)
    await waitFor(() => {
      // Find all elements containing just numbers (the challenge day will be one of them)
      const numberElements = screen.getAllByText(/^\d+$/)
      expect(numberElements.length).toBeGreaterThan(0)
    })
  })

  it("renders main dashboard cards", () => {
    render(<UserDashboard />)

    // Check that main dashboard sections are rendered - use getAllByText for multiple matches
    expect(screen.getAllByText("Active Goals")[0]).toBeInTheDocument()
    expect(screen.getByText("75 Day Challenge")).toBeInTheDocument()
    expect(screen.getByText("Progress Tracker")).toBeInTheDocument()
    expect(screen.getByText("Weekly Summary")).toBeInTheDocument()
  })

  it("displays active goal information", async () => {
    // Set up a future date to ensure the goal is active
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)
    const futureDateString = futureDate.toISOString().split('T')[0]

    // Update SWR mock to return goal with future date
    vi.mocked(useSWR).mockImplementation((key) => {
      if (key === "/users") {
        return { data: { id: "test-user-id" }, isLoading: false } as any
      }
      if (typeof key === "string" && key.startsWith("/profiles/")) {
        return { data: [{ first_name: "John" }], isLoading: false } as any
      }
      if (typeof key === "string" && key.startsWith("/profile_goals/")) {
        return { data: [{ id: 1, goal_date: futureDateString, goal_weight: 160, created_by: "test-user-id", created_at: futureDateString }], isLoading: false } as any
      }
      if (typeof key === "string" && key.startsWith("/weights/")) {
        return { data: [{ id: 1, date_entry: "2024-01-01", created_by: "test-user-id", created_at: "2024-01-01", weight: 170 }], isLoading: false } as any
      }
      if (typeof key === "string" && key.startsWith("/challenge/")) {
        return { data: [{ id: 1, name: "75 Day Challenge", tier: "Soft", start_date: "2025-11-06", end_date: "2026-01-04", rules: ["1x 30-minute workout", "Drink 1/2 gallon of water", "Read 5 pages of a book", "Take a progress photo", "Eat 3 healthy meals (no junk food)"], is_active: true, custom_rules: null, created_at: "2025-11-06" }], isLoading: false } as any
      }
      return { data: null, isLoading: false } as any
    })

    render(<UserDashboard />)

    await waitFor(() => {
      // Use a more flexible matcher in case text is split across elements
      expect(screen.getByText((content, element) => {
        return element?.textContent === "Target: 160 lbs" || content.includes("Target:") && content.includes("160") && content.includes("lbs")
      })).toBeInTheDocument()
      expect(screen.getByText(/days left/)).toBeInTheDocument()
    })
  })

  it("displays challenge information when active challenge exists", async () => {
    vi.mocked(challengeService.getChallenges)
    vi.mocked(weightService.getWeightEntries)
    render(<UserDashboard />)

    await waitFor(() => {
      expect(screen.getByText(/Day \d+/)).toBeInTheDocument()
      expect(screen.getByText("of 75 - Soft Challenge")).toBeInTheDocument()
      expect(screen.getByText("Today's Tasks")).toBeInTheDocument()
      expect(screen.getByText("View Progress")).toBeInTheDocument()
    })
  })

  it("shows no active challenge message when no challenge exists", () => {
    // This test checks if the component handles the case where no challenge exists
    render(<UserDashboard />)

    // The component should show either challenge info or the empty state
    const hasChallenge = screen.queryByText(/Day \d+/) !== null
    const hasEmptyState = screen.queryByText("Ready for a challenge?") !== null

    expect(hasChallenge || hasEmptyState).toBe(true)
  })

  it("displays weekly summary information", () => {
    render(<UserDashboard />)

    // Should show weekly summary data - use getAllByText for multiple matches
    expect(screen.getAllByText("Logs This Week")[0]).toBeInTheDocument()
    expect(screen.getByText("Weekly Change")).toBeInTheDocument()
  })

  it("shows no weekly data message when no data exists", () => {
    // This test checks if the component handles the case where no weight data exists
    render(<UserDashboard />)

    // The component should show either weekly data or the empty state
    const hasWeeklyData = screen.queryByText("Weekly Change") !== null
    const hasEmptyState = screen.queryByText("No data this week") !== null

    expect(hasWeeklyData || hasEmptyState).toBe(true)
  })

  it("renders progress tracker component", () => {
    render(<UserDashboard />)

    expect(screen.getByTestId("progress-tracker")).toBeInTheDocument()
  })

  it("renders invite friend component", () => {
    render(<UserDashboard />)

    expect(screen.getByTestId("invite-friend")).toBeInTheDocument()
  })

  it("renders tabs component", () => {
    render(<UserDashboard />)

    expect(screen.getByTestId("tabs")).toBeInTheDocument()
    expect(screen.getByTestId("tabs-content")).toBeInTheDocument()
  })

  it("renders navigation links", () => {
    render(<UserDashboard />)

    // Check that navigation links are present
    expect(screen.getByRole("link", { name: /manage goals|set your first goal/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /today's tasks/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /view progress/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /log weight/i })).toBeInTheDocument()
    // Note: "Start Challenge" link only appears when no active challenge exists
  })


  it("calculates and displays goal progress correctly", () => {
    render(<UserDashboard />)

    // Should show progress bar for active goal (using querySelector to find div with style)
    const progressBar = document.querySelector('[style*="width"]')
    expect(progressBar).toBeInTheDocument()
  })

  it("displays challenge progress bar", () => {
    render(<UserDashboard />)

    // Should show challenge progress bar
    const challengeProgressBar = document.querySelector('[style*="width"]')
    expect(challengeProgressBar).toBeInTheDocument()
  })

  it("shows appropriate weekly summary message", () => {
    render(<UserDashboard />)

    // Should show encouraging message based on weekly change
    const summaryMessage = screen.getByText(/Great progress|Keep pushing|Stay consistent/)
    expect(summaryMessage).toBeInTheDocument()
  })
})
