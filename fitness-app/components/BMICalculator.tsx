"use client"

import { FaArrowDown, FaWeight } from "react-icons/fa"
import { useState } from "react"

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
    <div className="max-w-5xl mx-auto mt-6 bg-white rounded-lg shadow-md p-6">
      <div className="border-b-2 border-snd-bkg pb-4 mb-6">
        <h1 className="text-4xl font-extrabold text-nav-bkg mb-2 tracking-tight">
          BMI Calculator
        </h1>
        <p className="text-lg text-gray-700">
          Calculate your Body Mass Index (BMI) to understand your weight status.
        </p>
      </div>
      <form className="space-y-4">
        <div>
          <label htmlFor="feet" className="block text-gray-600 mb-1">
            Height (Feet & Inches):
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              id="feet"
              value={feet}
              onChange={(e) => setFeet(e.target.value)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-1/2"
              placeholder="Feet"
            />
            <input
              type="number"
              id="inches"
              value={inches}
              onChange={(e) => setInches(e.target.value)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-1/2"
              placeholder="Inches"
            />
          </div>
        </div>
        <div>
          <label htmlFor="pounds" className="block text-gray-600 mb-1">
            Weight (lbs):
          </label>
          <input
            type="number"
            id="pounds"
            value={pounds}
            onChange={(e) => setPounds(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-full"
            placeholder="Enter your weight in lbs"
          />
        </div>
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={calculateBMI}
            className="relative bg-button-bkg text-nav-bkg font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Calculate BMI
          </button>
        </div>
      </form>
      {bmi && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
          <div className="flex items-center justify-center">
            <FaWeight className="text-4xl text-snd-bkg mr-4" />
            <p className="text-3xl font-extrabold">
              Your BMI: <span className="text-snd-bkg">{bmi}</span>
            </p>
          </div>
          <p
            className={`text-lg mt-4 font-semibold text-center ${
              message === "Underweight"
                ? "text-yellow-500"
                : message === "Normal weight"
                ? "text-green-500"
                : message === "Overweight"
                ? "text-orange-500"
                : "text-red-500"
            }`}
          >
            {message}
          </p>

          {weightToLose && (
            <div className="mt-4 flex items-center justify-center text-red-500">
              <FaArrowDown className="text-2xl mr-2" />
              <p className="text-lg">
                You need to lose approximately {weightToLose} lbs to reach the
                next BMI category.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BMICalculator
