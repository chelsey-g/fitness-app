"use client"

import React, { useState } from "react"

const BMICalculator = () => {
  const [feet, setFeet] = useState("")
  const [inches, setInches] = useState("")
  const [pounds, setPounds] = useState("")
  const [bmi, setBMI] = useState(null)
  const [message, setMessage] = useState("")

  const calculateBMI = () => {
    if (feet && inches && pounds) {
      const heightInInches = parseInt(feet) * 12 + parseInt(inches)
      const heightInMeters = heightInInches * 0.0254
      const weightInKg = pounds * 0.453592
      const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(
        2
      )
      setBMI(bmiValue)
      let bmiMessage = ""
      if (bmiValue < 18.5) {
        bmiMessage = "Underweight"
      } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
        bmiMessage = "Normal weight"
      } else if (bmiValue >= 25 && bmiValue < 29.9) {
        bmiMessage = "Overweight"
      } else {
        bmiMessage = "Obese"
      }
      setMessage(bmiMessage)
    }
  }

  return (
    <div className="mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold mb-4 text-center">BMI Calculator</h1>
      <div className="mb-4">
        <label htmlFor="feet" className="block text-gray-700">
          Height:
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            id="feet"
            value={feet}
            onChange={(e) => setFeet(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
            placeholder="Feet"
          />
          <input
            type="number"
            id="inches"
            value={inches}
            onChange={(e) => setInches(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
            placeholder="Inches"
          />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="pounds" className="block text-gray-700">
          Weight (lbs):
        </label>
        <input
          type="number"
          id="pounds"
          value={pounds}
          onChange={(e) => setPounds(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-2"
          placeholder="Enter your weight in lbs"
        />
      </div>
      <button
        onClick={calculateBMI}
        className="w-full bg-snd-bkg text-white py-2 rounded mt-4 hover:opacity-90 transition duration-300 ease-in-out"
      >
        Calculate BMI
      </button>
      {bmi && (
        <div className="mt-6 text-center bg-gray-100 p-4 rounded-lg shadow-lg">
          <p className="text-3xl font-bold">
            Your BMI: <span className="text-snd-bkg">{bmi}</span>
          </p>
          <p className="text-xl text-gray-700 mt-2">{message}</p>
        </div>
      )}
    </div>
  )
}

export default BMICalculator
