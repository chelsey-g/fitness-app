import "@testing-library/jest-dom"

import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import SignupPage from "./page"
import { AuthService } from "@/app/services/AuthService"

// Mock Supabase server client
vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
    },
  })),
}))

// Mock AuthService
vi.mock("@/app/services/AuthService", () => {
  const mockGetUser = vi.fn()
  return {
    AuthService: vi.fn(() => ({
      getUser: mockGetUser,
      client: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn(),
      getSession: vi.fn(),
    })),
  }
})

// Mock Next.js navigation
const mockRedirect = vi.hoisted(() => vi.fn())
vi.mock("next/navigation", () => ({
  redirect: mockRedirect,
}))

// Mock Next.js headers to prevent file system errors
vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve({
    get: vi.fn(() => null),
  })),
  cookies: vi.fn(() => ({
    get: vi.fn(() => null),
    set: vi.fn(),
    delete: vi.fn(),
  })),
}))

// Mock Next.js Link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock server actions
vi.mock("@/app/actions", () => ({
  signUpAction: vi.fn(),
}))

describe("SignupPage Component", () => {
  const getMockGetUser = async () => {
    const AuthService = (await import("@/app/services/AuthService")).AuthService
    const instance = new AuthService({} as any)
    return (instance as any).getUser
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the signup form with all required elements", async () => {
    const searchParams = Promise.resolve({})
    const { container } = render(await SignupPage({ searchParams }))

    expect(screen.getByText("Create Account")).toBeInTheDocument()
    expect(container.querySelector('input[name="firstName"]')).toBeInTheDocument()
    expect(container.querySelector('input[name="lastName"]')).toBeInTheDocument()
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument()
    expect(container.querySelector('input[name="username"]')).toBeInTheDocument()
    expect(container.querySelector('input[name="password"]')).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument()
  })

//   it("displays the sign in link", async () => {
//     const searchParams = Promise.resolve({})
//     render(await SignupPage({ searchParams }))

//     const signInLink = screen.getByRole("link", { name: /sign in/i })
//     expect(signInLink).toBeInTheDocument()
//     expect(signInLink).toHaveAttribute("href", "/login ")
//   })

//   it("displays the create icon", async () => {
//     const searchParams = Promise.resolve({})
//     render(await SignupPage({ searchParams }))

//     const createIcon = screen.getByText("Create Account").parentElement?.querySelector("svg")
//     expect(createIcon).toBeInTheDocument()
//   })

//   it("pre-fills email field from searchParams", async () => {
//     const searchParams = Promise.resolve({ email: "test@example.com" })
//     render(await SignupPage({ searchParams }))

//     const emailInput = screen.getByPlaceholderText("you@example.com") as HTMLInputElement
//     expect(emailInput.value).toBe("test@example.com")
//   })

//   it("displays success message from searchParams", async () => {
//     const searchParams = Promise.resolve({ success: "Account created successfully!" })
//     render(await SignupPage({ searchParams }))

//     expect(screen.getByText("Account created successfully!")).toBeInTheDocument()
//   })

//   it("displays error message from searchParams", async () => {
//     const searchParams = Promise.resolve({ error: "Failed to create account" })
//     render(await SignupPage({ searchParams }))

//     expect(screen.getByText("Failed to create account")).toBeInTheDocument()
//   })

//   it("displays generic message from searchParams", async () => {
//     const searchParams = Promise.resolve({ message: "Please check your email" })
//     render(await SignupPage({ searchParams }))

//     expect(screen.getByText("Please check your email")).toBeInTheDocument()
//   })

//   it("renders only FormMessage when message is in searchParams", async () => {
//     const searchParams = Promise.resolve({ message: "Test message" })
//     render(await SignupPage({ searchParams }))

//     expect(screen.getByText("Test message")).toBeInTheDocument()
//     expect(screen.queryByText("Create Account")).not.toBeInTheDocument()
//     expect(screen.queryByLabelText(/first name/i)).not.toBeInTheDocument()
//   })

//   it("redirects to dashboard when user is already logged in", async () => {
//     const mockGetUser = await getMockGetUser()
//     mockGetUser.mockResolvedValue({
//       id: "test-user-id",
//       email: "test@example.com",
//       identities: [{ id: "test-user-id" }],
//     })

//     const searchParams = Promise.resolve({})
//     await SignupPage({ searchParams })

//     await waitFor(() => {
//       expect(mockRedirect).toHaveBeenCalledWith("/dashboard")
//     })
//   })

//   it("allows user to type in form fields", async () => {
//     const user = userEvent.setup()
//     const searchParams = Promise.resolve({})
//     const { container } = render(await SignupPage({ searchParams }))

//     const firstNameInput = container.querySelector('input[name="firstName"]') as HTMLInputElement
//     const lastNameInput = container.querySelector('input[name="lastName"]') as HTMLInputElement
//     const emailInput = screen.getByPlaceholderText("you@example.com") as HTMLInputElement
//     const usernameInput = container.querySelector('input[name="username"]') as HTMLInputElement
//     const passwordInput = container.querySelector('input[name="password"]') as HTMLInputElement

//     await user.type(firstNameInput, "John")
//     await user.type(lastNameInput, "Doe")
//     await user.type(emailInput, "john@example.com")
//     await user.type(usernameInput, "johndoe")
//     await user.type(passwordInput, "password123")

//     expect(firstNameInput.value).toBe("John")
//     expect(lastNameInput.value).toBe("Doe")
//     expect(emailInput.value).toBe("john@example.com")
//     expect(usernameInput.value).toBe("johndoe")
//     expect(passwordInput.value).toBe("password123")
//   })

//   it("has required attributes on all form fields", async () => {
//     const searchParams = Promise.resolve({})
//     const { container } = render(await SignupPage({ searchParams }))

//     const firstNameInput = container.querySelector('input[name="firstName"]')
//     const lastNameInput = container.querySelector('input[name="lastName"]')
//     const emailInput = screen.getByPlaceholderText("you@example.com")
//     const usernameInput = container.querySelector('input[name="username"]')
//     const passwordInput = container.querySelector('input[name="password"]')

//     expect(firstNameInput).toHaveAttribute("required")
//     expect(lastNameInput).toHaveAttribute("required")
//     expect(emailInput).toHaveAttribute("required")
//     expect(usernameInput).toHaveAttribute("required")
//     expect(passwordInput).toHaveAttribute("required")
//   })

//   it("has correct input types", async () => {
//     const searchParams = Promise.resolve({})
//     const { container } = render(await SignupPage({ searchParams }))

//     const firstNameInput = container.querySelector('input[name="firstName"]')
//     const lastNameInput = container.querySelector('input[name="lastName"]')
//     const emailInput = screen.getByPlaceholderText("you@example.com")
//     const usernameInput = container.querySelector('input[name="username"]')
//     const passwordInput = container.querySelector('input[name="password"]')

//     expect(firstNameInput).toHaveAttribute("type", "text")
//     expect(lastNameInput).toHaveAttribute("type", "text")
//     // Email input type may vary based on Input component implementation
//     expect(emailInput).toBeInTheDocument()
//     expect(usernameInput).toHaveAttribute("type", "text")
//     expect(passwordInput).toHaveAttribute("type", "password")
//   })

//   it("has correct name attributes on form fields", async () => {
//     const searchParams = Promise.resolve({})
//     const { container } = render(await SignupPage({ searchParams }))

//     const firstNameInput = container.querySelector('input[name="firstName"]')
//     const lastNameInput = container.querySelector('input[name="lastName"]')
//     const emailInput = screen.getByPlaceholderText("you@example.com")
//     const usernameInput = container.querySelector('input[name="username"]')
//     const passwordInput = container.querySelector('input[name="password"]')

//     expect(firstNameInput).toHaveAttribute("name", "firstName")
//     expect(lastNameInput).toHaveAttribute("name", "lastName")
//     expect(emailInput).toHaveAttribute("name", "email")
//     expect(usernameInput).toHaveAttribute("name", "username")
//     expect(passwordInput).toHaveAttribute("name", "password")
//   })

//   it("renders form with correct structure", async () => {
//     const searchParams = Promise.resolve({})
//     render(await SignupPage({ searchParams }))

//     const form = screen.getByRole("button", { name: /sign up/i }).closest("form")
//     expect(form).toBeInTheDocument()
//   })

//   it("handles empty email in searchParams", async () => {
//     const searchParams = Promise.resolve({ email: "" })
//     render(await SignupPage({ searchParams }))

//     const emailInput = screen.getByPlaceholderText("you@example.com") as HTMLInputElement
//     expect(emailInput.value).toBe("")
//   })

//   it("handles undefined email in searchParams", async () => {
//     const searchParams = Promise.resolve({})
//     render(await SignupPage({ searchParams }))

//     const emailInput = screen.getByPlaceholderText("you@example.com") as HTMLInputElement
//     expect(emailInput.value).toBe("")
//   })
})

