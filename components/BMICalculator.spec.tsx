import "@testing-library/jest-dom"

import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import BMICalculator from "./BMICalculator"

describe("BMICalculator Component", () => {
  it("renders input fields and calculate button", () => {
    render(<BMICalculator />)

    // Check if inputs are rendered
    expect(screen.getByPlaceholderText("Feet")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Inches")).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText("Enter your weight in lbs")
    ).toBeInTheDocument()

    // Check if button is rendered
    expect(screen.getByText("Calculate BMI")).toBeInTheDocument()
  })

  it("calculates BMI and displays the result for normal weight", () => {
    render(<BMICalculator />)

    // Simulate user input for a normal weight BMI
    fireEvent.change(screen.getByPlaceholderText("Feet"), {
      target: { value: "5" },
    })
    fireEvent.change(screen.getByPlaceholderText("Inches"), {
      target: { value: "7" },
    })
    fireEvent.change(screen.getByPlaceholderText("Enter your weight in lbs"), {
      target: { value: "150" },
    })

    // Simulate button click to calculate BMI
    fireEvent.click(screen.getByText("Calculate BMI"))

    // Check if the correct BMI result is displayed
    // The BMI value is displayed in the CircularProgressbar component
    expect(screen.getByText(/23.49/)).toBeInTheDocument() // Calculated BMI
    expect(screen.getByText("Normal weight")).toBeInTheDocument()
  })

  it("calculates BMI and displays the result for overweight", () => {
    render(<BMICalculator />)

    // Simulate user input for an overweight BMI
    fireEvent.change(screen.getByPlaceholderText("Feet"), {
      target: { value: "5" },
    })
    fireEvent.change(screen.getByPlaceholderText("Inches"), {
      target: { value: "7" },
    })
    fireEvent.change(screen.getByPlaceholderText("Enter your weight in lbs"), {
      target: { value: "200" },
    })

    // Simulate button click to calculate BMI
    fireEvent.click(screen.getByText("Calculate BMI"))

    // Check if the correct BMI result and message are displayed
    // The BMI value is displayed in the CircularProgressbar component
    expect(screen.getByText(/31.32/)).toBeInTheDocument() // Calculated BMI
    expect(screen.getByText("Obese")).toBeInTheDocument()

    // Check for weight loss recommendation
    expect(
      screen.getByText(/You need to lose approximately/)
    ).toBeInTheDocument()
  })

  it("does not show weight loss recommendation for normal weight", () => {
    render(<BMICalculator />)

    // Simulate user input for a normal weight BMI
    fireEvent.change(screen.getByPlaceholderText("Feet"), {
      target: { value: "5" },
    })
    fireEvent.change(screen.getByPlaceholderText("Inches"), {
      target: { value: "7" },
    })
    fireEvent.change(screen.getByPlaceholderText("Enter your weight in lbs"), {
      target: { value: "150" },
    })

    // Simulate button click to calculate BMI
    fireEvent.click(screen.getByText("Calculate BMI"))

    // Check that no weight loss message is displayed for normal weight
    expect(
      screen.queryByText(/You need to lose approximately/)
    ).not.toBeInTheDocument()
  })
})
