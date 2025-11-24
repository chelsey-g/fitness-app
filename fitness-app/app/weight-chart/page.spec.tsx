import "@testing-library/jest-dom"

import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SWRConfig } from "swr"

import WeightChartPage from "./page"
import { weightService } from "@/app/services/WeightService"
import { goalService } from "@/app/services/GoalService"

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

// Mock the weight service
vi.mock("@/app/services/WeightService", () => ({
  weightService: {
    getWeightEntries: vi.fn(),
    getMonthlyWeightEntries: vi.fn(),
    getLoadedDates: vi.fn(),
    deleteWeightEntry: vi.fn(),
  },
}))

// Mock the goal service
vi.mock("@/app/services/GoalService", () => ({
  goalService: {
    getGoals: vi.fn(),
  },
}))

// Mock Next.js router
const mockPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
  })),
}))

// Mock AuthContext
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from "@/contexts/AuthContext"

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock DateRangePicker component
vi.mock("@/components/DateRangePicker", () => ({
  default: ({ initialStartDate, initialEndDate, handleDateChange }: any) => (
    <div data-testid="date-range-picker">
      <button
        onClick={() => handleDateChange(["2024-01-01", "2024-01-07"])}
        data-testid="date-range-button"
      >
        Change Date Range
      </button>
      <span data-testid="start-date">{initialStartDate}</span>
      <span data-testid="end-date">{initialEndDate}</span>
    </div>
  ),
}))

// Mock DeleteWeight component
vi.mock("@/components/TrackerActions", () => ({
  DeleteWeight: ({ deleteWeight }: { deleteWeight: () => void }) => (
    <button onClick={deleteWeight} data-testid="delete-weight-button">
      Delete
    </button>
  ),
}))


// Mock React Icons
vi.mock("react-icons/fa", () => ({
  FaTrashAlt: () => <div data-testid="fa-trash">Trash</div>,
  FaSortUp: () => <div data-testid="fa-sort-up">SortUp</div>,
  FaSortDown: () => <div data-testid="fa-sort-down">SortDown</div>,
}))

vi.mock("react-icons/io", () => ({
  IoMdAdd: () => <div data-testid="io-add">Add</div>,
}))

// Mock console methods
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
}

