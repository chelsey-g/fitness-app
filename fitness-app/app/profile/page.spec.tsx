import "@testing-library/jest-dom"

import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import ProfileDashboard from "./page"
import { profileService } from "@/app/services/ProfileService"
import useSWR from "swr"

// Mock ProfileService
vi.mock("@/app/services/ProfileService", () => ({
  profileService: {
    updateProfile: vi.fn(),
  },
}))

// Mock Supabase client
vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: "test-user-id",
            email: "test@example.com",
            identities: [{ id: "test-user-id" }],
          },
        },
      }),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            then: vi.fn((callback) => Promise.resolve(callback({ data: null, error: null }))),
          })),
        })),
      })),
    })),
  })),
}))

// Mock SWR
vi.mock("swr", () => ({
  default: vi.fn(),
}))

// Mock child components
vi.mock("@/components/UploadPicture", () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="upload-picture">Upload Picture Component</div>),
}))

vi.mock("@/components/UsernamePassword", () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="username-password">Username Password Component</div>),
}))

describe("ProfileDashboard Component", () => {
  const mockUser = {
    id: "test-user-id",
    email: "test@example.com",
    identities: [{ id: "test-user-id" }],
  }

  const mockProfile = {
    id: "test-user-id",
    first_name: "John",
    last_name: "Doe",
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Set up default SWR mocks
    vi.mocked(useSWR).mockImplementation((key) => {
      if (key === "/user") {
        return { data: mockUser } as any
      }
      if (key === "/profile") {
        return { data: mockProfile } as any
      }
      return { data: null } as any
    })

    // Set up default ProfileService mock
    vi.mocked(profileService.updateProfile).mockResolvedValue(undefined)
  })

  it("renders the profile dashboard with navigation buttons", () => {
    render(<ProfileDashboard />)

    expect(screen.getByRole("button", { name: "Account Settings" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Login & Security" })).toBeInTheDocument()
  })

  it("displays Account Settings content by default", () => {
    render(<ProfileDashboard />)

    expect(screen.getByRole("heading", { name: "Account Settings" })).toBeInTheDocument()
    expect(screen.getByText("Edit your personal information and preferences.")).toBeInTheDocument()
  })

  it("displays profile name when profile data is available", async () => {
    render(<ProfileDashboard />)

    await waitFor(() => {
      expect(screen.getByText("Name:")).toBeInTheDocument()
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    })
  })

  it("displays UploadPicture component in Account Settings", async () => {
    render(<ProfileDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId("upload-picture")).toBeInTheDocument()
    })
  })

  it("switches to Login & Security tab when clicked", async () => {
    const user = userEvent.setup()
    render(<ProfileDashboard />)

    const loginSecurityButton = screen.getByRole("button", { name: "Login & Security" })
    await user.click(loginSecurityButton)

    await waitFor(() => {
      expect(screen.getByTestId("username-password")).toBeInTheDocument()
      expect(screen.queryByRole("heading", { name: "Account Settings" })).not.toBeInTheDocument()
    })
  })

  it("switches back to Account Settings tab when clicked", async () => {
    const user = userEvent.setup()
    render(<ProfileDashboard />)

    const loginSecurityButton = screen.getByRole("button", { name: "Login & Security" })
    await user.click(loginSecurityButton)

    await waitFor(() => {
      expect(screen.getByTestId("username-password")).toBeInTheDocument()
    })


    const accountSettingsButton = screen.getByRole("button", { name: "Account Settings" })
    await user.click(accountSettingsButton)

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Account Settings" })).toBeInTheDocument()
      expect(screen.queryByTestId("username-password")).not.toBeInTheDocument()
    })
  })

  it("opens edit dialog when Edit button is clicked", async () => {
    const user = userEvent.setup()
    render(<ProfileDashboard />)

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    })

    const editButton = screen.getByRole("button", { name: /edit/i })
    await user.click(editButton)

    await waitFor(() => {
      expect(screen.getByText("Edit Name")).toBeInTheDocument()
      expect(screen.getByText("Make changes to your name and click save.")).toBeInTheDocument()
    })
  })

  it("pre-fills name fields with current profile data when opening edit dialog", async () => {
    const user = userEvent.setup()
    render(<ProfileDashboard />)

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    })

    const editButton = screen.getByRole("button", { name: /edit/i })
    await user.click(editButton)

    await waitFor(() => {
      const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement
      const lastNameInput = screen.getByLabelText(/last name/i) as HTMLInputElement

      expect(firstNameInput.value).toBe("John")
      expect(lastNameInput.value).toBe("Doe")
    })
  })

  it("allows user to edit first name in the dialog", async () => {
    const user = userEvent.setup()
    render(<ProfileDashboard />)

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    })

    const editButton = screen.getByRole("button", { name: /edit/i })
    await user.click(editButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    })

    const firstNameInput = screen.getByLabelText(/first name/i)
    await user.clear(firstNameInput)
    await user.type(firstNameInput, "Jane")

    expect((firstNameInput as HTMLInputElement).value).toBe("Jane")
  })

  it("allows user to edit last name in the dialog", async () => {
    const user = userEvent.setup()
    render(<ProfileDashboard />)

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    })

    const editButton = screen.getByRole("button", { name: /edit/i })
    await user.click(editButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    })

    const lastNameInput = screen.getByLabelText(/last name/i)
    await user.clear(lastNameInput)
    await user.type(lastNameInput, "Smith")

    expect((lastNameInput as HTMLInputElement).value).toBe("Smith")
  })

  it("updates profile when Save button is clicked", async () => {
    const user = userEvent.setup()
    render(<ProfileDashboard />)

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    })

    const editButton = screen.getByRole("button", { name: /edit/i })
    await user.click(editButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    })

    const firstNameInput = screen.getByLabelText(/first name/i)
    await user.clear(firstNameInput)
    await user.type(firstNameInput, "Jane")

    const saveButton = screen.getByRole("button", { name: /save/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(profileService.updateProfile).toHaveBeenCalledWith("test-user-id", {
        first_name: "Jane",
        last_name: "Doe",
      })
    })
  })

  it("closes dialog after successful profile update", async () => {
    const user = userEvent.setup()
    render(<ProfileDashboard />)

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    })

    const editButton = screen.getByRole("button", { name: /edit/i })
    await user.click(editButton)

    await waitFor(() => {
      expect(screen.getByText("Edit Name")).toBeInTheDocument()
    })

    const saveButton = screen.getByRole("button", { name: /save/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(screen.queryByText("Edit Name")).not.toBeInTheDocument()
    })
  })

  it("handles profile update error gracefully", async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    vi.mocked(profileService.updateProfile).mockRejectedValueOnce(
      new Error("Update failed")
    )

    render(<ProfileDashboard />)

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    })

    const editButton = screen.getByRole("button", { name: /edit/i })
    await user.click(editButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    })

    const saveButton = screen.getByRole("button", { name: /save/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error updating profile:", "Update failed")
    })

    // Dialog should remain open on error
    expect(screen.getByText("Edit Name")).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it("does not display profile content when profile data is not available", () => {
    vi.mocked(useSWR).mockImplementation((key) => {
      if (key === "/user") {
        return { data: mockUser } as any
      }
      if (key === "/profile") {
        return { data: null } as any
      }
      return { data: null } as any
    })

    render(<ProfileDashboard />)

    expect(screen.queryByText("Name:")).not.toBeInTheDocument()
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument()
  })

  it("does not display profile content when user data is not available", () => {
    vi.mocked(useSWR).mockImplementation((key) => {
      if (key === "/user") {
        return { data: null } as any
      }
      if (key === "/profile") {
        return { data: null } as any
      }
      return { data: null } as any
    })

    render(<ProfileDashboard />)

    expect(screen.queryByText("Name:")).not.toBeInTheDocument()
  })

  it("handles user without identities gracefully", () => {
    vi.mocked(useSWR).mockImplementation((key) => {
      if (key === "/user") {
        return { data: { id: "test-user-id", email: "test@example.com", identities: null } } as any
      }
      if (key === "/profile") {
        return { data: null } as any
      }
      return { data: null } as any
    })

    render(<ProfileDashboard />)

    expect(screen.getByRole("button", { name: "Account Settings" })).toBeInTheDocument()
  })
})

