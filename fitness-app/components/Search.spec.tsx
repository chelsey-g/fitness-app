import "@testing-library/jest-dom/vitest"

import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import SearchBar from "./Search"
import { useRouter } from "next/navigation"

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe("SearchBar Component", () => {
  const mockOnResultsChange = vi.fn()

  beforeEach(() => {
    global.fetch = vi.fn()
    mockOnResultsChange.mockClear()
  })

  it("renders the input and search button", () => {
    render(<SearchBar onResultsChange={mockOnResultsChange} />)

    const input = screen.getByPlaceholderText("Search Exercise")
    const searchButton = screen.getByText("Search")

    expect(input).toBeInTheDocument()
    expect(searchButton).toBeInTheDocument()
  })

  it("displays search results when the search button is clicked", async () => {
    const mockResults = [
      { name: "Push-Up", type: "strength", difficulty: "medium" },
      { name: "Squat", type: "strength", difficulty: "easy" },
    ]

    ;(fetch as vi.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockResults),
    })

    render(<SearchBar onResultsChange={mockOnResultsChange} />)

    const input = screen.getByPlaceholderText("Search Exercise")
    fireEvent.change(input, { target: { value: "Push" } })

    const searchButton = screen.getByText("Search")
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText("Push-Up")).toBeInTheDocument()
      expect(screen.getByText("Squat")).toBeInTheDocument()
    })

    expect(mockOnResultsChange).toHaveBeenCalledWith(mockResults)
  })

  it("clears the search results when the clear button is clicked", async () => {
    const mockResults = [
      { name: "Push-Up", type: "strength", difficulty: "medium" },
    ]

    ;(fetch as vi.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockResults),
    })

    render(<SearchBar onResultsChange={mockOnResultsChange} />)

    const input = screen.getByPlaceholderText("Search Exercise")
    fireEvent.change(input, { target: { value: "Push" } })

    const searchButton = screen.getByText("Search")
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText("Push-Up")).toBeInTheDocument()
    })

    const clearButton = screen.getByRole("button", { name: /close/i })
    fireEvent.click(clearButton)

    await waitFor(() => {
      expect(screen.queryByText("Push-Up")).not.toBeInTheDocument()
    })

    expect(input).toHaveValue("")
    expect(mockOnResultsChange).toHaveBeenCalledWith([])
  })

  it("handles API errors gracefully", async () => {
    ;(fetch as vi.Mock).mockRejectedValueOnce(new Error("API Error"))

    render(<SearchBar onResultsChange={mockOnResultsChange} />)

    const input = screen.getByPlaceholderText("Search Exercise")
    fireEvent.change(input, { target: { value: "Push" } })

    const searchButton = screen.getByText("Search")
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(screen.queryByText("Push-Up")).not.toBeInTheDocument()
    })

    expect(mockOnResultsChange).toHaveBeenCalledWith([])
  })

  it("navigates to exercise page when a result is clicked", async () => {
    const mockResults = [
      { name: "Push-Up", type: "strength", difficulty: "medium" },
    ]

    ;(fetch as vi.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockResults),
    })

    const mockRouter = useRouter()

    render(<SearchBar onResultsChange={mockOnResultsChange} />)

    const input = screen.getByPlaceholderText("Search Exercise")
    fireEvent.change(input, { target: { value: "Push" } })

    const searchButton = screen.getByText("Search")
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText("Push-Up")).toBeInTheDocument()
    })

    const resultCard = screen.getByText("Push-Up")
    fireEvent.click(resultCard)
  })
})
