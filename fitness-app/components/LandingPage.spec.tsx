import "@testing-library/jest-dom"

import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import LandingPage from "./LandingPage"
import { useRouter } from "next/navigation"

// Mocking the Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe("LandingPage", () => {
  it("renders the main heading", () => {
    render(<LandingPage />)

    // Check if the main heading is rendered
    expect(screen.getByText("Fitness At Your Fingertips")).toBeInTheDocument()
  })

  it("renders the 'Get Started' button", () => {
    render(<LandingPage />)

    // Check if the 'Get Started' button is rendered
    const button = screen.getByRole("button", { name: /get started/i })
    expect(button).toBeInTheDocument()
  })

  //   it("navigates to the login page when 'Get Started' button is clicked", () => {
  //     const { push } = useRouter()
  //     render(<LandingPage />)

  //     // Simulate a click event on the 'Get Started' button
  //     const button = screen.getByRole("button", { name: /get started/i })
  //     fireEvent.click(button)

  //     // Expect the router's push function to have been called
  //     expect(push).toHaveBeenCalledWith("/login")
  //   })

  it("renders Explore Our Tools section with icons", () => {
    render(<LandingPage />)

    // Check if the section heading is rendered
    expect(screen.getByText("Explore Our Tools")).toBeInTheDocument()

    // Check if icons are rendered
    expect(screen.getByText("BMI & Calorie Calculators")).toBeInTheDocument()
    expect(screen.getByText("Start a Goal")).toBeInTheDocument()
    expect(screen.getByText("Create a Competition")).toBeInTheDocument()
    expect(screen.getByText("Personalized Workouts")).toBeInTheDocument()
  })

  it("renders the testimonials", () => {
    render(<LandingPage />)

    // Check if testimonials are rendered
    expect(
      screen.getByText(/"This app has completely revolutionized/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/"I've never been more inspired to stay active/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/"The friendly competition keeps me motivated/i)
    ).toBeInTheDocument()
  })

  it("renders the 'Join Now' section", () => {
    render(<LandingPage />)

    // Check if the 'Join Now' section is rendered
    expect(screen.getByText("Ready to Start Your Journey?")).toBeInTheDocument()

    const joinButton = screen.getByRole("button", { name: /join now/i })
    expect(joinButton).toBeInTheDocument()
  })
})
