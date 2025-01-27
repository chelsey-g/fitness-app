"use client"

import { useState } from "react"

export default function CalorieCalculator() {
  type CalorieData = {
    level: string
    multiplier: number
    calories: number
  }

  const [age, setAge] = useState("")
  const [gender, setGender] = useState("male")
  const [weight, setWeight] = useState<number | string>("")
  const [heightFeet, setHeightFeet] = useState("")
  const [heightInches, setHeightInches] = useState("")
  const [activityLevel, setActivityLevel] = useState("1.2")
  const [calories, setCalories] = useState<number | null>(null)
  const [calorieData, setCalorieData] = useState<CalorieData[]>([])

  const calculateCalories = () => {
    if (!age || !weight || !heightFeet || !heightInches) return

    const height = parseInt(heightFeet) * 12 + parseInt(heightInches)
    const weightKg = Number(weight) * 0.453592

    let bmr: number
    if (gender === "male") {
      bmr =
        88.362 + 13.397 * weightKg + 4.799 * height * 2.54 - 5.677 * Number(age)
    } else {
      bmr =
        447.593 + 9.247 * weightKg + 3.098 * height * 2.54 - 4.33 * Number(age)
    }

    const totalCalories = Math.round(bmr * parseFloat(activityLevel))
    setCalories(totalCalories)

    const levels = [
      { level: "Sedentary", multiplier: 1.2 },
      { level: "Light", multiplier: 1.375 },
      { level: "Moderate", multiplier: 1.55 },
      { level: "Active", multiplier: 1.725 },
      { level: "Very Active", multiplier: 1.9 },
    ]
    const data = levels.map((lvl) => ({
      ...lvl,
      calories: Math.round(bmr * lvl.multiplier),
    }))
    setCalorieData(data)
  }

  return (
    <>
      <div className="max-w-5xl mx-auto mt-6 bg-white rounded-lg shadow-md p-6 dark:text-black">
        <div className="border-b-2 border-snd-bkg pb-4 mb-6">
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
            Calorie Calculator
          </h1>
          <p className="text-lg text-gray-700">
            Calculate your daily calorie needs based on your activity level.
          </p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-gray-600 mb-1">Age:</label>
            <input
              type="number"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-full"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Gender:</label>
            <select
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-full"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Weight (lbs):</label>
            <input
              type="number"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-full"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your weight"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Height:</label>
            <div className="flex space-x-2">
              <input
                type="number"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-1/2"
                placeholder="Feet"
                value={heightFeet}
                onChange={(e) => setHeightFeet(e.target.value)}
              />
              <input
                type="number"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-1/2"
                placeholder="Inches"
                value={heightInches}
                onChange={(e) => setHeightInches(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Activity Level:</label>
            <select
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-full"
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
            >
              <option value="1.2">Sedentary: little or no exercise</option>
              <option value="1.375">Light: exercise 1-3 times/week</option>
              <option value="1.55">Moderate: exercise 4-5 times/week</option>
              <option value="1.725">
                Active: daily exercise or intense exercise 3-4 times/week
              </option>
              <option value="1.9">
                Very Active: intense exercise 6-7 times/week
              </option>
            </select>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-logo-green dark:bg-snd-bkg text-black dark:text-white font-medium hover:opacity-90"
              onClick={calculateCalories}
            >
              Calculate Calories
            </button>
          </div>
        </form>

        {calorieData.length > 0 && (
          <div className="max-w-5xl mx-auto mt-8 bg-white dark:text-black rounded-lg p-6">
            <div className="border-b-2 border-snd-bkg pb-4 mb-4">
              <h2 className="text-4xl font-extrabold text-nav-bkg tracking-tight">
                Calorie Needs
              </h2>
              <p className="text-lg text-gray-700">
                These are suggestions for maintaining your current weight.
              </p>
            </div>
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Activity Level</th>
                  <th className="px-4 py-2 border">Calories Needed</th>
                </tr>
              </thead>
              <tbody>
                {calorieData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{row.level}</td>
                    <td className="px-4 py-2 border">{row.calories}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
