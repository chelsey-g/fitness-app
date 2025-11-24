import "@testing-library/jest-dom"

import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import TrackerPage from "./page"
import { weightService } from "@/app/services/WeightService"

// Mock the weight service
vi.mock("@/app/services/WeightService", () => ({
  weightService: {
    addWeightEntry: vi.fn(),
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

describe("TrackerPage Component (Weight Log)", () => {
  const mockUser = {
    id: "test-user-id",
    email: "test@example.com",
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
    vi.mocked(weightService.addWeightEntry).mockResolvedValue(undefined)
  })

  it("renders the weight log page with correct title and description", () => {
    render(<TrackerPage />)

    expect(screen.getByText("Record Weight")).toBeInTheDocument()
    expect(
      screen.getByText("Ready to check in? Let's see what the scale has to say today!")
    ).toBeInTheDocument()
  })

  it("renders date input field with today's date as default", () => {
    render(<TrackerPage />)

    const dateInput = screen.getByLabelText(/date:/i) as HTMLInputElement
    expect(dateInput).toBeInTheDocument()
    expect(dateInput.type).toBe("date")
    
    // Check that it has today's date (format: YYYY-MM-DD)
    const today = new Date().toISOString().substr(0, 10)
    expect(dateInput.value).toBe(today)
  })

  it("renders weight input field", () => {
    render(<TrackerPage />)

    const weightInput = screen.getByLabelText(/weight \(lbs\):/i) as HTMLInputElement
    expect(weightInput).toBeInTheDocument()
    expect(weightInput.type).toBe("number")
    expect(weightInput.value).toBe("")
    expect(weightInput).toBeRequired()
  })

  it("renders submit button", () => {
    render(<TrackerPage />)

    const submitButton = screen.getByRole("button", { name: /add weight/i })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton.type).toBe("submit")
  })

  it("allows user to change date", async () => {
    const user = userEvent.setup()
    render(<TrackerPage />)

    const dateInput = screen.getByLabelText(/date:/i) as HTMLInputElement
    const testDate = "2024-01-15"

    await user.clear(dateInput)
    await user.type(dateInput, testDate)

    expect(dateInput.value).toBe(testDate)
  })

  it("allows user to enter weight", async () => {
    const user = userEvent.setup()
    render(<TrackerPage />)

    const weightInput = screen.getByLabelText(/weight \(lbs\):/i) as HTMLInputElement
    const testWeight = "180.5"

    await user.type(weightInput, testWeight)

    expect(weightInput.value).toBe(testWeight)
  })

  it("submits form successfully with valid data", async () => {
    const user = userEvent.setup()
    render(<TrackerPage />)

    const weightInput = screen.getByLabelText(/weight \(lbs\):/i)
    const submitButton = screen.getByRole("button", { name: /add weight/i })
    const dateInput = screen.getByLabelText(/date:/i) as HTMLInputElement

    const testWeight = "180.5"
    const testDate = dateInput.value

    await user.type(weightInput, testWeight)
    await user.click(submitButton)

    await waitFor(() => {
      expect(weightService.addWeightEntry).toHaveBeenCalledWith(
        "test-user-id",
        testDate,
        180.5
      )
      expect(mockPush).toHaveBeenCalledWith("/weight-chart")
    })
  })

  it("displays error message when user is not authenticated", async () => {
    const user = userEvent.setup()
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
      refreshAuth: vi.fn(),
    })

    render(<TrackerPage />)

    const weightInput = screen.getByLabelText(/weight \(lbs\):/i)
    const submitButton = screen.getByRole("button", { name: /add weight/i })

    await user.type(weightInput, "180.5")
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Failed to save weight. Please try again.")).toBeInTheDocument()
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  it("displays error message when weight service fails", async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    vi.mocked(weightService.addWeightEntry).mockRejectedValue(new Error("Service error"))

    render(<TrackerPage />)

    const weightInput = screen.getByLabelText(/weight \(lbs\):/i)
    const submitButton = screen.getByRole("button", { name: /add weight/i })

    await user.type(weightInput, "180.5")
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Failed to save weight. Please try again.")).toBeInTheDocument()
      expect(consoleSpy).toHaveBeenCalledWith("Error inserting data:", expect.any(Error))
      expect(mockPush).not.toHaveBeenCalled()
    })

    consoleSpy.mockRestore()
  })

  it("disables submit button while submitting", async () => {
    const user = userEvent.setup()
    // Mock a slow response to test loading state
    vi.mocked(weightService.addWeightEntry).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )

    render(<TrackerPage />)

    const weightInput = screen.getByLabelText(/weight \(lbs\):/i)
    const submitButton = screen.getByRole("button", { name: /add weight/i }) as HTMLButtonElement

    await user.type(weightInput, "180.5")
    await user.click(submitButton)

    // Button should be disabled and show "Saving..." text
    expect(submitButton.disabled).toBe(true)
    expect(screen.getByText("Saving...")).toBeInTheDocument()

    await waitFor(() => {
      expect(submitButton.disabled).toBe(false)
    })
  })

  it("shows 'Saving...' text on button when submitting", async () => {
    const user = userEvent.setup()
    vi.mocked(weightService.addWeightEntry).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )

    render(<TrackerPage />)

    const weightInput = screen.getByLabelText(/weight \(lbs\):/i)
    const submitButton = screen.getByRole("button", { name: /add weight/i })

    await user.type(weightInput, "180.5")
    await user.click(submitButton)

    expect(screen.getByText("Saving...")).toBeInTheDocument()
    expect(screen.queryByText("Add Weight")).not.toBeInTheDocument()
  })

  it("prevents form submission when weight is empty", async () => {
    const user = userEvent.setup()
    render(<TrackerPage />)

    const submitButton = screen.getByRole("button", { name: /add weight/i })
    await user.click(submitButton)

    // Form validation should prevent submission
    await waitFor(() => {
      expect(weightService.addWeightEntry).not.toHaveBeenCalled()
    })
  })

  it("converts weight string to number when submitting", async () => {
    const user = userEvent.setup()
    render(<TrackerPage />)

    const weightInput = screen.getByLabelText(/weight \(lbs\):/i)
    const submitButton = screen.getByRole("button", { name: /add weight/i })
    const dateInput = screen.getByLabelText(/date:/i) as HTMLInputElement

    await user.type(weightInput, "180.5")
    await user.click(submitButton)

    await waitFor(() => {
      expect(weightService.addWeightEntry).toHaveBeenCalledWith(
        "test-user-id",
        dateInput.value,
        180.5
      )
    })
  })

  it("clears error message on new submission attempt", async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    
    // First submission fails
    vi.mocked(weightService.addWeightEntry).mockRejectedValueOnce(new Error("Service error"))

    render(<TrackerPage />)

    const weightInput = screen.getByLabelText(/weight \(lbs\):/i)
    const submitButton = screen.getByRole("button", { name: /add weight/i })

    await user.type(weightInput, "180.5")
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Failed to save weight. Please try again.")).toBeInTheDocument()
    })

    // Second submission succeeds
    vi.mocked(weightService.addWeightEntry).mockResolvedValueOnce(undefined)
    await user.click(submitButton)

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText("Failed to save weight. Please try again.")).not.toBeInTheDocument()
    })

    consoleSpy.mockRestore()
  })

  it("has max date set to today on date input", () => {
    render(<TrackerPage />)

    const dateInput = screen.getByLabelText(/date:/i) as HTMLInputElement
    const today = new Date().toISOString().substr(0, 10)
    
    expect(dateInput.max).toBe(today)
  })

  it("handles decimal weight values", async () => {
    const user = userEvent.setup()
    render(<TrackerPage />)

    const weightInput = screen.getByLabelText(/weight \(lbs\):/i)
    const submitButton = screen.getByRole("button", { name: /add weight/i })
    const dateInput = screen.getByLabelText(/date:/i) as HTMLInputElement

    await user.type(weightInput, "180.75")
    await user.click(submitButton)

    await waitFor(() => {
      expect(weightService.addWeightEntry).toHaveBeenCalledWith(
        "test-user-id",
        dateInput.value,
        180.75
      )
    })
  })

  it("handles integer weight values", async () => {
    const user = userEvent.setup()
    render(<TrackerPage />)

    const weightInput = screen.getByLabelText(/weight \(lbs\):/i)
    const submitButton = screen.getByRole("button", { name: /add weight/i })
    const dateInput = screen.getByLabelText(/date:/i) as HTMLInputElement

    await user.type(weightInput, "180")
    await user.click(submitButton)

    await waitFor(() => {
      expect(weightService.addWeightEntry).toHaveBeenCalledWith(
        "test-user-id",
        dateInput.value,
        180
      )
    })
  })
})

