import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import UploadPhoto from "@/components/UploadPicture"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

// Mock the necessary modules
vi.mock("react-icons/go", () => ({
  GoPlus: () => <div>Icon</div>,
}))

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    refresh: vi.fn(),
  })),
}))

vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "123", email: "test@example.com" } },
      }),
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({
          data: {},
          error: null,
        }),
      })),
    },
  })),
}))

describe("UploadPhoto Component", () => {
  it("renders the component and displays the initial UI", () => {
    render(<UploadPhoto />)

    // Check if the "Upload Profile Photo" heading is rendered
    expect(screen.getByText("Upload Profile Photo")).toBeInTheDocument()

    // Check if the "Choose Photo" button is rendered
    expect(screen.getByText("Choose Photo")).toBeInTheDocument()

    // Check if the message "No file chosen" is rendered initially
    expect(screen.getByText("No file chosen")).toBeInTheDocument()

    // Check if the "Upload" button is disabled initially
    expect(screen.getByText("Upload")).toBeDisabled()
  })

  it("allows a user to select a file", async () => {
    render(<UploadPhoto />)

    // Simulate selecting a file
    const fileInput = screen.getByLabelText("Choose Photo")
    const file = new File(["dummy content"], "test-photo.png", {
      type: "image/png",
    })

    fireEvent.change(fileInput, { target: { files: [file] } })
  })

  it("uploads the selected file successfully", async () => {
    const mockRouter = useRouter()
    const mockSupabase = createClient()

    render(<UploadPhoto />)

    // Simulate selecting a file
    const fileInput = screen.getByLabelText("Choose Photo")
    const file = new File(["dummy content"], "test-photo.png", {
      type: "image/png",
    })

    fireEvent.change(fileInput, { target: { files: [file] } })

    // Simulate clicking the "Upload" button
    const uploadButton = screen.getByText("Upload")
    fireEvent.click(uploadButton)

    // Check that the uploading state is displayed
    expect(screen.getByTestId("upload-button")).toBeInTheDocument()

    // Check that the upload button is not in the uploading state after upload
    await waitFor(() => {
      expect(screen.getByText("Upload")).toBeInTheDocument()
    })
  })
})
