import "@testing-library/jest-dom"

import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { EmailTemplate } from "./EmailTemplate"

describe("EmailTemplate Component", () => {
  it("renders with the correct first name", () => {
    // Render the component with a sample first name
    render(<EmailTemplate firstName="John" />)

    // Check if the welcome message contains the correct name
    const welcomeMessage = screen.getByText("Welcome, John!")
    expect(welcomeMessage).toBeInTheDocument()
  })

  it("renders with a different first name", () => {
    // Render the component with a different first name
    render(<EmailTemplate firstName="Jane" />)

    // Check if the welcome message contains the new name
    const welcomeMessage = screen.getByText("Welcome, Jane!")
    expect(welcomeMessage).toBeInTheDocument()
  })
})
