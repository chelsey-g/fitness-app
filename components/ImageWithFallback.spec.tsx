import "@testing-library/jest-dom"

import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import ImageWithFallback from "@/components/ImageWithFallback"

// Mock next/image to behave like a normal img element
vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, onError, ...props }: any) => (
    <img src={src} alt={alt} onError={onError} {...props} />
  ),
}))

describe("ImageWithFallback Component", () => {
  it("renders with the primary image source", () => {
    render(
      <ImageWithFallback
        src="primary-image.jpg"
        fallbackSrc="fallback-image.jpg"
        alt="Test Image"
        width={40}
        height={40}
      />
    )

    // Check if the primary image source is rendered
    const image = screen.getByAltText("Test Image")
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", "primary-image.jpg")
  })

  it("renders fallback image when the primary image fails to load", async () => {
    render(
      <ImageWithFallback
        src="primary-image.jpg"
        fallbackSrc="fallback-image.jpg"
        alt="Test Image"
        width={40}
        height={40}
      />
    )

    // Simulate an image load error
    const image = screen.getByAltText("Test Image")
    fireEvent.error(image) // Simulate the error event

    // Check if the fallback image source is rendered
    expect(image).toHaveAttribute("src", "fallback-image.jpg")
  })
})
