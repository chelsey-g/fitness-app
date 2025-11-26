import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"

import ProgressTracker from "./ProgressTracker" // Adjust path as needed
import dayjs from "dayjs"

// Mock the Supabase client
vi.mock("@/utils/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "user-id" } },
      }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          data: [
            {
              weight: 150,
              date_entry: dayjs().subtract(1, "day").toISOString(),
            },
            {
              weight: 155,
              date_entry: dayjs().subtract(10, "day").toISOString(),
            },
          ],
          error: null,
        }),
      }),
    }),
  }),
}))

describe("ProgressTracker", () => {
  it("renders the tracker and shows the tracked weight dates", async () => {
    // Render the component
    render(<ProgressTracker />)

    // Wait for the component to finish fetching data
    await waitFor(() => {
      // Check if the Tracker component renders with the correct role
      const tracker = screen.getByRole("region", { name: "Weight tracking calendar" })
      expect(tracker).toBeInTheDocument()
    })

    // Check that the tracker visualization is present
    expect(
      screen.getByLabelText("Weight tracking visualization")
    ).toBeInTheDocument()
  })
})
