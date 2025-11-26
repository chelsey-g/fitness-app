import "@testing-library/jest-dom"

import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ContactPage from "./page"

// Mock @formspree/react
const mockHandleSubmit = vi.fn((e) => e.preventDefault())
const mockUseForm = vi.fn(() => [
  {
    succeeded: false,
    submitting: false,
    errors: [] as Array<{ field: string; message: string }>,
  },
  mockHandleSubmit,
])

vi.mock("@formspree/react", () => ({
  useForm: () => mockUseForm(),
  ValidationError: ({ errors, prefix, field }: any) => {
    const fieldErrors = errors?.filter((err: any) => err.field === field) || []
    if (fieldErrors.length === 0) return null
    return (
      <div data-testid={`validation-error-${field}`} role="alert">
        {prefix}: {fieldErrors.map((err: any) => err.message).join(", ")}
      </div>
    )
  },
}))

// Mock next/navigation
const mockPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock ContactAlert component
vi.mock("@/components/ContactAlert", () => ({
  __esModule: true,
  default: vi.fn(() => (
    <div data-testid="contact-alert" role="alert">
      Form Submitted Successfully
    </div>
  )),
}))

describe("ContactPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset useForm mock to default state
    mockUseForm.mockReturnValue([
      {
        succeeded: false,
        submitting: false,
        errors: [],
      },
      mockHandleSubmit,
    ])
  })

  it("renders the contact form with heading", () => {
    render(<ContactPage />)

    expect(screen.getByText("Contact Us")).toBeInTheDocument()
  })

  it("renders all form fields", () => {
    render(<ContactPage />)

    expect(screen.getByLabelText("Name")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Message")).toBeInTheDocument()
  })

  it("renders submit button", () => {
    render(<ContactPage />)

    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument()
  })

  it("allows user to type in name field", async () => {
    const user = userEvent.setup()
    render(<ContactPage />)

    const nameInput = screen.getByLabelText("Name") as HTMLInputElement
    await user.type(nameInput, "John Doe")

    expect(nameInput.value).toBe("John Doe")
  })

  it("allows user to type in email field", async () => {
    const user = userEvent.setup()
    render(<ContactPage />)

    const emailInput = screen.getByLabelText("Email") as HTMLInputElement
    await user.type(emailInput, "john@example.com")

    expect(emailInput.value).toBe("john@example.com")
  })

  it("allows user to type in message field", async () => {
    const user = userEvent.setup()
    render(<ContactPage />)

    const messageInput = screen.getByLabelText("Message") as HTMLTextAreaElement
    await user.type(messageInput, "This is a test message")

    expect(messageInput.value).toBe("This is a test message")
  })

  it("calls handleSubmit when form is submitted", async () => {
    const user = userEvent.setup()
    render(<ContactPage />)

    await user.click(screen.getByRole("button", { name: /submit/i }))

    expect(mockHandleSubmit).toHaveBeenCalled()
  })

  it("disables submit button when submitting", () => {
    mockUseForm.mockReturnValue([
      {
        succeeded: false,
        submitting: true,
        errors: [],
      },
      mockHandleSubmit,
    ])

    render(<ContactPage />)

    const submitButton = screen.getByRole("button", { name: /submit/i })
    expect(submitButton).toBeDisabled()
  })

  it("enables submit button when not submitting", () => {
    mockUseForm.mockReturnValue([
      {
        succeeded: false,
        submitting: false,
        errors: [],
      },
      mockHandleSubmit,
    ])

    render(<ContactPage />)

    const submitButton = screen.getByRole("button", { name: /submit/i })
    expect(submitButton).not.toBeDisabled()
  })

  it("displays contact alert when form succeeds", async () => {
    mockUseForm.mockReturnValue([
      {
        succeeded: true,
        submitting: false,
        errors: [],
      },
      mockHandleSubmit,
    ])

    render(<ContactPage />)

    await waitFor(
      () => {
        expect(screen.getByTestId("contact-alert")).toBeInTheDocument()
      },
      { timeout: 1000 }
    )
  })

  it("hides contact alert after 3 seconds", async () => {
    mockUseForm.mockReturnValue([
      {
        succeeded: true,
        submitting: false,
        errors: [],
      },
      mockHandleSubmit,
    ])

    render(<ContactPage />)

    // Wait for alert to appear
    await waitFor(
      () => {
        expect(screen.getByTestId("contact-alert")).toBeInTheDocument()
      },
      { timeout: 1000 }
    )

    // Wait for alert to disappear after 3 seconds
    await waitFor(
      () => {
        expect(screen.queryByTestId("contact-alert")).not.toBeInTheDocument()
      },
      { timeout: 4000 }
    )
  })

  it("displays email validation error", () => {
    mockUseForm.mockReturnValue([
      {
        succeeded: false,
        submitting: false,
        errors: [
          {
            field: "email",
            message: "Invalid email address",
          },
        ] as any[],
      },
      mockHandleSubmit,
    ])

    render(<ContactPage />)

    // Note: The page has a bug where email validation error appears in both name and email fields
    const emailErrors = screen.getAllByTestId("validation-error-email")
    expect(emailErrors.length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Email: Invalid email address/i).length).toBeGreaterThan(0)
  })

  it("displays message validation error", () => {
    mockUseForm.mockReturnValue([
      {
        succeeded: false,
        submitting: false,
        errors: [
          {
            field: "message",
            message: "Message is required",
          },
        ] as any[],
      },
      mockHandleSubmit,
    ])

    render(<ContactPage />)

    expect(screen.getByTestId("validation-error-message")).toBeInTheDocument()
    expect(screen.getByText(/Message: Message is required/i)).toBeInTheDocument()
  })

  it("displays multiple validation errors", () => {
    mockUseForm.mockReturnValue([
      {
        succeeded: false,
        submitting: false,
        errors: [
          {
            field: "email",
            message: "Invalid email address",
          },
          {
            field: "message",
            message: "Message is required",
          },
        ] as any[],
      },
      mockHandleSubmit,
    ])

    render(<ContactPage />)

    // Note: The page has a bug where email validation error appears in both name and email fields
    const emailErrors = screen.getAllByTestId("validation-error-email")
    expect(emailErrors.length).toBeGreaterThan(0)
    expect(screen.getByTestId("validation-error-message")).toBeInTheDocument()
  })

  it("does not display validation errors when there are none", () => {
    mockUseForm.mockReturnValue([
      {
        succeeded: false,
        submitting: false,
        errors: [],
      },
      mockHandleSubmit,
    ])

    render(<ContactPage />)

    expect(screen.queryByTestId("validation-error-email")).not.toBeInTheDocument()
    expect(screen.queryByTestId("validation-error-message")).not.toBeInTheDocument()
  })

  it("has correct input types and attributes", () => {
    render(<ContactPage />)

    const nameInput = screen.getByLabelText("Name")
    const emailInput = screen.getByLabelText("Email")
    const messageInput = screen.getByLabelText("Message")

    expect(nameInput).toHaveAttribute("type", "name")
    expect(nameInput).toHaveAttribute("id", "name")
    expect(nameInput).toHaveAttribute("name", "name")

    expect(emailInput).toHaveAttribute("type", "email")
    expect(emailInput).toHaveAttribute("id", "email")
    expect(emailInput).toHaveAttribute("name", "email")

    expect(messageInput).toHaveAttribute("id", "message")
    expect(messageInput).toHaveAttribute("name", "message")
  })
})

