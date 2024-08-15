import React, { useEffect, useState } from "react"

import { DateRangePicker } from "@tremor/react"
import dayjs from "dayjs"

interface DateRangeProps {
  initialStartDate: string | undefined
  initialEndDate: string | undefined
  handleDateChange: (date: [string | null, string | null]) => void
}

export default function MonthDropdown({
  initialStartDate,
  initialEndDate,
  handleDateChange,
}: DateRangeProps) {
  const initialRange = {
    from: initialStartDate ? new Date(initialStartDate) : undefined,
    to: initialEndDate ? new Date(initialEndDate) : undefined,
  }

  const [dateRange, setDateRange] = useState<{
    from?: Date | undefined
    to?: Date | undefined
    selectValue?: string | undefined
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
