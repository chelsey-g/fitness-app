import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { AppRouterContextProviderMock } from "../tests/app-router-context-provider-mock"
import BackButton from "./BackButton"
import React from "react"

describe("BackButton", () => {
  it("calls router.back() when clicked", async () => {
    const back = vi.fn()
    render(
      <AppRouterContextProviderMock router={{ back }}>
        <BackButton />
      </AppRouterContextProviderMock>
    )

    // Simulate click
    fireEvent.click(screen.getByRole("button"))

    // Assert that router.back was called
    expect(back).toHaveBeenCalled()
  })
})
