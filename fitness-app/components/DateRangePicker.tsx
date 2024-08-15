import React, { useEffect, useState } from "react"

import { DateRangePicker } from "@tremor/react"
import dayjs from "dayjs"

export default function MonthDropdown({
  initialStartDate,
  initialEndDate,
  handleDateChange,
}) {
  const initialRange = {
    from: initialStartDate ? new Date(initialStartDate) : null,
    to: initialEndDate ? new Date(initialEndDate) : null,
  }

  const [dateRange, setDateRange] = useState<{
    from: Date | null
    to: Date | null
  }>(initialRange)

  useEffect(() => {
    const { from, to } = dateRange
    handleDateChange([
      from ? dayjs(from).format("YYYY-MM-DD") : null,
      to ? dayjs(to).format("YYYY-MM-DD") : null,
    ])
  }, [dateRange])

  const handleChange = (value: any) => {
    setDateRange(value)
  }

  return (
    <div className="relative w-60">
      <div className="mx-auto max-w-md space-y-3">
        <DateRangePicker
          className="mx-auto max-w-md"
          onValueChange={handleChange}
          value={dateRange}
          placeholder="Filter Date"
          selectPlaceholder="Range"
        />
      </div>
    </div>
  )
}
