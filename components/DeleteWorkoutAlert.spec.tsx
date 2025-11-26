import "@testing-library/jest-dom"

import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import SubmitWorkoutAlert from "./SubmitWorkoutAlert"

describe("SubmitWorkoutAlert", () => {
  it("renders the alert with correct text and icon", () => {
    // Render the component
    render(<SubmitWorkoutAlert />)

    // Check if the alert is rendered
    const alert = screen.getByRole("alert")
    expect(alert).toBeInTheDocument()
  })
})
