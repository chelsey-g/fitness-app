import BMICalculator from "../../components/BMICalculator"
import Navigation from "../../components/Navigation"

export default function CalculatorPage() {
  return (
    <div className="w-full">
      <Navigation />
      <div className="max-w-5xl mx-auto mt-6 bg-white rounded-lg shadow-md">
        <BMICalculator />
      </div>
    </div>
  )
}
