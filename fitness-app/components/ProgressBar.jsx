import { Card, ProgressBar } from "@tremor/react"

export default function ProgressBarComp() {
  return (
    <>
      <Card className="mx-auto max-w-sm">
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
          <span>$9,012 &bull; 45%</span>
          <span>$20,000</span>
        </p>
        <ProgressBar value={45} color="teal" className="mt-3" />
      </Card>
    </>
  )
}
