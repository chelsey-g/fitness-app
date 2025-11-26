import "@testing-library/jest-dom/vitest"

import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import DifficultyFilter from "./DifficultyFilter"
import React from "react"

describe("DifficultyFilter", () => {
  it("renders correctly", () => {
    const handleChange = vi.fn()
    render(<DifficultyFilter difficulty="" onChange={handleChange} />)

    expect(screen.getByText("Select Difficulty")).toBeInTheDocument()
  })

  it("opens dropdown when button is clicked", () => {
    const handleChange = vi.fn()
    render(<DifficultyFilter difficulty="" onChange={handleChange} />)

    fireEvent.click(screen.getByRole("button"))

    expect(screen.getByRole("menu")).toBeInTheDocument()
    expect(screen.getByText("All Difficulties")).toBeInTheDocument()
    expect(screen.getByText("beginner")).toBeInTheDocument()
    expect(screen.getByText("intermediate")).toBeInTheDocument()
    expect(screen.getByText("expert")).toBeInTheDocument()
  })

  it("calls onChange with the selected difficulty", () => {
    const handleChange = vi.fn()
    render(<DifficultyFilter difficulty="" onChange={handleChange} />)

    fireEvent.click(screen.getByText("Select Difficulty"))
    fireEvent.click(screen.getByLabelText("beginner"))

    expect(handleChange).toHaveBeenCalledWith("beginner")
  })

  it("closes dropdown after selection", () => {
    const handleChange = vi.fn()
    render(<DifficultyFilter difficulty="" onChange={handleChange} />)

    fireEvent.click(screen.getByText("Select Difficulty"))
    fireEvent.click(screen.getByLabelText("beginner"))

    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
  })
})
