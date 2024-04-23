import dayjs from "dayjs"

export function getAwardColor(position) {
  if (position === 1) {
    return "text-yellow-500"
  } else if (position === 2) {
    return "text-gray-500"
  } else if (position === 3) {
    return "text-yellow-800"
  }
}

export function getOrdinalSuffix(number) {
  const suffixes = ["th", "st", "nd", "rd"]
  const v = number % 100
  return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}

export function getRandomColor() {
  const colors = ["bg-snd-bkg", "bg-trd-bkg", "bg-nav-bkg"]
  return colors[Math.floor(Math.random() * colors.length)]
}

export function handleDate(date) {
  return dayjs(date).format("MM/DD/YYYY")
}
