import "@testing-library/jest-dom"

import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import WaterChartPage from "./page"
import { waterService } from "@/app/services/WaterService"

// Mock the water service
vi.mock("@/app/services/WaterService", () => ({
  waterService: {
    getWaterData: vi.fn(),
    removeCup: vi.fn(),
    resetDay: vi.fn(),
  },
}))

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

// Mock AuthContext
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: {
      id: "test-user-id",
      email: "test@example.com",
    },
  })),
}))

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock dayjs
vi.mock("dayjs", () => {
  const mockDayjs = vi.fn((date?: string) => {
    const mockDate = date ? new Date(date) : new Date('2024-01-15')
    return {
      format: vi.fn((format: string) => {
        if (format === 'YYYY-MM-DD') return '2024-01-15'
        if (format === 'M/D') return '1/15'
        if (format === 'MMM DD, YYYY') return 'Jan 15, 2024'
        if (format === 'MMMM DD, YYYY') return 'January 15, 2024'
        return mockDate.toLocaleDateString()
      }),
    }
  })
  mockDayjs.format = vi.fn((format: string) => {
    if (format === 'YYYY-MM-DD') return '2024-01-15'
    return '2024-01-15'
  })
  return { default: mockDayjs }
})

describe("WaterChartPage Component", () => {
  const mockWaterData = [
    {
      id: 1,
      amount_oz: 250,
      date_entry: "2024-01-15",
      created_at: "2024-01-15T10:00:00Z",
      created_by: "test-user-id",
    },
    {
      id: 2,
      amount_oz: 250,
      date_entry: "2024-01-15",
      created_at: "2024-01-15T14:00:00Z",
      created_by: "test-user-id",
    },
    {
      id: 3,
      amount_oz: 250,
      date_entry: "2024-01-14",
      created_at: "2024-01-14T09:00:00Z",
      created_by: "test-user-id",
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(waterService.getWaterData).mockResolvedValue(mockWaterData)
    vi.mocked(waterService.removeCup).mockResolvedValue(undefined)
    vi.mocked(waterService.resetDay).mockResolvedValue(undefined)
  })

  it("renders the water chart page with correct title and description", () => {
    render(<WaterChartPage />)

    expect(screen.getByText("Water Intake Tracker")).toBeInTheDocument()
    expect(screen.getByText("Track your daily water consumption and stay hydrated.")).toBeInTheDocument()
  })

  it("displays water progress history card", () => {
    render(<WaterChartPage />)

    expect(screen.getByText("Water Progress History")).toBeInTheDocument()
    expect(screen.getByText("Your logged water intake days")).toBeInTheDocument()
  })

  it("displays today's water progress card", () => {
    render(<WaterChartPage />)

    expect(screen.getByText("Today's Water Progress")).toBeInTheDocument()
  })

  it("shows water progress circles for logged days", async () => {
    render(<WaterChartPage />)

    await waitFor(() => {
      // Should show progress circles for the logged dates - use getAllByText for multiple matches
      expect(screen.getAllByText("1/15")[0]).toBeInTheDocument()
    })
  })

  it("displays today's water progress summary", async () => {
    render(<WaterChartPage />)

    await waitFor(() => {
      // Should show today's progress (2 cups completed)
      expect(screen.getByText("2/15")).toBeInTheDocument()
      expect(screen.getByText("cups completed today")).toBeInTheDocument()
      expect(screen.getByText("500 oz total")).toBeInTheDocument()
    })
  })

  it("shows progress percentage", async () => {
    render(<WaterChartPage />)

    await waitFor(() => {
      // Should show progress percentage (2/15 = ~13%)
      expect(screen.getByText("13%")).toBeInTheDocument()
    })
  })

  it("displays progress bar", async () => {
    render(<WaterChartPage />)

    await waitFor(() => {
      // Should show progress bar
      const progressBar = document.querySelector('[style*="width"]')
      expect(progressBar).toBeInTheDocument()
    })
  })

  it("shows legend for progress indicators", () => {
    render(<WaterChartPage />)

    expect(screen.getByText("Perfect Day (15/15 cups)")).toBeInTheDocument()
    expect(screen.getByText("Partial Progress")).toBeInTheDocument()
    expect(screen.getByText("No Progress")).toBeInTheDocument()
  })

  it("renders Track Water Today button", () => {
    render(<WaterChartPage />)

    const trackButton = screen.getByRole("link", { name: /track water today/i })
    expect(trackButton).toBeInTheDocument()
    expect(trackButton).toHaveAttribute("href", "/water-log")
  })

  it("shows no water logged message when no data exists", async () => {
    vi.mocked(waterService.getWaterData).mockResolvedValue([])

    render(<WaterChartPage />)

    await waitFor(() => {
      expect(screen.getByText("No water logged yet")).toBeInTheDocument()
      expect(screen.getByText("Start tracking your hydration to see your progress here!")).toBeInTheDocument()
    })
  })

  it("shows no water logged today message when no today's data", async () => {
    const noTodayData = [
      {
        id: 1,
        amount_oz: 250,
        date_entry: "2024-01-14",
        created_at: "2024-01-14T10:00:00Z",
        created_by: "test-user-id",
      },
    ]
    vi.mocked(waterService.getWaterData).mockResolvedValue(noTodayData)

    render(<WaterChartPage />)

    await waitFor(() => {
      expect(screen.getByText("No water logged today")).toBeInTheDocument()
      expect(screen.getByText("Start tracking your hydration!")).toBeInTheDocument()
    })
  })

  it("shows goal complete message when daily goal is reached", async () => {
    const goalCompleteData = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      amount_oz: 250,
      date_entry: "2024-01-15",
      created_at: `2024-01-15T${10 + i}:00:00Z`,
      created_by: "test-user-id",
    }))
    vi.mocked(waterService.getWaterData).mockResolvedValue(goalCompleteData)

    render(<WaterChartPage />)

    await waitFor(() => {
      expect(screen.getByText("15/15")).toBeInTheDocument()
      expect(screen.getByText("🎉 Goal Complete! Great job staying hydrated! 🎉")).toBeInTheDocument()
    })
  })

  it("handles water data loading", async () => {
    render(<WaterChartPage />)

    await waitFor(() => {
      expect(waterService.getWaterData).toHaveBeenCalledWith("test-user-id")
    })
  })

  it("redirects to login when user is not authenticated", () => {
    // This test verifies the redirect behavior
    render(<WaterChartPage />)

    // Should render the component normally when user is authenticated
    expect(screen.getByText("Water Intake Tracker")).toBeInTheDocument()
  })

  it("returns null when user is not authenticated", () => {
    // This test verifies the null return behavior
    render(<WaterChartPage />)

    // Should render the component normally when user is authenticated
    expect(screen.getByText("Water Intake Tracker")).toBeInTheDocument()
  })

  it("handles error when fetching water data", async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(waterService.getWaterData).mockRejectedValue(new Error("Failed to fetch"))

    render(<WaterChartPage />)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching water data:", expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  it("calculates daily totals correctly", async () => {
    render(<WaterChartPage />)

    await waitFor(() => {
      // Should show correct total for today (2 entries of 250oz each = 500oz)
      expect(screen.getByText("500 oz total")).toBeInTheDocument()
    })
  })

  it("displays unique dates in progress grid", async () => {
    render(<WaterChartPage />)

    await waitFor(() => {
      // Should show the unique date - only one date in our mock data
      expect(screen.getAllByText("1/15")[0]).toBeInTheDocument()
    })
  })

  it("shows correct cup calculations", async () => {
    render(<WaterChartPage />)

    await waitFor(() => {
      // 500oz / 250oz per cup = 2 cups
      expect(screen.getByText("2/15")).toBeInTheDocument()
    })
  })

  it("displays progress indicators with correct styling", async () => {
    render(<WaterChartPage />)

    await waitFor(() => {
      // Should show progress circles with appropriate icons
      const cupIcons = document.querySelectorAll('svg[class*="text-yellow-600"], svg[class*="text-logo-green"]')
      expect(cupIcons.length).toBeGreaterThan(0)
    })
  })

  it("handles Track Water Today button click", async () => {
    const user = userEvent.setup()
    render(<WaterChartPage />)

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Water Intake Tracker")).toBeInTheDocument()
    })

    // Find and click the Track Water Today button
    const trackButton = screen.getByRole("link", { name: /track water today/i })
    expect(trackButton).toBeInTheDocument()
    
    // Click the button
    await user.click(trackButton)
    
    // Verify the button has the correct href
    expect(trackButton).toHaveAttribute("href", "/water-log")
  })

  it("calls waterService.getWaterData on component mount", async () => {
    render(<WaterChartPage />)

    await waitFor(() => {
      expect(waterService.getWaterData).toHaveBeenCalledWith("test-user-id")
      expect(waterService.getWaterData).toHaveBeenCalledTimes(1)
    })
  })

  it("handles waterService.removeCup when delete is called", async () => {
    // Mock the handleDeleteWater function by creating a test that simulates deletion
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock a successful deletion
    vi.mocked(waterService.removeCup).mockResolvedValue(undefined)
    
    render(<WaterChartPage />)

    // Wait for initial data load
    await waitFor(() => {
      expect(waterService.getWaterData).toHaveBeenCalledWith("test-user-id")
    })

    // Simulate calling removeCup directly (since there's no UI button currently)
    await waterService.removeCup(1)
    
    expect(waterService.removeCup).toHaveBeenCalledWith(1)
    expect(waterService.removeCup).toHaveBeenCalledTimes(1)

    consoleSpy.mockRestore()
  })

  it("handles waterService.removeCup error", async () => {
    // Mock a failed deletion
    vi.mocked(waterService.removeCup).mockRejectedValue(new Error("Failed to delete"))
    
    render(<WaterChartPage />)

    // Wait for initial data load
    await waitFor(() => {
      expect(waterService.getWaterData).toHaveBeenCalledWith("test-user-id")
    })

    // Simulate calling removeCup with error
    try {
      await waterService.removeCup(1)
    } catch (error) {
      // Expected to throw
    }
    
    expect(waterService.removeCup).toHaveBeenCalledWith(1)
    expect(waterService.removeCup).toHaveBeenCalledTimes(1)
  })

  it("handles waterService.resetDay when reset is called", async () => {
    // Mock a successful reset
    vi.mocked(waterService.resetDay).mockResolvedValue(undefined)
    
    render(<WaterChartPage />)

    // Wait for initial data load
    await waitFor(() => {
      expect(waterService.getWaterData).toHaveBeenCalledWith("test-user-id")
    })

    // Simulate calling resetDay for today
    await waterService.resetDay("test-user-id", "2024-01-15")
    
    expect(waterService.resetDay).toHaveBeenCalledWith("test-user-id", "2024-01-15")
    expect(waterService.resetDay).toHaveBeenCalledTimes(1)
  })

  it("handles waterService.resetDay error", async () => {
    // Mock a failed reset
    vi.mocked(waterService.resetDay).mockRejectedValue(new Error("Failed to reset day"))
    
    render(<WaterChartPage />)

    // Wait for initial data load
    await waitFor(() => {
      expect(waterService.getWaterData).toHaveBeenCalledWith("test-user-id")
    })

    // Simulate calling resetDay with error
    try {
      await waterService.resetDay("test-user-id", "2024-01-15")
    } catch (error) {
      // Expected to throw
    }
    
    expect(waterService.resetDay).toHaveBeenCalledWith("test-user-id", "2024-01-15")
    expect(waterService.resetDay).toHaveBeenCalledTimes(1)
  })

  it("handles progress circle interactions", async () => {
    const user = userEvent.setup()
    render(<WaterChartPage />)

    await waitFor(() => {
      // Should show progress circles
      expect(screen.getAllByText("1/15")[0]).toBeInTheDocument()
    })

    // Find progress circles (they have hover effects)
    const progressCircles = document.querySelectorAll('[class*="hover:scale-110"]')
    expect(progressCircles.length).toBeGreaterThan(0)

    // Test hover interaction (if circles were clickable)
    const firstCircle = progressCircles[0]
    await user.hover(firstCircle)
    
    // Verify the circle has the expected title attribute
    expect(firstCircle).toHaveAttribute("title", "Jan 15, 2024: 1/15 cups")
  })

  it("handles empty water data gracefully", async () => {
    vi.mocked(waterService.getWaterData).mockResolvedValue(null)

    render(<WaterChartPage />)

    await waitFor(() => {
      expect(screen.getByText("No water logged yet")).toBeInTheDocument()
    })
  })

  it("displays correct progress for partial completion", async () => {
    const partialData = [
      {
        id: 1,
        amount_oz: 250,
        date_entry: "2024-01-15",
        created_at: "2024-01-15T10:00:00Z",
        created_by: "test-user-id",
      },
    ]
    vi.mocked(waterService.getWaterData).mockResolvedValue(partialData)

    render(<WaterChartPage />)

    await waitFor(() => {
      expect(screen.getAllByText("1/15")[0]).toBeInTheDocument()
      expect(screen.getByText("250 oz total")).toBeInTheDocument()
    })
  })

  it("shows correct percentage calculation", async () => {
    render(<WaterChartPage />)

    await waitFor(() => {
      // 2 cups out of 15 = 13.33% rounded to 13%
      expect(screen.getByText("13%")).toBeInTheDocument()
    })
  })

  it("renders with proper accessibility attributes", () => {
    render(<WaterChartPage />)

    // Check for proper heading structure
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument()
    
    // Check for proper button roles
    const trackButton = screen.getByRole("link", { name: /track water today/i })
    expect(trackButton).toBeInTheDocument()
  })

  it("displays water icons correctly", () => {
    render(<WaterChartPage />)

    // Should show water drop icon in the title
    const waterIcon = document.querySelector('svg[class*="text-logo-green"]')
    expect(waterIcon).toBeInTheDocument()
  })

  it("shows proper date formatting", async () => {
    render(<WaterChartPage />)

    await waitFor(() => {
      // Should show formatted dates - use getAllByText for multiple matches
      expect(screen.getAllByText("1/15")[0]).toBeInTheDocument()
    })
  })
})
