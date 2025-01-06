import dayjs from "dayjs"

export function getAwardColor(position: number) {
  if (position === 1) {
    return "text-yellow-500"
  } else if (position === 2) {
    return "text-gray-500"
  } else if (position === 3) {
    return "text-yellow-800"
  }
}

export function getOrdinalSuffix(number: number) {
  const suffixes = ["th", "st", "nd", "rd"]
  const v = number % 100
  return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}

export function getRandomColor() {
  const colors = ["bg-nav-bkg", "bg-logo-green", "bg-prm-bkg"]
  return colors[Math.floor(Math.random() * colors.length)]
}

export function handleDate(date: any) {
  return dayjs(date).format("MM/DD/YYYY")
}

export const calculateWeightDifference = (
  goalWeight: number,
  currentWeight: number
) => {
  const difference = goalWeight - currentWeight
  return difference.toFixed(2)
}

export const calculateDaysLeft = (date: any) => {
  const goalDate = new Date(date)
  const today = new Date()
  const differenceInTime = goalDate.getTime() - today.getTime()
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24))
  return differenceInDays
}
