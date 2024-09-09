import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
import { getAwardColor, getOrdinalSuffix } from "@/app/functions"
import { render, screen } from "@testing-library/react"

import CompetitionWeekTable from "@/components/CompetitionWeekTable"
import dayjs from "dayjs"

// Mock external dependencies
vi.mock("dayjs", () => ({
  default: vi.fn(() => ({
    startOf: vi.fn(() => ({
      format: vi.fn(() => "2024-09-01"), // Start of the week
    })),
    endOf: vi.fn(() => ({
      format: vi.fn(() => "2024-09-07"), // End of the week
    })),
  })),
}))

vi.mock("@/app/functions", () => ({
  getAwardColor: vi.fn((index) => (index === 1 ? "bg-gold" : "bg-silver")),
  getOrdinalSuffix: vi.fn((index) => {
    const suffixes = ["th", "st", "nd", "rd"]
    const v = index % 100
    return `${index}${suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]}`
  }),
}))

describe("CompetitionWeekTable Component", () => {
  const mockCompetitionData = [
    {
      competitions_players: [
        {
          profiles: {
            first_name: "John",
            last_name: "Doe",
            weight_tracker: [
              { date_entry: "2024-09-01", weight: 80 },
              { date_entry: "2024-09-07", weight: 75 },
            ],
          },
        },
        {
          profiles: {
            first_name: "Jane",
            last_name: "Smith",
            weight_tracker: [
              { date_entry: "2024-09-01", weight: 70 },
              { date_entry: "2024-09-07", weight: 65 },
            ],
          },
        },
      ],
    },
  ]

  it("should render the component and show correct player weight percentage change", () => {
    render(<CompetitionWeekTable competitionData={mockCompetitionData} />)

    // Check if the correct player names are rendered
    expect(screen.getByText("John")).toBeInTheDocument()
    expect(screen.getByText("Jane")).toBeInTheDocument()

    // Check if the percentage changes are displayed
    expect(screen.getByText("-6.25%")).toBeInTheDocument() // For John
    expect(screen.getByText("-7.14%")).toBeInTheDocument() // For Jane

    expect(screen.getByText("1st")).toBeInTheDocument()
    expect(screen.getByText("2nd")).toBeInTheDocument()

    // Verify that the correct award color classes are applied
    const firstPlaceIcon = screen.getByText("1st").previousElementSibling
    expect(firstPlaceIcon).toHaveClass("bg-gold")

    const secondPlaceIcon = screen.getByText("2nd").previousElementSibling
    expect(secondPlaceIcon).toHaveClass("bg-silver")

    // Ensure the mocked functions were called
    expect(getAwardColor).toHaveBeenCalledWith(1)
    expect(getAwardColor).toHaveBeenCalledWith(2)
    expect(getOrdinalSuffix).toHaveBeenCalledWith(1)
    expect(getOrdinalSuffix).toHaveBeenCalledWith(2)
  })
})
