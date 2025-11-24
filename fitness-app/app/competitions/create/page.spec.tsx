import "@testing-library/jest-dom"

import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { fireEvent } from "@testing-library/react"

import CreateCompetitionPage from "./page"
import { AuthService } from "@/app/services/AuthService"
import { competitionService } from "@/app/services/CompetitionService"
import { createClient } from "@/utils/supabase/client"

// Mock Supabase client
vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "test-user-id" } },
      }),
    },
  })),
}))

// Mock AuthService
vi.mock("@/app/services/AuthService", () => {
  const instance = {
    getUser: vi.fn().mockResolvedValue({
      id: "test-user-id",
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

// Mock CompetitionService
vi.mock("@/app/services/CompetitionService", () => ({
  competitionService: {
    createCompetition: vi.fn(),
  },
}))

// Mock Next.js router
const pushMock = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  redirect: vi.fn((path: string) => {
    throw new Error(`Redirected to ${path}`)
  }),
}))

// Mock Next.js Link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock BackButton
vi.mock("@/components/BackButton", () => ({
  default: () => <button data-testid="back-button">Back</button>,
}))

// Mock AddPlayers component
vi.mock("@/components/AddPlayers", () => ({
  default: ({ selectPlayers }: { selectPlayers: (ids: any[]) => void }) => (
    <div data-testid="add-players-component">
      <button onClick={() => selectPlayers(["player-1", "player-2"])}>
        Select Players
      </button>
    </div>
  ),
}))

// Mock getOrdinalSuffix function
vi.mock("@/app/functions", () => ({
  getOrdinalSuffix: vi.fn((num: number) => {
    if (num === 1) return "1st"
    if (num === 2) return "2nd"
    if (num === 3) return "3rd"
    return `${num}th`
  }),
}))

// Mock window.alert
// const alertMock = vi.fn()
// global.alert = alertMock

// Mock console methods
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
}

describe("CreateCompetitionPage", () => {
  beforeEach(() => {
    // vi.clearAllMocks()
    // alertMock.mockClear()
  })

  it("renders the create competition form with all required elements", () => {
    vi.mocked(createClient().auth.getUser as any).mockResolvedValue({
      data: { user: { id: "test-user-id" } },
    })

    render(<CreateCompetitionPage />)

    expect(screen.getByTestId("create-competition-title")).toBeInTheDocument()
    expect(
      screen.getByText("Set up a new competition and invite players to join the fun.")
    ).toBeInTheDocument()
    expect(screen.getByLabelText("Name of Competition")).toBeInTheDocument()
    expect(screen.getByLabelText("Start Date")).toBeInTheDocument()
    expect(screen.getByLabelText("End Date")).toBeInTheDocument()
    expect(screen.getByLabelText("Rules")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /create competition/i })
    ).toBeInTheDocument()
  })

  it("renders the select players radio buttons", () => {
    render(<CreateCompetitionPage />)

    const yesRadio = screen.getByTestId("players-radio-yes")
    const noRadio = screen.getByTestId("players-radio-no")
    expect(screen.getByText("Select Players")).toBeInTheDocument()
    expect(yesRadio).toBeInTheDocument()
    expect(noRadio).toBeInTheDocument()

  })

  it("shows AddPlayers component when 'Yes' is selected for adding players", async () => {
    const user = userEvent.setup()
    render(<CreateCompetitionPage />)

    const yesRadio = screen.getByTestId("players-radio-yes")
    await user.click(yesRadio)

    await waitFor(() => {
      expect(screen.getByTestId("add-players")).toBeInTheDocument()
      expect(screen.getByTestId("add-players-component")).toBeInTheDocument()
    })
  })

  it("hides AddPlayers component when 'No' is selected for adding players", async () => {
    const user = userEvent.setup()
    render(<CreateCompetitionPage />)

    const noRadio = screen.getByTestId("players-radio-no")

    await user.click(noRadio)
    await waitFor(() => {
      expect(screen.queryByTestId("add-players")).not.toBeInTheDocument()
    })
  })

  it("renders prize inputs when 'Include Prizes' is set to yes", async () => {
    const user = userEvent.setup()
    render(<CreateCompetitionPage />)

    const prizesYesRadio = screen
      .getByText("Include Prizes")
      .parentElement?.querySelectorAll('input[type="radio"][name="has_prizes"]')[0]

    if (prizesYesRadio) {
      await user.click(prizesYesRadio)
    }

    await waitFor(() => {
      expect(screen.getByTestId("prize-1st-place")).toBeInTheDocument()
      expect(screen.getByTestId("prize-2nd-place")).toBeInTheDocument()
      expect(screen.getByTestId("prize-3rd-place")).toBeInTheDocument()
    })
  })

  it("allows user to input competition name", async () => {
    const user = userEvent.setup()
    render(<CreateCompetitionPage />)

    const nameInput = screen.getByLabelText("Name of Competition")
    await user.type(nameInput, "Summer Challenge")

    expect(nameInput).toHaveValue("Summer Challenge")
  })

  it("allows user to input dates", async () => {
    const user = userEvent.setup()
    render(<CreateCompetitionPage />)

    const startDateInput = screen.getByLabelText("Start Date")
    const endDateInput = screen.getByLabelText("End Date")

    fireEvent.change(startDateInput, { target: { value: "2024-06-01" } })
    fireEvent.change(endDateInput, { target: { value: "2024-06-30" } })

    expect(startDateInput).toHaveValue("2024-06-01")
    expect(endDateInput).toHaveValue("2024-06-30")
  })

  it("allows user to input rules", async () => {
    const user = userEvent.setup()
    render(<CreateCompetitionPage />)

    const rulesInput = screen.getByLabelText("Rules")
    await user.type(rulesInput, "No cheating allowed")

    expect(rulesInput).toHaveValue("No cheating allowed")
  })

  it("allows user to input prize rewards", async () => {
    const user = userEvent.setup()
    render(<CreateCompetitionPage />)

    // First enable prizes
    const prizesYesRadio = screen
      .getByText("Include Prizes")
      .parentElement?.querySelectorAll('input[type="radio"][name="has_prizes"]')[0]

    if (prizesYesRadio) {
      await user.click(prizesYesRadio)
    }

    await waitFor(() => {
      const firstPlaceInput = screen.getByLabelText(/1st Place/i)
      fireEvent.change(firstPlaceInput, { target: { value: "$100" } })
      expect(firstPlaceInput).toHaveValue("$100")
    })
  })

  it("creates competition successfully and navigates to competition page", async () => {
    const user = userEvent.setup()
    const mockCreateCompetition = vi.mocked(competitionService.createCompetition)
    mockCreateCompetition.mockResolvedValue([
      { id: "comp-123", name: "Test Competition" },
    ])

    render(<CreateCompetitionPage />)

    const nameInput = screen.getByLabelText("Name of Competition")
    const startDateInput = screen.getByLabelText("Start Date")
    const endDateInput = screen.getByLabelText("End Date")
    const submitButton = screen.getByTestId("create-competition-button")

    fireEvent.change(nameInput, { target: { value: "Test Competition" } })
    fireEvent.change(startDateInput, { target: { value: "2024-06-01" } })
    fireEvent.change(endDateInput, { target: { value: "2024-06-30" } })

    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateCompetition).toHaveBeenCalledWith({
        name: "Test Competition",
        date_started: "2024-06-01",
        date_ending: "2024-06-30",
        rules: "",
        has_prizes: false,
        prizes: [],
        created_by: "test-user-id",
      })
      expect(pushMock).toHaveBeenCalledWith("/competitions/comp-123")
    })
  })

  it("includes prizes in competition data when has_prizes is true", async () => {
    const user = userEvent.setup()
    const mockCreateCompetition = vi.mocked(competitionService.createCompetition)
    mockCreateCompetition.mockResolvedValue([
      { id: "comp-123", name: "Test Competition" },
    ])

    render(<CreateCompetitionPage />)

    // Enable prizes
    const prizesYesRadio = screen
      .getByText("Include Prizes")
      .parentElement?.querySelectorAll('input[type="radio"][name="has_prizes"]')[0]

    if (prizesYesRadio) {
      await user.click(prizesYesRadio)
    }

    // Fill in prize rewards
    await waitFor(() => {
      const firstPlaceInput = screen.getByLabelText(/1st Place/i)
      const secondPlaceInput = screen.getByLabelText(/2nd Place/i)
      const thirdPlaceInput = screen.getByLabelText(/3rd Place/i)

      fireEvent.change(firstPlaceInput, { target: { value: "$100" } })
      fireEvent.change(secondPlaceInput, { target: { value: "$50" } })
      fireEvent.change(thirdPlaceInput, { target: { value: "$25" } })
    })

    // Fill in form fields
    const nameInput = screen.getByLabelText("Name of Competition")
    const startDateInput = screen.getByLabelText("Start Date")
    const endDateInput = screen.getByLabelText("End Date")
    const submitButton = screen.getByRole("button", { name: /create competition/i })

    fireEvent.change(nameInput, { target: { value: "Test Competition" } })
    fireEvent.change(startDateInput, { target: { value: "2024-06-01" } })
    fireEvent.change(endDateInput, { target: { value: "2024-06-30" } })

    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateCompetition).toHaveBeenCalledWith(
        expect.objectContaining({
          has_prizes: true,
          prizes: [
            { place: 1, reward: "$100" },
            { place: 2, reward: "$50" },
            { place: 3, reward: "$25" },
          ],
        })
      )
    })
  })
})
