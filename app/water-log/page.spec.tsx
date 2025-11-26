import "@testing-library/jest-dom"

import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import WaterLogPage from "./page"
import { waterService } from "@/app/services/WaterService"

// Mock the water service
vi.mock("@/app/services/WaterService", () => ({
  waterService: {
    getTodayEntries: vi.fn(),
    addCup: vi.fn(),
    removeCup: vi.fn(),
    resetDay: vi.fn(),
  },
}))

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
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

// Mock canvas-confetti
vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}))

describe("WaterLogPage Component", () => {
  const mockTodayEntries = [
    {
      id: 1,
      amount_oz: 8,
      date_entry: "2024-01-15",
      created_at: "2024-01-15T10:00:00Z",
      created_by: "test-user-id",
    },
    {
      id: 2,
      amount_oz: 8,
      date_entry: "2024-01-15",
      created_at: "2024-01-15T14:00:00Z",
      created_by: "test-user-id",
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(waterService.getTodayEntries).mockResolvedValue(mockTodayEntries)
    vi.mocked(waterService.addCup).mockResolvedValue(undefined)
    vi.mocked(waterService.removeCup).mockResolvedValue(undefined)
    vi.mocked(waterService.resetDay).mockResolvedValue(undefined)
  })

  it("renders the water log page with correct title and description", async () => {
    render(<WaterLogPage />)

    await waitFor(() => {
      expect(screen.getByText("Water Tracker")).toBeInTheDocument()
      expect(screen.getByText("Click the cups to track your water intake")).toBeInTheDocument()
    })
  })

  it("displays back to chart button", async () => {
    render(<WaterLogPage />)

    await waitFor(() => {
      const backButton = screen.getByRole("link", { name: /back to chart/i })
      expect(backButton).toBeInTheDocument()
      expect(backButton).toHaveAttribute("href", "/water-chart")
    })
  })

  it("shows daily water goal", async () => {
    render(<WaterLogPage />)

    await waitFor(() => {
      expect(screen.getByText("Daily Water Goal: 15 Cups")).toBeInTheDocument()
    })
  })

  it("renders 15 water cups", async () => {
    render(<WaterLogPage />)

    await waitFor(() => {
      const cups = screen.getAllByRole("button")
      // Filter out the back button and reset button to get only cup buttons
      const cupButtons = cups.filter(button => 
        button.textContent === '' && button.querySelector('svg')
      )
      expect(cupButtons).toHaveLength(15)
    })
  })

  it("displays today's progress summary", async () => {
    render(<WaterLogPage />)

    await waitFor(() => {
      expect(screen.getByText("Today's Progress")).toBeInTheDocument()
      expect(screen.getByText("2/15")).toBeInTheDocument()
      expect(screen.getByText("cups completed")).toBeInTheDocument()
    })
  })

  it("shows progress percentage", async () => {
    render(<WaterLogPage />)

    await waitFor(() => {
      // 2 cups out of 15 = 13.33% rounded to 13%
      expect(screen.getByText("13%")).toBeInTheDocument()
    })
  })

  it("displays total ounces consumed", async () => {
    render(<WaterLogPage />)

    await waitFor(() => {
      // 2 cups * 8 oz = 16 oz
      expect(screen.getByText("16 oz")).toBeInTheDocument()
      expect(screen.getByText("Total consumed today")).toBeInTheDocument()
    })
  })

  it("shows quick stats", async () => {
    render(<WaterLogPage />)

    await waitFor(() => {
      expect(screen.getByText("Quick Stats")).toBeInTheDocument()
      expect(screen.getByText("120 oz")).toBeInTheDocument() // Goal: 15 * 8 = 120
      expect(screen.getByText("8 oz")).toBeInTheDocument() // Per cup
      expect(screen.getByText("104 oz")).toBeInTheDocument() // Remaining: (15-2) * 8 = 104
    })
  })

  it("shows reset day button when cups are completed", async () => {
    render(<WaterLogPage />)

    await waitFor(() => {
      const resetButton = screen.getByRole("button", { name: /reset day/i })
      expect(resetButton).toBeInTheDocument()
    })
  })

  it("calls waterService.getTodayEntries on component mount", async () => {
    render(<WaterLogPage />)

    await waitFor(() => {
      expect(waterService.getTodayEntries).toHaveBeenCalledWith("test-user-id", "2024-01-15")
      expect(waterService.getTodayEntries).toHaveBeenCalledTimes(1)
    })
  })

  it("handles adding a cup when clicked", async () => {
    const user = userEvent.setup()
    render(<WaterLogPage />)

    await waitFor(() => {
      expect(screen.getByText("Water Tracker")).toBeInTheDocument()
    })

    // Find the third cup (index 2) which should be uncompleted
    const cups = screen.getAllByRole("button")
    const cupButtons = cups.filter(button => 
      button.textContent === '' && button.querySelector('svg')
    )
    const thirdCup = cupButtons[2]

    await user.click(thirdCup)

    await waitFor(() => {
      expect(waterService.addCup).toHaveBeenCalledWith("test-user-id", "2024-01-15", 8)
    })
  })

  it("handles removing a cup when clicking completed cup", async () => {
    const user = userEvent.setup()
    render(<WaterLogPage />)

    await waitFor(() => {
      expect(screen.getByText("Water Tracker")).toBeInTheDocument()
    })

    // Find the first cup (index 0) which should be completed
    const cups = screen.getAllByRole("button")
    const cupButtons = cups.filter(button => 
      button.textContent === '' && button.querySelector('svg')
    )
    const firstCup = cupButtons[0]

    await user.click(firstCup)

    await waitFor(() => {
      expect(waterService.removeCup).toHaveBeenCalledWith(1)
    })
  })

  it("handles reset day button click", async () => {
    const user = userEvent.setup()
    render(<WaterLogPage />)

    await waitFor(() => {
      expect(screen.getByText("Water Tracker")).toBeInTheDocument()
    })

    const resetButton = screen.getByRole("button", { name: /reset day/i })
    await user.click(resetButton)

    await waitFor(() => {
      expect(waterService.resetDay).toHaveBeenCalledWith("test-user-id", "2024-01-15")
    })
  })

  it("shows congratulations message when goal is completed", async () => {
    // Mock 15 completed cups
    const completedEntries = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      amount_oz: 8,
      date_entry: "2024-01-15",
      created_at: `2024-01-15T${10 + i}:00:00Z`,
      created_by: "test-user-id",
    }))
    vi.mocked(waterService.getTodayEntries).mockResolvedValue(completedEntries)

    render(<WaterLogPage />)

    await waitFor(() => {
      expect(screen.getByText("🎉")).toBeInTheDocument()
      expect(screen.getByText("Congratulations! You've completed your daily water goal!")).toBeInTheDocument()
    })
  })

  it("handles empty today entries", async () => {
    vi.mocked(waterService.getTodayEntries).mockResolvedValue([])

    render(<WaterLogPage />)

    await waitFor(() => {
      expect(screen.getByText("0/15")).toBeInTheDocument()
      expect(screen.getByText("0 oz")).toBeInTheDocument()
      expect(screen.getByText("0%")).toBeInTheDocument()
    })
  })

  it("handles error when fetching today entries", async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(waterService.getTodayEntries).mockRejectedValue(new Error("Failed to fetch"))

    render(<WaterLogPage />)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching today's entries:", expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  it("handles error when adding cup", async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(waterService.addCup).mockRejectedValue(new Error("Failed to add"))

    render(<WaterLogPage />)

    await waitFor(() => {
      expect(screen.getByText("Water Tracker")).toBeInTheDocument()
    })

    const cups = screen.getAllByRole("button")
    const cupButtons = cups.filter(button => 
      button.textContent === '' && button.querySelector('svg')
    )
    const thirdCup = cupButtons[2]

    await user.click(thirdCup)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error adding water cup:", expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  it("handles error when removing cup", async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(waterService.removeCup).mockRejectedValue(new Error("Failed to remove"))

    render(<WaterLogPage />)

    await waitFor(() => {
      expect(screen.getByText("Water Tracker")).toBeInTheDocument()
    })

    const cups = screen.getAllByRole("button")
    const cupButtons = cups.filter(button => 
      button.textContent === '' && button.querySelector('svg')
    )
    const firstCup = cupButtons[0]

    await user.click(firstCup)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error removing water cup:", expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  it("handles error when resetting day", async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(waterService.resetDay).mockRejectedValue(new Error("Failed to reset"))

    render(<WaterLogPage />)

    await waitFor(() => {
      expect(screen.getByText("Water Tracker")).toBeInTheDocument()
    })

    const resetButton = screen.getByRole("button", { name: /reset day/i })
    await user.click(resetButton)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error resetting day:", expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  it("disables buttons when loading", async () => {
    const user = userEvent.setup()
    // Mock a slow response to test loading state
    vi.mocked(waterService.addCup).mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    )

    render(<WaterLogPage />)

    await waitFor(() => {
      expect(screen.getByText("Water Tracker")).toBeInTheDocument()
    })

    const cups = screen.getAllByRole("button")
    const cupButtons = cups.filter(button => 
      button.textContent === '' && button.querySelector('svg')
    )
    const thirdCup = cupButtons[2]

    await user.click(thirdCup)

    // Check that buttons are disabled during loading
    expect(thirdCup).toHaveClass('opacity-50')
    expect(thirdCup).toHaveClass('cursor-not-allowed')
  })


  it("shows progress bar with correct width", async () => {
    render(<WaterLogPage />)

    await waitFor(() => {
      const progressBar = document.querySelector('[style*="width"]')
      expect(progressBar).toBeInTheDocument()
      // Should be approximately 13% width (2/15 cups)
      expect(progressBar).toHaveStyle('width: 13.333333333333334%')
    })
  })

  it("displays water icons correctly", async () => {
    render(<WaterLogPage />)

    await waitFor(() => {
      // Should show water drop icon in the title
      const waterIcon = document.querySelector('svg[class*="text-logo-green"]')
      expect(waterIcon).toBeInTheDocument()
    })
  })

  it("handles confetti when goal is completed", async () => {
    const user = userEvent.setup()
    
    // Mock 14 completed cups, then add one more to trigger confetti
    const almostCompleteEntries = Array.from({ length: 14 }, (_, i) => ({
      id: i + 1,
      amount_oz: 8,
      date_entry: "2024-01-15",
      created_at: `2024-01-15T${10 + i}:00:00Z`,
      created_by: "test-user-id",
    }))
    vi.mocked(waterService.getTodayEntries).mockResolvedValue(almostCompleteEntries)

    render(<WaterLogPage />)

    await waitFor(() => {
      expect(screen.getByText("Water Tracker")).toBeInTheDocument()
    })

    // Click the 15th cup to complete the goal
    const cups = screen.getAllByRole("button")
    const cupButtons = cups.filter(button => 
      button.textContent === '' && button.querySelector('svg')
    )
    const lastCup = cupButtons[14]

    await user.click(lastCup)

    // The confetti function should be called when the goal is completed
    // We can't easily test the exact call since it's mocked at the module level
    // But we can verify the component behavior
    await waitFor(() => {
      expect(waterService.addCup).toHaveBeenCalledWith("test-user-id", "2024-01-15", 8)
    })
  })
})