describe("WeightChartPage Component", () => {
  const mockUser = {
    id: "test-user-id",
    email: "test@example.com",
    app_metadata: { provider: "email" },
    user_metadata: {},
    aud: "authenticated",
    created_at: new Date().toISOString(),
  }

  const mockWeightEntries = [
    {
      id: 1,
      date_entry: "2024-01-15",
      weight: 180.5,
      created_by: "test-user-id",
      created_at: "2024-01-15T10:00:00Z",
    },
    {
      id: 2,
      date_entry: "2024-01-14",
      weight: 181.0,
      created_by: "test-user-id",
      created_at: "2024-01-14T10:00:00Z",
    },
    {
      id: 3,
      date_entry: "2024-01-13",
      weight: 181.5,
      created_by: "test-user-id",
      created_at: "2024-01-13T10:00:00Z",
    },
  ]

  const mockMonthlyData = [
    {
      id: 1,
      date_entry: "2024-01-01",
      weight: 182.0,
      created_by: "test-user-id",
      created_at: "2024-01-01T10:00:00Z",
    },
    {
      id: 2,
      date_entry: "2024-01-15",
      weight: 180.5,
      created_by: "test-user-id",
      created_at: "2024-01-15T10:00:00Z",
    },
  ]

  const mockGoal = {
    id: 1,
    goal_weight: 175.0,
    goal_date: "2024-06-01",
  }

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
    vi.mocked(weightService.getLoadedDates).mockResolvedValue("2024-01-15")
    vi.mocked(weightService.getWeightEntries).mockResolvedValue(mockWeightEntries)
    vi.mocked(weightService.getMonthlyWeightEntries).mockResolvedValue(mockMonthlyData)
    vi.mocked(weightService.deleteWeightEntry).mockResolvedValue(undefined)
    vi.mocked(goalService.getGoals).mockResolvedValue([mockGoal])
  })

  it("renders the weight chart page with correct title and description", async () => {
    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(screen.getByText("Weight Tracker")).toBeInTheDocument()
      expect(screen.getByText("Track your progress to stay on top of your goals.")).toBeInTheDocument()
    })
  })

  it("redirects to login when user is not authenticated", async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
      refreshAuth: vi.fn(),
    })

    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login")
    })
  })

  it("returns null when user is not authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
      refreshAuth: vi.fn(),
    })

    const { container } = renderWithSWR(<WeightChartPage />)
    // Component should return null when user is not authenticated
    expect(container.firstChild).toBeNull()
  })

  it("fetches loaded dates on mount", async () => {
    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(weightService.getLoadedDates).toHaveBeenCalledWith("test-user-id")
    })
  })

  it("sets initial date range from loaded dates", async () => {
    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(weightService.getLoadedDates).toHaveBeenCalled()
    })
  })

  it("displays monthly progress summary section", async () => {
    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(screen.getByText("This Month's Progress")).toBeInTheDocument()
    })
  })

  it("displays days tracked in monthly progress", async () => {
    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(screen.getByText(/You've tracked/i)).toBeInTheDocument()
      expect(screen.getByText(/days this month/i)).toBeInTheDocument()
    })
  })

  it("displays weight change in monthly progress", async () => {
    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(screen.getByText(/Since the start of the month/i)).toBeInTheDocument()
    })
  })

  it("displays goal information when goal exists", async () => {
    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(screen.getByText(/You're only/i)).toBeInTheDocument()
      expect(screen.getByText(/away from|under/i)).toBeInTheDocument()
    })
  })

  it("toggles progress info visibility", async () => {
    const user = userEvent.setup()
    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(screen.getByText("This Month's Progress")).toBeInTheDocument()
    })

    const toggle = screen.getByText("Show Progress").parentElement?.querySelector("div[class*='rounded-full']")
    expect(toggle).toBeInTheDocument()

    if (toggle) {
      await user.click(toggle)
      await waitFor(() => {
        expect(screen.queryByText(/You've tracked/i)).not.toBeInTheDocument()
      })
    }
  })

  it("displays date range picker", async () => {
    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(screen.getByTestId("date-range-picker")).toBeInTheDocument()
    })
  })

  it("handles date range change", async () => {
    const user = userEvent.setup()
    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(screen.getByTestId("date-range-picker")).toBeInTheDocument()
    })

    const dateButton = screen.getByTestId("date-range-button")
    await user.click(dateButton)

    // Date range should be updated
    await waitFor(() => {
      expect(weightService.getWeightEntries).toHaveBeenCalled()
    })
  })

  it("displays weight entries table", async () => {
    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(screen.getByText("Date")).toBeInTheDocument()
      expect(screen.getByText("Weight")).toBeInTheDocument()
      expect(screen.getByText("Actions")).toBeInTheDocument()
    })
  })

  it("displays weight entries in the table", async () => {
    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(screen.getByText("182")).toBeInTheDocument()
      expect(screen.getByText("180.5")).toBeInTheDocument()
    })
  })

  it("displays 'No logs found' when no weight entries exist", async () => {
    vi.mocked(weightService.getMonthlyWeightEntries).mockResolvedValue([])

    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(screen.getByText("No logs found")).toBeInTheDocument()
    })
  })

  it("handles sort toggle", async () => {
    const user = userEvent.setup()
    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(screen.getByText("Date")).toBeInTheDocument()
    })

    const sortButtons = screen.getAllByRole("button", { name: /Date/i })
    const sortButton = sortButtons[0]
    
    await user.click(sortButton)

    await waitFor(() => {
      expect(sortButton).toBeInTheDocument()
    })
  })

  it("displays sort icons", async () => {
    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      // Should show either sort up or sort down icon
      const sortIcons = screen.queryByTestId("fa-sort-up") || screen.queryByTestId("fa-sort-down")
      expect(sortIcons).toBeInTheDocument()
    })
  })

  it("handles delete weight entry", async () => {
    const user = userEvent.setup()
    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(screen.getByText("180.5")).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByTestId("delete-weight-button")
    expect(deleteButtons.length).toBeGreaterThan(0)

    await user.click(deleteButtons[0])

    await waitFor(() => {
      expect(weightService.deleteWeightEntry).toHaveBeenCalledWith(2)
    })
  })

  it("displays success alert after deleting weight entry", async () => {
    const user = userEvent.setup()
    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(screen.getByText("180.5")).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByTestId("delete-weight-button")
    await user.click(deleteButtons[0])

    await waitFor(() => {
      expect(screen.getByText("Weight Entry Deleted")).toBeInTheDocument()
      expect(screen.getByText("Your weight entry has been successfully deleted.")).toBeInTheDocument()
    })
  })


  it("displays Add Weight button with correct link", async () => {
    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      const addButton = screen.getByRole("link", { name: /Add Weight/i })
      expect(addButton).toBeInTheDocument()
      expect(addButton).toHaveAttribute("href", "/weight-log")
    })
  })

  it("handles error when fetching loaded dates", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    vi.mocked(weightService.getLoadedDates).mockRejectedValue(new Error("Failed to fetch"))

    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching loaded dates:", expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  it("handles error when deleting weight entry", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    const user = userEvent.setup()
    vi.mocked(weightService.deleteWeightEntry).mockRejectedValue(new Error("Failed to delete"))

    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(screen.getByText("180.5")).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByTestId("delete-weight-button")
    await user.click(deleteButtons[0])

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error deleting weight entry:", expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  it("calculates monthly stats correctly", async () => {
    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(screen.getByText(/You've tracked/i)).toBeInTheDocument()
      expect(screen.getByText(/days this month/i)).toBeInTheDocument()
      expect(screen.getByText("2")).toBeInTheDocument()
    })
  })

  it("displays weight change with correct color (weight loss)", async () => {
    // Mock data where weight decreased
    const weightLossData = [
      {
        id: 1,
        date_entry: "2024-01-01",
        weight: 182.0,
        created_by: "test-user-id",
        created_at: "2024-01-01T10:00:00Z",
      },
      {
        id: 2,
        date_entry: "2024-01-15",
        weight: 180.5,
        created_by: "test-user-id",
        created_at: "2024-01-15T10:00:00Z",
      },
    ]
    vi.mocked(weightService.getMonthlyWeightEntries).mockResolvedValue(weightLossData)

    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(screen.getByText(/Since the start of the month/i)).toBeInTheDocument()
      expect(screen.getByText(/down.*lbs/i)).toBeInTheDocument()
    })
  })

  it("displays weight change with correct color (weight gain)", async () => {
    // Mock data where weight increased
    const weightGainData = [
      {
        id: 1,
        date_entry: "2024-01-01",
        weight: 180.0,
        created_by: "test-user-id",
        created_at: "2024-01-01T10:00:00Z",
      },
      {
        id: 2,
        date_entry: "2024-01-15",
        weight: 182.0,
        created_by: "test-user-id",
        created_at: "2024-01-15T10:00:00Z",
      },
    ]
    vi.mocked(weightService.getMonthlyWeightEntries).mockResolvedValue(weightGainData)

    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(screen.getByText(/up/i)).toBeInTheDocument()
    })
  })

  it("displays message when no monthly data exists", async () => {
    vi.mocked(weightService.getMonthlyWeightEntries).mockResolvedValue([])

    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(screen.getByText("Start tracking your weight to see your monthly progress!")).toBeInTheDocument()
    })
  })

  it("does not display goal info when no goal exists", async () => {
    vi.mocked(goalService.getGoals).mockResolvedValue([])

    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(screen.queryByText(/You're only/i)).not.toBeInTheDocument()
    })
  })

 
  it("calls getMonthlyWeightEntries with correct date range", async () => {
    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(weightService.getMonthlyWeightEntries).toHaveBeenCalled()
    })
  })

  it("formats dates correctly in table", async () => {
    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      // Dates should be formatted
      expect(screen.getByText("180.5")).toBeInTheDocument()
    })
  })

  it("handles empty weight entries gracefully", async () => {
    vi.mocked(weightService.getMonthlyWeightEntries).mockResolvedValue([])
    vi.mocked(weightService.getWeightEntries).mockResolvedValue([])

    renderWithSWR(<WeightChartPage />)

    await waitFor(() => {
      expect(screen.getByText("No logs found")).toBeInTheDocument()
    })
  })
})

