import { Tracker } from "@tremor/react"

export const ProgressTracker = () => (
  <div className="mx-auto max-w-md">
    <div>
      For the last 20 days, here is your progress...
      <Tracker
        data={[
          { color: "nav-bkg", tooltip: "Tracker Info" },
          { color: "snd-bkg", tooltip: "Tracker Info" },
          { color: "prm-bkg", tooltip: "Tracker Info" },
          { color: "trd-bkg", tooltip: "Tracker Info" },
          { color: "red", tooltip: "Tracker Info" },
          { color: "trd-bkg", tooltip: "Tracker Info" },
          { color: "prm-bkg", tooltip: "Tracker Info" },
          { color: "trd-bkg", tooltip: "Tracker Info" },
          { color: "trd-bkg", tooltip: "Tracker Info" },
          { color: "red", tooltip: "Tracker Info" },
          { color: "trd-bkg", tooltip: "Tracker Info" },
          { color: "trd-bkg", tooltip: "Tracker Info" },
          { color: "trd-bkg", tooltip: "Tracker Info" },
          { color: "prm-bkg", tooltip: "Tracker Info" },
          { color: "trd-bkg", tooltip: "Tracker Info" },
          { color: "trd-bkg", tooltip: "Tracker Info" },
          { color: "trd-bkg", tooltip: "Tracker Info" },
          { color: "trd-bkg", tooltip: "Tracker Info" },
          { color: "trd-bkg", tooltip: "Tracker Info" },
          { color: "trd-bkg", tooltip: "Tracker Info" },
          { color: "trd-bkg", tooltip: "Tracker Info" },
        ]}
      />
    </div>
  </div>
)

export default ProgressTracker
