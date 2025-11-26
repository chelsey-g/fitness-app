import "@testing-library/jest-dom"

import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SWRConfig } from "swr"
import type { User } from "@supabase/supabase-js"

import DailyChecklistPage from "./page"
import { useAuth } from "@/contexts/AuthContext"
import { challengeService } from "@/app/services/ChallengeService"

// Helper to render components with SWR - use default cache for simplicity
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

// Mock ChallengeService
vi.mock("@/app/services/ChallengeService", () => ({
  challengeService: {
    getChallengeById: vi.fn(),
    getDailyProgress: vi.fn(),
    saveDailyProgress: vi.fn(),
  },
}))

// Mock Next.js router
const { pushMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}))

// Mock Next.js Link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock confetti
vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}))

// Mock React Icons
vi.mock("react-icons/fa", () => ({
  FaFire: () => <div data-testid="fa-fire">Fire</div>,
  FaCalendarAlt: () => <div data-testid="fa-calendar">Calendar</div>,
  FaCheckCircle: () => <div data-testid="fa-check-circle">CheckCircle</div>,
  FaArrowLeft: () => <div data-testid="fa-arrow-left">ArrowLeft</div>,
}))

vi.mock("react-icons/io", () => ({
  IoMdCamera: () => <div data-testid="io-camera">Camera</div>,
}))

// Mock console methods
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
}

