"use client"

import React, { useState } from "react"

import Navigation from "../../../components/Navigation"

const CalorieCalculator = () => {
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("male")
  const [weight, setWeight] = useState("")
  const [heightFeet, setHeightFeet] = useState("")
  const [heightInches, setHeightInches] = useState("")
  const [activityLevel, setActivityLevel] = useState("1.2")
  const [calories, setCalories] = useState(null)
  const [calorieData, setCalorieData] = useState([])

  const calculateCalories = () => {
    if (!age || !weight || !heightFeet || !heightInches) return

    // Convert height to inches
    const height = parseInt(heightFeet) * 12 + parseInt(heightInches)

    // Convert weight to kg
    const weightKg = weight * 0.453592

    let bmr
    if (gender === "male") {
      bmr = 88.362 + 13.397 * weightKg + 4.799 * height * 2.54 - 5.677 * age
    } else {
      bmr = 447.593 + 9.247 * weightKg + 3.098 * height * 2.54 - 4.33 * age
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
    <div>
      <Navigation />
      <div className="mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Calorie Calculator
        </h1>
        <div className="mb-4">
          <label className="block text-gray-700">Age:</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Gender:</label>
          <select
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Weight (lbs):</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Height:</label>
          <div className="flex space-x-2">
            <input
              type="number"
              className="w-1/2 p-2 border border-gray-300 rounded mt-1"
              placeholder="Feet"
              value={heightFeet}
              onChange={(e) => setHeightFeet(e.target.value)}
            />
            <input
              type="number"
              className="w-1/2 p-2 border border-gray-300 rounded mt-1"
              placeholder="Inches"
              value={heightInches}
              onChange={(e) => setHeightInches(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Activity Level:</label>
          <select
            className="w-full p-2 border border-gray-300 rounded mt-1"
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
        <button
          className="w-full bg-snd-bkg text-white p-2 rounded mt-4"
          onClick={calculateCalories}
        >
          Calculate
        </button>
        {calories && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
            <h2 className="text-xl font-bold text-green-700">
              Your Daily Calorie Needs:
            </h2>
            <p className="text-green-700">{calories} calories/day</p>
          </div>
        )}
      </div>
      {calorieData.length > 0 && (
        <div className="mt-8 mx-auto bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Calorie Needs Based on Activity Level
          </h2>
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Activity Level</th>
                <th className="px-4 py-2 border">Calories Needed</th>
              </tr>
            </thead>
            <tbody>
              {calorieData.map((row, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{row.level}</td>
                  <td className="px-4 py-2 border">{row.calories}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default CalorieCalculator
