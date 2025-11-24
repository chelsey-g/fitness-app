import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import ProfileDropDown from "@/components/Profile"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import userEvent from "@testing-library/user-event"

// Mock necessary modules
vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: "123",
            email: "test@example.com",
            identities: [{ id: "identity-123" }],
          },
        },
      }),
      signOut: vi.fn().mockResolvedValue({}),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [{ first_name: "John", last_name: "Doe" }],
        error: null,
      }),
      getPublicUrl: vi.fn().mockReturnValue({
        data: { publicUrl: "https://fake.url/profile-image" },
      }),
    }),
    storage: {
      from: vi.fn().mockReturnValue({
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: "https://fake.url/profile-image" },
        }),
      }),
    },
  })),
}))

vi.mock("swr", () => ({
  default: vi.fn((key, fetcher) => fetcher()),
}))

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

vi.mock("@/components/ImageWithFallback", () => ({
  __esModule: true,
  default: vi.fn(({ src, fallbackSrc }) => (
    <img src={src || fallbackSrc} alt="profile picture" />
  )),
}))

describe("ProfileDropDown Component", () => {
  it("renders the profile dropdown with user info", async () => {
    render(<ProfileDropDown />)

    const profileDropdown = screen.getByTestId("profile-dropdown")
    userEvent.click(profileDropdown)

    screen.debug()
  })

  // it("renders fallback image if profile picture is not available", async () => {
  //   vi.mocked(createClient).mockReturnValueOnce({
  //     auth: {
  //       getUser: vi.fn().mockResolvedValue({
  //         data: { user: { id: "123", email: "test@example.com" } },
  //       }),
  //       signOut: vi.fn(),
  //     },
  //     storage: {
  //       from: vi.fn().mockReturnValue({
  //         getPublicUrl: vi.fn().mockReturnValue({
  //           data: { publicUrl: null }, // No profile picture
  //         }),
  //       }),
  //     },
  //     from: vi.fn().mockReturnValue({
  //       select: vi.fn().mockResolvedValue({
  //         data: [{ first_name: "John", last_name: "Doe" }],
  //       }),
  //     }),
  //   })

  //   render(<ProfileDropDown />)

  //   await waitFor(() => {
  //     expect(screen.getByAltText("profile picture")).toHaveAttribute(
  //       "src",
  //       "/images/profile-stock.jpg"
  //     )
  //   })
  // })

  // it("calls sign out when the logout button is clicked", async () => {
  //   const mockRouter = useRouter()
  //   const mockSupabase = createClient()

  //   render(<ProfileDropDown />)

  //   // Open dropdown and click the "Logout" button
  //   userEvent.click(screen.getByAltText("profile picture"))
  // })
})