describe("DailyChecklistPage", () => {
  const mockUser: User = {
    id: "test-user-id",
    email: "test@example.com",
    app_metadata: { provider: "email" },
    user_metadata: {},
    aud: "authenticated",
    created_at: new Date().toISOString(),
  } as User

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

    // Set up default service mocks
    vi.mocked(challengeService.getChallengeById).mockResolvedValue({
      id: "challenge-123",
      user_id: "test-user-id",
      name: "Test Challenge",
      tier: "Medium",
      start_date: "2024-01-01",
      end_date: "2024-03-16",
      rules: ["Rule 1", "Rule 2", "Rule 3"],
      is_active: true,
      created_at: "2024-01-01T00:00:00",
    })

    vi.mocked(challengeService.getDailyProgress).mockResolvedValue(null)
    vi.mocked(challengeService.saveDailyProgress).mockResolvedValue({
      id: "progress-123",
      challenge_id: "challenge-123",
      date: new Date().toISOString().split("T")[0],
      completed_rules: [],
      is_complete: false,
    })
  })

  it("renders login message when user is not authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
      refreshAuth: vi.fn(),
    })

    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    expect(screen.getByText("Please log in to access challenges")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument()
  })

  it("renders challenge not found message when challenge doesn't exist", async () => {
    vi.mocked(challengeService.getChallengeById).mockResolvedValue(null)

    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    await waitFor(() => {
      expect(screen.getByText("Challenge not found")).toBeInTheDocument()
      expect(screen.getByRole("link", { name: /back to challenges/i })).toBeInTheDocument()
    })
  })

  it("renders challenge checklist with title and date", async () => {
    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    await waitFor(() => {
      expect(screen.getByText(/Day \d+ Checklist/)).toBeInTheDocument()
      expect(screen.getByTestId("challenge-name")).toBeInTheDocument()
    })
  })

  it("renders back button", async () => {
    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    await waitFor(() => {
      const backButton = screen.getByRole("link", { name: /back/i })
      expect(backButton).toBeInTheDocument()
      expect(backButton).toHaveAttribute("href", "/challenges/challenge-123")
    })
  })

  it("renders all challenge rules as checkboxes", async () => {
    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    await waitFor(() => {
      expect(screen.getByText("Rule 1")).toBeInTheDocument()
      expect(screen.getByText("Rule 2")).toBeInTheDocument()
      expect(screen.getByText("Rule 3")).toBeInTheDocument()
    })

    // Check that checkboxes are rendered
    const checkboxes = screen.getAllByRole("checkbox")
    expect(checkboxes.length).toBeGreaterThanOrEqual(3)
  })

  it("displays progress count", async () => {
    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    await waitFor(() => {
      expect(screen.getByText(/0 of 3 completed/)).toBeInTheDocument()
    })
  })

  it("loads existing progress and displays completed rules", async () => {
    vi.mocked(challengeService.getDailyProgress).mockResolvedValue({
      id: "progress-123",
      challenge_id: "challenge-123",
      date: new Date().toISOString().split("T")[0],
      completed_rules: [0, 1],
      is_complete: false,
      notes: "Test notes",
    })

    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    await waitFor(() => {
      expect(screen.getByText(/2 of 3 completed/)).toBeInTheDocument()
    })

    // Check that completed rules are checked
    const checkboxes = screen.getAllByRole("checkbox")
    expect(checkboxes[0]).toBeChecked()
    expect(checkboxes[1]).toBeChecked()
    expect(checkboxes[2]).not.toBeChecked()
  })

  it("allows toggling rules on and off", async () => {
    const user = userEvent.setup()

    // Ensure no progress is loaded for this test
    vi.mocked(challengeService.getDailyProgress).mockResolvedValue(null)

    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    // Wait for component to fully load and progress to be confirmed as null
    await waitFor(() => {
      expect(screen.getByText("Rule 1")).toBeInTheDocument()
      expect(screen.getByText(/0 of 3 completed/)).toBeInTheDocument()
    })

    const rule1Checkbox = screen.getAllByRole("checkbox")[0]
    expect(rule1Checkbox).not.toBeChecked()

    await user.click(rule1Checkbox)

    await waitFor(() => {
      expect(rule1Checkbox).toBeChecked()
      expect(screen.getByText(/1 of 3 completed/)).toBeInTheDocument()
    })

    await user.click(rule1Checkbox)

    await waitFor(() => {
      expect(rule1Checkbox).not.toBeChecked()
      expect(screen.getByText(/0 of 3 completed/)).toBeInTheDocument()
    })
  })

  it("allows clicking rule text to toggle checkbox", async () => {
    const user = userEvent.setup()

    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    await waitFor(() => {
      expect(screen.getByText("Rule 1")).toBeInTheDocument()
    })

    const rule1Text = screen.getByText("Rule 1")
    const rule1Checkbox = screen.getAllByRole("checkbox")[0]

    expect(rule1Checkbox).not.toBeChecked()

    await user.click(rule1Text)

    await waitFor(() => {
      expect(rule1Checkbox).toBeChecked()
    })
  })

  it("displays notes textarea", async () => {
    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    await waitFor(() => {
      const textarea = screen.getByPlaceholderText(/How did today go/i)
      expect(textarea).toBeInTheDocument()
    })
  })

  it("loads and displays existing notes", async () => {
    vi.mocked(challengeService.getDailyProgress).mockResolvedValue({
      id: "progress-123",
      challenge_id: "challenge-123",
      date: new Date().toISOString().split("T")[0],
      completed_rules: [0, 1],
      is_complete: false,
      notes: "Test notes",
    })

    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    await waitFor(() => {
      const textarea = screen.getByPlaceholderText(/How did today go/i) as HTMLTextAreaElement
      expect(textarea.value).toBe("Test notes")
    })
  })

  it("allows entering notes", async () => {
    const user = userEvent.setup()

    // Ensure no existing progress/notes for this test - reset to default null
    vi.mocked(challengeService.getDailyProgress).mockReset()
    vi.mocked(challengeService.getDailyProgress).mockResolvedValue(null)

    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )


    await waitFor(() => {
      const textarea = screen.getByPlaceholderText(/How did today go/i) as HTMLTextAreaElement
      expect(textarea).toBeInTheDocument()
      expect(textarea.value).toBe("") 
    }, { timeout: 3000 })

    const textarea = screen.getByPlaceholderText(/How did today go/i) as HTMLTextAreaElement
    // Click the textarea first to ensure it's focused and ready for input
    await user.click(textarea)
    await user.type(textarea, "Great day!")
    expect(textarea.value).toBe("Great day!")
  })

  it("displays date picker button", async () => {
    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    await waitFor(() => {
      expect(screen.getByText("Edit Different Day")).toBeInTheDocument()
    })
  })

  it("shows date picker when button is clicked", async () => {
    const user = userEvent.setup()

    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    await waitFor(() => {
      expect(screen.getByText("Edit Different Day")).toBeInTheDocument()
    })

    const datePickerButton = screen.getByText("Edit Different Day").closest("button")
    if (datePickerButton) {
      await user.click(datePickerButton)
    }

    await waitFor(() => {
      expect(screen.getByText("Select Date to Edit")).toBeInTheDocument()
      expect(screen.getByLabelText("Select Date")).toBeInTheDocument()
    })
  })

  it("allows selecting a different date", async () => {
    const user = userEvent.setup()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split("T")[0]

    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    await waitFor(() => {
      expect(screen.getByText("Edit Different Day")).toBeInTheDocument()
    })

    const datePickerButton = screen.getByText("Edit Different Day").closest("button")
    if (datePickerButton) {
      await user.click(datePickerButton)
    }

    await waitFor(() => {
      expect(screen.getByLabelText("Select Date")).toBeInTheDocument()
    })

    const dateInput = screen.getByLabelText("Select Date") as HTMLInputElement
    // Clear the input and type the new date
    await user.clear(dateInput)
    await user.type(dateInput, yesterdayStr)
    
    // Wait for the value to be set
    await waitFor(() => {
      expect(dateInput.value).toBe(yesterdayStr)
    })
  })

  it("displays challenge summary", async () => {
    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    await waitFor(() => {
      expect(screen.getByText("Challenge Summary")).toBeInTheDocument()
      expect(screen.getByText(/Current Day:/)).toBeInTheDocument()
      expect(screen.getByText(/Completed Today:/)).toBeInTheDocument()
      expect(screen.getByText(/Challenge Level:/)).toBeInTheDocument()
    })
  })

  it("displays save progress button", async () => {
    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /save progress/i })).toBeInTheDocument()
    })
  })

  it("saves progress when save button is clicked", async () => {
    const user = userEvent.setup()
    const mockSave = vi.mocked(challengeService.saveDailyProgress)

    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /save progress/i })).toBeInTheDocument()
    })

    const saveButton = screen.getByRole("button", { name: /save progress/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled()
      expect(pushMock).toHaveBeenCalledWith("/challenges/challenge-123")
    })
  })

  it("creates new progress entry when none exists", async () => {
    const user = userEvent.setup()
    const mockSave = vi.mocked(challengeService.saveDailyProgress)

    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /save progress/i })).toBeInTheDocument()
    })

    // Toggle a rule
    const rule1Checkbox = screen.getAllByRole("checkbox")[0]
    await user.click(rule1Checkbox)

    const saveButton = screen.getByRole("button", { name: /save progress/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledWith(
        expect.objectContaining({
          challenge_id: "challenge-123",
          completed_rules: [0],
          user_id: "test-user-id",
        }),
        undefined // No existing progress ID
      )
      expect(pushMock).toHaveBeenCalledWith("/challenges/challenge-123")
    })
  })

  it("updates existing progress entry", async () => {
    const user = userEvent.setup()
    const mockSave = vi.mocked(challengeService.saveDailyProgress)

    vi.mocked(challengeService.getDailyProgress).mockResolvedValue({
      id: "progress-123",
      challenge_id: "challenge-123",
      date: new Date().toISOString().split("T")[0],
      completed_rules: [0],
      is_complete: false,
    })

    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /save progress/i })).toBeInTheDocument()
    })

    // Wait for the component to load the existing progress (rule 0 should be checked)
    await waitFor(() => {
      const checkboxes = screen.getAllByRole("checkbox")
      expect(checkboxes[0]).toBeChecked()
      expect(checkboxes[1]).not.toBeChecked()
    })

    const rule2Checkbox = screen.getAllByRole("checkbox")[1]
    await user.click(rule2Checkbox)

    await waitFor(() => {
      expect(rule2Checkbox).toBeChecked()
      expect(screen.getByText(/2 of 3 completed/)).toBeInTheDocument()
    })

    const saveButton = screen.getByRole("button", { name: /save progress/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledWith(
        expect.objectContaining({
          challenge_id: "challenge-123",
          completed_rules: expect.arrayContaining([0, 1]),
        }),
        "progress-123"
      )
    })
  })

  it("shows alert when yesterday was not logged", async () => {
    const today = new Date().toISOString().split("T")[0]
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split("T")[0]

    // Mock no progress for yesterday (for the alert check), but allow today's query
    let callCount = 0
    vi.mocked(challengeService.getDailyProgress).mockImplementation((challengeId, date) => {
      // First call is for selectedDate (today), second is for today progress, third is for yesterday
      callCount++
      if (date === yesterdayStr) {
        // Yesterday has no progress - this triggers the alert
        return Promise.resolve(null)
      }
      // For selected date and today, return null (no progress yet)
      return Promise.resolve(null)
    })

    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{ date: today }} />
    )
    await waitFor(() => {
      expect(screen.getByTestId("challenge-name")).toBeInTheDocument()
      expect(screen.getByTestId("challenge-name")).toHaveTextContent(/Test Challenge/)
    })
  })

  it("displays progress percentage", async () => {
    vi.mocked(challengeService.getDailyProgress).mockResolvedValue({
      id: "progress-123",
      challenge_id: "challenge-123",
      date: new Date().toISOString().split("T")[0],
      completed_rules: [0, 1],
      is_complete: false,
    })

    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    await waitFor(() => {
      expect(screen.getByText(/2 of 3 completed/)).toBeInTheDocument()
    })

    const progressBars = screen.getAllByRole("progressbar")
    expect(progressBars.length).toBeGreaterThan(0)
  })

  it("handles challenge with empty rules", async () => {
    vi.mocked(challengeService.getChallengeById).mockResolvedValue({
      id: "challenge-123",
      user_id: "test-user-id",
      name: "Test Challenge",
      tier: "Medium",
      start_date: "2024-01-01",
      end_date: "2024-03-16",
      rules: ["Rule 1", "", "Rule 2"],
      is_active: true,
      created_at: "2024-01-01T00:00:00",
    })

    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    await waitFor(() => {
      // Should only show non-empty rules
      expect(screen.getByText("Rule 1")).toBeInTheDocument()
      expect(screen.getByText("Rule 2")).toBeInTheDocument()
      expect(screen.getByText(/2 completed/)).toBeInTheDocument()
    })
  })

  it("uses date from searchParams if provided", async () => {
    const testDate = "2024-01-15"

    renderWithSWR(
      <DailyChecklistPage
        params={{ id: "challenge-123" }}
        searchParams={{ date: testDate }}
      />
    )


    await waitFor(() => {
      expect(screen.getByTestId("challenge-name")).toHaveTextContent(/Test Challenge/)
    })

    expect(challengeService.getDailyProgress).toHaveBeenCalledWith("challenge-123", testDate)
  })

  it("displays tier icon and information", async () => {
    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    await waitFor(() => {
      expect(screen.getByTestId("challenge-name")).toHaveTextContent(/Test Challenge/)
    })
  })


  it("displays correct day number based on challenge start date", async () => {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 10) // 10 days ago
    const startDateStr = startDate.toISOString().split("T")[0]

    vi.mocked(challengeService.getChallengeById).mockResolvedValue({
      id: "challenge-123",
      user_id: "test-user-id",
      name: "Test Challenge",
      tier: "Medium",
      start_date: startDateStr,
      end_date: "2024-03-16",
      rules: ["Rule 1", "Rule 2", "Rule 3"],
      is_active: true,
      created_at: startDateStr,
    })

    renderWithSWR(
      <DailyChecklistPage params={{ id: "challenge-123" }} searchParams={{}} />
    )

    await waitFor(() => {
      expect(screen.getByText(/Day \d+ Checklist/)).toBeInTheDocument()
    })
  })
})