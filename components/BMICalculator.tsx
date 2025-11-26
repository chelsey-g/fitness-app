"use client"

import { FaArrowDown } from "react-icons/fa"
import { useState } from "react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

const bmiColors = {
  underweight: "#facc15",
  normal: "#22c55e",
  overweight: "#f97316",
  obese: "#ef4444",
}

const getBmiColor = (message: any) => {
  switch (message) {
    case "Underweight":
      return bmiColors.underweight
    case "Normal weight":
      return bmiColors.normal
    case "Overweight":
      return bmiColors.overweight
    default:
      return bmiColors.obese
  }
}

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
      } else if (Number(bmiValue) < 24.9) {
        bmiMessage = "Normal weight"
        targetBMI = 24.9
      } else if (Number(bmiValue) < 29.9) {
        bmiMessage = "Overweight"
        targetBMI = 24.9
      } else {
        bmiMessage = "Obese"
        targetBMI = 29.9
      }
      setMessage(bmiMessage)

      if (targetBMI && targetBMI < Number(bmiValue)) {
        const targetWeightKg = targetBMI * (heightInMeters * heightInMeters)
        const targetWeightLbs = targetWeightKg / 0.453592
        const weightToLoseLbs = (Number(pounds) - targetWeightLbs).toFixed(2)
        setWeightToLose(weightToLoseLbs)
      } else {
        setWeightToLose(null)
      }
    }
  }

  const bmiPercentage = bmi ? Math.min((Number(bmi) / 40) * 100, 100) : 0

  return (
    <div className="max-w-5xl mx-auto mt-6 bg-white dark:text-black rounded-lg shadow-md p-6">
      <div className="border-b-2 border-snd-bkg pb-4 mb-6">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
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
            className="px-4 py-2 rounded-md bg-logo-green dark:bg-snd-bkg text-black dark:text-white font-medium hover:opacity-90"
          >
            Calculate BMI
          </button>
        </div>
      </form>
      {bmi && (
        <div className="mt-6 p-6 bg-white">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32">
              <CircularProgressbar
                value={bmiPercentage}
                text={`${bmi}`}
                styles={buildStyles({
                  textSize: "1.5rem",
                  textColor: getBmiColor(message),
                  pathColor: getBmiColor(message),
                  trailColor: "#e5e7eb",
                })}
              />
            </div>
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
            <div className="mt-4 flex items-center justify-center">
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
