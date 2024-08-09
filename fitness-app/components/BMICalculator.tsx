"use client"

import {
  FaArrowDown,
  FaCheckCircle,
  FaExclamationCircle,
  FaWeight,
} from "react-icons/fa"
import React, { useState } from "react"

const BMICalculator = () => {
  const [feet, setFeet] = useState("")
  const [inches, setInches] = useState("")
  const [pounds, setPounds] = useState<string>("")
  const [bmi, setBMI] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [weightToLose, setWeightToLose] = useState<string | null>(null)

  const calculateBMI = () => {
    if (feet && inches && pounds) {
      const heightInInches = parseInt(feet) * 12 + parseInt(inches)
      const heightInMeters = heightInInches * 0.0254
      const weightInKg = Number(pounds) * 0.453592
      const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(
        2
      )
      setBMI(bmiValue)
      let bmiMessage = ""
      let targetBMI = null

      if (Number(bmiValue) < 18.5) {
        bmiMessage = "Underweight"
        targetBMI = 18.5
      } else if (Number(bmiValue) >= 18.5 && Number(bmiValue) < 24.9) {
        bmiMessage = "Normal weight"
        targetBMI = 24.9
      } else if (Number(bmiValue) >= 25 && Number(bmiValue) < 29.9) {
        bmiMessage = "Overweight"
        targetBMI = 24.9
      } else {
        bmiMessage = "Obese"
        targetBMI = 29.9
      }
      setMessage(bmiMessage)

      if (targetBMI && Number(targetBMI) < Number(bmiValue)) {
        const targetWeightKg = targetBMI * (heightInMeters * heightInMeters)
        const targetWeightLbs = targetWeightKg / 0.453592
        const weightToLoseLbs = (Number(pounds) - targetWeightLbs).toFixed(2)
        setWeightToLose(weightToLoseLbs)
      } else {
        setWeightToLose(null)
      }
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
          <div className="flex justify-center items-center">
            <FaWeight className="text-3xl text-snd-bkg mr-2" />
            <p className="text-3xl font-bold">
              Your BMI: <span className="text-snd-bkg">{bmi}</span>
            </p>
          </div>
          <p className="text-xl text-gray-700 mt-2">{message}</p>
          {weightToLose && (
            <div className="mt-4">
              <div className="flex justify-center items-center text-red-500">
                <FaArrowDown className="text-2xl mr-2" />
                <p className="text-lg">
                  You need to lose approximately {weightToLose} lbs to reach the
                  next category of BMI
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BMICalculator
