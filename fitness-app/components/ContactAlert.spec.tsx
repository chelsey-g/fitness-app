import "@testing-library/jest-dom"

import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import ContactAlert from "./ContactAlert"
import React from "react"

describe("SubmitContactAlert", () => {
  const React = require("react")

  it("renders the alert with correct title and description", () => {
    render(<ContactAlert />)

    // Check if the alert role is present
    expect(screen.getByRole("alert")).toBeInTheDocument()

    // Check if the title is rendered correctly
    expect(screen.getByText("Form Submitted")).toBeInTheDocument()

    // Check if the description is rendered correctly
    expect(
      screen.getByText("Your contact form has been submitted successfully.")
    ).toBeInTheDocument()

    // Check if the icon is rendered
    const icon = screen.getByTestId("green-check")
    expect(icon).toBeInTheDocument()
  })
})
