import "@testing-library/jest-dom"

import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import RecipeSearch from "./RecipeSearch"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import useSWR from "swr"

// Mock Supabase client
vi.mock("@/utils/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { identities: [{ id: "user123" }] } },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: [] }),
      insert: vi.fn().mockResolvedValue({}),
    }),
  }),
}))

// Mock SWR
vi.mock("swr", () => ({
  default: vi.fn(() => ({ data: null })),
}))

// Mock useRouter
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

// Mock the API call
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: vi.fn().mockResolvedValue({
    hits: [
      {
        recipe: {
          label: "Teriyaki Chicken",
          dietLabels: ["Low-Carb"],
          //   totalTime: 30,
          //   image: "/path/to/image.jpg",
          //   url: "http://recipe.com",
          url: "http://www.saveur.com/article/Recipes/Chicken-Teriyaki",
        },
      },
    ],
  }),
})

describe("RecipeSearch Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Set the environment variable for the API key
    process.env.NEXT_PUBLIC_RECIPE_API_KEY = "test-api-key"
  })

  it("renders search input and search button", () => {
    render(<RecipeSearch />)

    expect(
      screen.getByPlaceholderText("Search for recipes...")
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument()
  })

  it("fetches and displays recipes when searching", async () => {
    render(<RecipeSearch />)

    fireEvent.change(screen.getByPlaceholderText("Search for recipes..."), {
      target: { value: "chicken" },
    })

    fireEvent.click(screen.getByRole("button", { name: /search/i }))

    // Wait for recipes to appear
    await waitFor(() => {
      expect(screen.getByText("Teriyaki Chicken")).toBeInTheDocument()
    })

    expect(screen.getByText("Low-Carb")).toBeInTheDocument()
  })
})

it("clears search results when clear button is clicked", async () => {
  render(<RecipeSearch />)

  // Simulate typing in search input
  fireEvent.change(screen.getByPlaceholderText("Search for recipes..."), {
    target: { value: "chicken" },
  })

  // Simulate clicking the search button
  fireEvent.click(screen.getByRole("button", { name: /search/i }))

  // Wait for recipes to appear
  await waitFor(() => {
    expect(screen.getByText("Teriyaki Chicken")).toBeInTheDocument()
  })

  // Simulate clicking the clear button
  fireEvent.click(screen.getByTestId("clear-button"))

  // Ensure the recipes are cleared
  expect(screen.queryByText("Teriyaki Chicken")).not.toBeInTheDocument()
})

it("handles saving a recipe", async () => {
  render(<RecipeSearch />)

  // Simulate typing in search input
  fireEvent.change(screen.getByPlaceholderText("Search for recipes..."), {
    target: { value: "chicken" },
  })

  // Simulate clicking the search button
  fireEvent.click(screen.getByRole("button", { name: /search/i }))

  // Wait for recipes to appear
  await waitFor(() => {
    expect(screen.getByText("Teriyaki Chicken")).toBeInTheDocument()
  })

  // simulate clicking the recipe

  fireEvent.click(screen.getByText("Teriyaki Chicken"))

  // Simulate clicking the "Save Recipe" button
  fireEvent.click(screen.getByTestId("save-button"))
})

it("handles viewing a recipe", async () => {
  const openSpy = vi.spyOn(window, "open").mockImplementation(() => {})

  render(<RecipeSearch />)

  // Simulate typing in search input
  fireEvent.change(screen.getByPlaceholderText("Search for recipes..."), {
    target: { value: "chicken" },
  })

  // Simulate clicking the search button
  fireEvent.click(screen.getByRole("button", { name: /search/i }))

  // Wait for recipes to appear
  await waitFor(() => {
    expect(screen.getByText("Teriyaki Chicken")).toBeInTheDocument()
  })

  fireEvent.click(screen.getByText("Teriyaki Chicken"))
  // Simulate clicking the "View Recipe" button
  fireEvent.click(screen.getByText("View Recipe"))

  // Ensure window.open was called
  expect(openSpy).toHaveBeenCalledWith(
    "http://www.saveur.com/article/Recipes/Chicken-Teriyaki",
    "_blank"
  )

  // Cleanup spy
  openSpy.mockRestore()
})
