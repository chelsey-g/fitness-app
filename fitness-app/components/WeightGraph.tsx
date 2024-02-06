import { CChart } from "@coreui/react-chartjs"
import React from "react"
import { getStyle } from "@coreui/utils"

export default function WeightGraph({ data }) {
  return (
    <CChart
      type="line"
      data={{
        labels: data?.map((item) => item.date),
        datasets: [
          {
            label: "Weight",
            backgroundColor: "#3B82F6",
            data: data?.map((item) => item.weight),
          },
        ],
      }}
      options={{
        plugins: {
          legend: {
            labels: {
              color: getStyle("--cui-body-color"),
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: getStyle("--cui-border-color-translucent"),
            },
            ticks: {
              color: getStyle("--cui-body-color"),
            },
          },
          y: {
            grid: {
              color: getStyle("--cui-border-color-translucent"),
            },
            ticks: {
              color: getStyle("--cui-body-color"),
            },
          },
        },
      }}
    />
  )
}
