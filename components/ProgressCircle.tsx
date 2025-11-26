import { ProgressCircle } from "@tremor/react"

interface ProgressCircleProps {
  currentWeight: number
  goalWeight: number
}

const ProgressCircleHero = ({ currentWeight, goalWeight }: ProgressCircleProps) => {
  const weightPercentage = (currentWeight: number, goalWeight: number) => {
    let calculatedPercentage = 0
    if (currentWeight >= goalWeight) {
      calculatedPercentage = 100
    } else {
      const weightDifference = goalWeight - currentWeight
      calculatedPercentage =
        ((goalWeight - weightDifference) / goalWeight) * 100
    }
    return calculatedPercentage
  }

  const percentage = weightPercentage(currentWeight, goalWeight)

  return (
    <div className="mx-auto grid grid-cols-1 gap-12">
      <div className="flex justify-center mt-5">
        <ProgressCircle value={percentage} size="xl">
          <span className="text-xs font-medium text-slate-700">
            {percentage.toFixed(2)}%
          </span>
        </ProgressCircle>
      </div>
    </div>
  )
}

export default ProgressCircleHero
