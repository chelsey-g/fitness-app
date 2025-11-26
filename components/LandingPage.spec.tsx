import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
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
    render(<LandingPage isBackendConnected={true} />)

    // Check if the main heading is rendered
    expect(screen.getByText(/Kickstart your habits with/i)).toBeInTheDocument()
    expect(screen.getByText("HabitKick")).toBeInTheDocument()
  })

  it("renders the 'Start Your Journey' link", () => {
    render(<LandingPage isBackendConnected={true} />)

    // Check if the 'Start Your Journey' link is rendered
    const link = screen.getByRole("link", { name: /start your journey/i })
    expect(link).toBeInTheDocument()
  })

  //   it("navigates to the login page when 'Get Started' button is clicked", () => {
  //     const { push } = useRouter()
  //     render(<LandingPage isBackendConnected={true} />)

  //     // Simulate a click event on the 'Get Started' button
  //     const button = screen.getByRole("button", { name: /get started/i })
  //     fireEvent.click(button)

  //     // Expect the router's push function to have been called
  //     expect(push).toHaveBeenCalledWith("/login")
  //   })

  it("renders features sections", () => {
    render(<LandingPage isBackendConnected={true} />)

    // Check if feature sections are rendered
    expect(screen.getByText(/Set goals that/i)).toBeInTheDocument()
    expect(screen.getByText(/Track your progress with/i)).toBeInTheDocument()
    // Check for the 75 day challenge heading - text is split across elements with span
    const heading = screen.getByText(/Transform your life in/i)
    expect(heading).toBeInTheDocument()
    expect(screen.getByText("75 days")).toBeInTheDocument()
    
    // Check if feature links are rendered
    expect(screen.getByRole("link", { name: /try goal tracking/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /start tracking weight/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /start 75 day challenge/i })).toBeInTheDocument()
  })

  it("renders the testimonials", () => {
    render(<LandingPage isBackendConnected={true} />)

    // Check if testimonials section heading is rendered
    expect(screen.getByText(/Loved by/i)).toBeInTheDocument()
    
    // Check if testimonial content is rendered
    expect(
      screen.getByText(/HabitKick transformed my workout routine/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Perfect for tracking client progress/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Finally, a fitness app that actually helps/i)
    ).toBeInTheDocument()
  })

  it("renders the CTA section", () => {
    render(<LandingPage isBackendConnected={true} />)

    // Check if the CTA section is rendered
    expect(screen.getByText(/Ready to transform your fitness journey/i)).toBeInTheDocument()

    const getStartedLink = screen.getByRole("link", { name: /get started free/i })
    expect(getStartedLink).toBeInTheDocument()
    
    const signInLink = screen.getByRole("link", { name: /sign in/i })
    expect(signInLink).toBeInTheDocument()
  })
})
