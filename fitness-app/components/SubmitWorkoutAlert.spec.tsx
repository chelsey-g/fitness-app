import "@testing-library/jest-dom"

import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import SubmitWorkoutAlert from "./SubmitWorkoutAlert"

describe("SubmitWorkoutAlert", () => {
  it("renders the alert with correct title, description, and icon", () => {
    render(<SubmitWorkoutAlert />)

    // Check that the alert role is present
    const alertElement = screen.getByRole("alert")
    expect(alertElement).toBeInTheDocument()

    // Check that the title is present and correct
    const titleElement = screen.getByText(/workout created/i)
    expect(titleElement).toBeInTheDocument()

    // Check that the description is present and correct
    const descriptionElement = screen.getByText(
      /your workout list has been created successfully./i
    )
    expect(descriptionElement).toBeInTheDocument()

    // Check that the icon is present
    const iconElement = screen.getByRole("img", { hidden: true })
    expect(iconElement).toBeInTheDocument()

    // Ensure the alert has the correct styling classes
    expect(alertElement).toHaveClass(
      "bg-green-100 border-l-4 border-green-500 text-green-700 p-2 rounded-md shadow-md"
    )
  })
})
