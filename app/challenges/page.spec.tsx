import "@testing-library/jest-dom"

import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SWRConfig } from "swr"
import { useAuth } from "@/contexts/AuthContext"
import { challengeService, Challenge } from "@/app/services/ChallengeService"
import type { User } from "@supabase/supabase-js"

import ChallengesPage from "./page"

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

// Mock ChallengeService
vi.mock("@/app/services/ChallengeService", () => ({
  challengeService: {
    getChallenges: vi.fn(),
    createChallenge: vi.fn(),
  },
  Challenge: {},
}))

// Mock Next.js Link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock Supabase client
vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [],
          error: null,
        })),
      })),
      insert: vi.fn(() => ({
        data: [],
        error: null,
      })),
    })),
  })),
}))

describe("ChallengesPage", () => {
  beforeEach(() => {
    // Clear mocks to ensure test isolation
    vi.mocked(challengeService.getChallenges).mockClear()
    vi.mocked(challengeService.createChallenge).mockClear()
    vi.mocked(useAuth).mockClear()

    // Set default auth value
    vi.mocked(useAuth).mockReturnValue({
      user: { id: "123" } as User,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
      refreshAuth: vi.fn(),
    })
  })

  it("renders the page title and description", () => {
    vi.mocked(challengeService.getChallenges).mockResolvedValue([])

    renderWithSWR(<ChallengesPage />)

    expect(screen.getByText("75 Day Challenge")).toBeInTheDocument()
    expect(
      screen.getByText("Transform your habits over 75 consecutive days")
    ).toBeInTheDocument()
  })

  it("renders create new challenge button", () => {
    vi.mocked(challengeService.getChallenges).mockResolvedValue([])

    renderWithSWR(<ChallengesPage />)

    expect(
      screen.getByRole("button", { name: /create new challenge/i })
    ).toBeInTheDocument()
  })

  it("shows challenge tiers when there is no active challenge", async () => {
    vi.mocked(challengeService.getChallenges).mockResolvedValue([])

    render(<ChallengesPage />)

    await waitFor(() => {
      expect(screen.getAllByText("Soft").length).toBeGreaterThan(0)
      expect(screen.getAllByText("Medium").length).toBeGreaterThan(0)
      expect(screen.getAllByText("Hard").length).toBeGreaterThan(0)
    })
  })

  it("displays challenge tier rules", async () => {
    vi.mocked(challengeService.getChallenges).mockResolvedValue([])

    renderWithSWR(<ChallengesPage />)

    await waitFor(() => {
      expect(
        screen.getByText("1x 30-minute workout")
      ).toBeInTheDocument()
      expect(
        screen.getByText("Drink 1/2 gallon of water")
      ).toBeInTheDocument()
      expect(
        screen.getByText("2x 30-minute workouts (1 must be outdoors)")
      ).toBeInTheDocument()
      expect(
        screen.getByText("2x 45-minute workouts (1 outdoors, rain or shine)")
      ).toBeInTheDocument()
    })
  })

  it("renders active challenge when one exists", async () => {
    const mockChallenge: Challenge = {
      id: 1,
      user_id: 123,
      name: "Hard Challenge",
      tier: "Hard",
      start_date: "2024-01-01",
      end_date: "2024-03-16",
      rules: [
        "2x 45-minute workouts (1 outdoors, rain or shine)",
        "Drink 1 gallon of water",
        "Read 10 pages of nonfiction",
      ],
      is_active: true,
      created_at: "2024-01-01T00:00:00",
    }

    vi.mocked(challengeService.getChallenges).mockResolvedValue([mockChallenge])

    renderWithSWR(<ChallengesPage />)

    await waitFor(() => {
      expect(screen.getByText("Hard Challenge")).toBeInTheDocument()
      expect(screen.getAllByText("Hard").length).toBeGreaterThan(0)
    })
  })

  it("displays active challenge rules", async () => {
    const mockChallenge: Challenge = {
      id: 1,
      user_id: 123,
      name: "Medium Challenge",
      tier: "Medium",
      start_date: "2024-01-01",
      end_date: "2024-03-16",
      rules: [
        "2x 30-minute workouts (1 must be outdoors)",
        "Drink 3/4 gallon of water",
        "Read 7 pages of nonfiction",
      ],
      is_active: true,
      created_at: "2024-01-01T00:00:00",
    }

    vi.mocked(challengeService.getChallenges).mockResolvedValue([mockChallenge])

    renderWithSWR(<ChallengesPage />)

    await waitFor(() => {
      expect(
        screen.getByText("2x 30-minute workouts (1 must be outdoors)")
      ).toBeInTheDocument()
      expect(screen.getByText("Drink 3/4 gallon of water")).toBeInTheDocument()
      expect(
        screen.getByText("Read 7 pages of nonfiction")
      ).toBeInTheDocument()
    })
  })

  it("displays progress information for active challenge", async () => {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - 10) // 10 days ago
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 74)

    const mockChallenge: Challenge = {
      id: 1,
      user_id: 123,
      name: "Active Challenge",
      tier: "Medium",
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      rules: ["Test rule"],
      is_active: true,
      created_at: startDate.toISOString(),
    }

    vi.mocked(challengeService.getChallenges).mockResolvedValue([mockChallenge])

    renderWithSWR(<ChallengesPage />)

    await waitFor(() => {
      expect(screen.getByText(/Day \d+ of 75/)).toBeInTheDocument()
      expect(screen.getByText(/% Complete/)).toBeInTheDocument()
    })
  })

  it("shows action buttons for active challenge", async () => {
    const mockChallenge: Challenge = {
      id: 1,
      user_id: 123,
      name: "Active Challenge",
      tier: "Soft",
      start_date: "2024-01-01",
      end_date: "2024-03-16",
      rules: ["Test rule"],
      is_active: true,
      created_at: "2024-01-01T00:00:00",
    }

    vi.mocked(challengeService.getChallenges).mockResolvedValue([mockChallenge])

    renderWithSWR(<ChallengesPage />)

    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: /complete today's tasks/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole("link", { name: /view progress/i })
      ).toBeInTheDocument()
      expect(screen.getByRole("link", { name: /edit/i })).toBeInTheDocument()
    })
  })

  it("opens create challenge form when button is clicked", async () => {
    const user = userEvent.setup()
    vi.mocked(challengeService.getChallenges).mockResolvedValue([])

    renderWithSWR(<ChallengesPage />)

    const createButton = screen.getByRole("button", {
      name: /create new challenge/i,
    })
    await user.click(createButton)

    await waitFor(() => {
      expect(
        screen.getByText("Start Your 75 Day Challenge")
      ).toBeInTheDocument()
    })
  })

  it("allows selecting a challenge tier in the form", async () => {
    const user = userEvent.setup()
    vi.mocked(challengeService.getChallenges).mockResolvedValue([])

    renderWithSWR(<ChallengesPage />)

    const createButton = screen.getByRole("button", {
      name: /create new challenge/i,
    })
    await user.click(createButton)

    await waitFor(() => {
      expect(screen.getByText("Choose Your Challenge Level")).toBeInTheDocument()
    })

    const nameInput = screen.getByPlaceholderText(/Medium Challenge/i)
    expect(nameInput).toBeInTheDocument()
  })

  it("allows entering a challenge name", async () => {
    const user = userEvent.setup()
    vi.mocked(challengeService.getChallenges).mockResolvedValue([])

    renderWithSWR(<ChallengesPage />)

    const createButton = screen.getByRole("button", {
      name: /create new challenge/i,
    })
    await user.click(createButton)

    await waitFor(async () => {
      const nameInput = screen.getByPlaceholderText(/Medium Challenge/i)
      expect(nameInput).toBeInTheDocument()

      await user.type(nameInput, "My Custom Challenge")
      expect(nameInput).toHaveValue("My Custom Challenge")
    })
  })

  it("allows selecting a start date", async () => {
    const user = userEvent.setup()
    vi.mocked(challengeService.getChallenges).mockResolvedValue([])

    renderWithSWR(<ChallengesPage />)

    const createButton = screen.getByRole("button", {
      name: /create new challenge/i,
    })
    await user.click(createButton)

    await waitFor(() => {
      const dateInput = screen.getByLabelText("Start Date") as HTMLInputElement
      expect(dateInput).toBeInTheDocument()
      expect(dateInput.type).toBe("date")
    })
  })

  it("displays end date based on start date", async () => {
    const user = userEvent.setup()
    vi.mocked(challengeService.getChallenges).mockResolvedValue([])

    renderWithSWR(<ChallengesPage />)

    const createButton = screen.getByRole("button", {
      name: /create new challenge/i,
    })
    await user.click(createButton)

    await waitFor(() => {
      expect(screen.getByText("Challenge End Date:")).toBeInTheDocument()
    })
  })

  it("creates a challenge when form is submitted", async () => {
    const user = userEvent.setup()
    const mockCreatedChallenge: Challenge = {
      id: 1,
      user_id: 123,
      name: "Test Challenge",
      tier: "Medium",
      start_date: "2024-01-01",
      end_date: "2024-03-16",
      rules: ["Rule 1", "Rule 2"],
      is_active: true,
      created_at: "2024-01-01T00:00:00",
    }

    vi.mocked(challengeService.getChallenges).mockResolvedValue([])
    vi.mocked(challengeService.createChallenge).mockResolvedValue([
      mockCreatedChallenge,
    ])

    renderWithSWR(<ChallengesPage />)

    const createButton = screen.getByRole("button", {
      name: /create new challenge/i,
    })
    await user.click(createButton)

    await waitFor(() => {
      const startButton = screen.getByRole("button", {
        name: /start challenge/i,
      })
      expect(startButton).toBeInTheDocument()
    })

    const startButton = screen.getByRole("button", { name: /start challenge/i })
    await user.click(startButton)

    await waitFor(() => {
      expect(challengeService.createChallenge).toHaveBeenCalled()
    })
  })

  it("cancels create challenge form", async () => {
    const user = userEvent.setup()
    vi.mocked(challengeService.getChallenges).mockResolvedValue([])

    renderWithSWR(<ChallengesPage />)

    const createButton = screen.getByRole("button", {
      name: /create new challenge/i,
    })
    await user.click(createButton)

    await waitFor(() => {
      expect(
        screen.getByText("Start Your 75 Day Challenge")
      ).toBeInTheDocument()
    })

    const cancelButton = screen.getByRole("button", { name: /cancel/i })
    await user.click(cancelButton)

    await waitFor(() => {
      expect(
        screen.queryByText("Start Your 75 Day Challenge")
      ).not.toBeInTheDocument()
    })
  })

  it("shows challenge history when toggle is clicked", async () => {
    const user = userEvent.setup()
    const mockChallenges: Challenge[] = [
      {
        id: 1,
        user_id: 123,
        name: "Past Challenge",
        tier: "Soft",
        start_date: "2023-01-01",
        end_date: "2023-03-16",
        rules: ["Rule 1"],
        is_active: false,
        created_at: "2023-01-01T00:00:00",
      },
      {
        id: 2,
        user_id: 123,
        name: "Active Challenge",
        tier: "Medium",
        start_date: "2024-01-01",
        end_date: "2024-03-16",
        rules: ["Rule 1"],
        is_active: true,
        created_at: "2024-01-01T00:00:00",
      },
    ]

    vi.mocked(challengeService.getChallenges).mockResolvedValue(mockChallenges)

    renderWithSWR(<ChallengesPage />)

    await waitFor(() => {
      expect(screen.getByText("Challenge History")).toBeInTheDocument()
    })

    // Click on the CardHeader text to toggle history
    const historyText = screen.getByText("Challenge History")
    await user.click(historyText)

    await waitFor(() => {
      expect(screen.getByText("Past Challenge")).toBeInTheDocument()
      // Active Challenge appears in both the active challenge card and history list
      expect(screen.getAllByText("Active Challenge").length).toBeGreaterThan(0)
    }, { timeout: 3000 })
  })

  it("renders challenge history links correctly", async () => {
    const user = userEvent.setup()
    const mockChallenges: Challenge[] = [
      {
        id: 1,
        user_id: 123,
        name: "Test Challenge",
        tier: "Hard",
        start_date: "2024-01-01",
        end_date: "2024-03-16",
        rules: ["Rule 1"],
        is_active: false,
        created_at: "2024-01-01T00:00:00",
      },
    ]

    vi.mocked(challengeService.getChallenges).mockResolvedValue(mockChallenges)

    renderWithSWR(<ChallengesPage />)

    await waitFor(() => {
      expect(screen.getByText("Challenge History")).toBeInTheDocument()
    })

    // Click on the CardHeader text to toggle history
    const historyText = screen.getByText("Challenge History")
    await user.click(historyText)

    await waitFor(() => {
      const viewLink = screen.getByRole("link", { name: /^View$/i })
      expect(viewLink).toHaveAttribute("href", "/challenges/1")
    }, { timeout: 3000 })
  })

  it("hides challenge tiers when active challenge exists", async () => {
    const mockChallenge: Challenge = {
      id: 1,
      user_id: 123,
      name: "Active Challenge",
      tier: "Medium",
      start_date: "2024-01-01",
      end_date: "2024-03-16",
      rules: ["Rule 1"],
      is_active: true,
      created_at: "2024-01-01T00:00:00",
    }

    vi.mocked(challengeService.getChallenges).mockResolvedValue([mockChallenge])

    renderWithSWR(<ChallengesPage />)

    await waitFor(() => {
      expect(screen.getByText("Current Challenge")).toBeInTheDocument()
    })

    // Challenge tiers should not be visible when active challenge exists
    expect(screen.queryByText("Choose Soft")).not.toBeInTheDocument()
  })

  it("does not fetch challenges when user is not authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
      refreshAuth: vi.fn(),
    })

    renderWithSWR(<ChallengesPage />)

    expect(challengeService.getChallenges).not.toHaveBeenCalled()
  })

  it("calls getChallenges with correct user id", async () => {
    vi.mocked(challengeService.getChallenges).mockResolvedValue([])
    // The component casts user.id as number, but if user.id is a string,
    // it will be passed as-is. The service expects a number.
    // Using a numeric value here to match service expectations
    const userId = 456
    vi.mocked(useAuth).mockReturnValue({
      user: { id: userId } as unknown as User,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
      refreshAuth: vi.fn(),
    })

    renderWithSWR(<ChallengesPage />)

    await waitFor(() => {
      expect(challengeService.getChallenges).toHaveBeenCalledWith(userId)
    })
  })
})

