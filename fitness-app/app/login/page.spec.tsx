import "@testing-library/jest-dom"

import { describe, expect, it, vi, beforeEach } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import LoginPage from "./page"
import { AuthService } from "@/app/services/AuthService"

// Mock the Supabase client
// const mockSignInWithPassword = vi.fn()
// vi.mock("@/utils/supabase/client", () => ({
//   createClient: () => ({
//     auth: {
//       signInWithPassword: mockSignInWithPassword,
//     },
//   }),
// }))

// Mock Supabase client
vi.mock("@/utils/supabase/client", () => ({
    createClient: vi.fn(() => ({
      auth: {
        signInWithPassword: vi.fn(),
      },
    })),
  }))

vi.mock("@/app/services/AuthService", () => {
  const instance = {
    getUser: vi.fn().mockResolvedValue({
      identities: [{ id: "test-user-id" }],
    }),
    client: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    signUp: vi.fn(),
    getSession: vi.fn(),
  }
  return {
    AuthService: vi.fn(() => instance),
  }
})



// Mock the AuthService
// const mockSignIn = vi.fn()
// vi.mock("@/app/services/AuthService", () => ({
//   AuthService: vi.fn().mockImplementation(() => ({
//     signIn: mockSignIn,
//   })),
// }))

vi.mock("@/app/services/AuthService", () => {
    const instance = {
      signIn: vi.fn().mockResolvedValue({ user: { id: "test-user-id" } }),
    }
    return {
      AuthService: vi.fn(() => instance),
    }
  })

// Mock Next.js modules
const mockPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe("LoginPage Component", () => {
  beforeEach(() => {
  })

  it("renders the login form with all required elements", () => {
    render(<LoginPage />)

    expect(screen.getByText("Log in to your account")).toBeInTheDocument()
    expect(screen.getByText("Email")).toBeInTheDocument()
    expect(screen.getByText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
  })

  it("displays the sign up link", () => {
    render(<LoginPage />)

    const signUpLink = screen.getByRole("link", { name: /sign up/i })
    expect(signUpLink).toBeInTheDocument()
    expect(signUpLink).toHaveAttribute("href", "/signup")
  })

  it("displays the forgot password link", () => {
    render(<LoginPage />)

    const forgotPasswordLink = screen.getByRole("link", { name: /forgot password/i })
    expect(forgotPasswordLink).toBeInTheDocument()
    expect(forgotPasswordLink).toHaveAttribute("href", "/login/forgot-password")
  })

  it("displays the lock icon", () => {
    render(<LoginPage />)

    const lockIcon = screen.getByText("Log in to your account").parentElement?.querySelector("svg")
    expect(lockIcon).toBeInTheDocument()
  })

  it("allows user to type in email and password fields", async () => {
    const user = userEvent.setup()
    render(<LoginPage />)

    const emailInput = screen.getByTestId("email-input")
    const passwordInput = screen.getByTestId("password-input")

    // await user.type(emailInput, "test@example.com")
    // await user.type(passwordInput, "password")

    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "password" } })

    expect(emailInput).toHaveAttribute("value", "test@example.com")
    expect(passwordInput).toHaveAttribute("value", "password")
  })

  it("disables submit button while loading", async () => {
    const user = userEvent.setup()
    
    render(<LoginPage />)

    const emailInput = screen.getByTestId("email-input")
    const passwordInput = screen.getByTestId("password-input")
    const submitButton = screen.getByRole("button", { name: /sign in/i })

    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "password" } })

    fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()
  })

  it("handles successful login", async () => {
    const user = userEvent.setup()
    render(<LoginPage />)

    const emailInput = screen.getByTestId("email-input")
    const passwordInput = screen.getByTestId("password-input")
    const submitButton = screen.getByRole("button", { name: /sign in/i })

    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "password" } })
    fireEvent.click(submitButton)

    await waitFor(() => {
        expect(submitButton).toBeEnabled()
        expect(mockPush).toHaveBeenCalledWith("/dashboard")
      })
  })
})

