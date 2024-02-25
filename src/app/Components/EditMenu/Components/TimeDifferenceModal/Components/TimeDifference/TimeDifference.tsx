import React, { memo, useEffect, useState } from 'react'

import { InputNumber } from 'antd'
import dayjs from 'dayjs'

import type { Duration } from 'src/redux/types'

type Durations = 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds'
type TimeDiffObj = Record<Durations, number>

const defaultDifObj: TimeDiffObj = {
  years: 0,
  months: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
}

interface Props {
  dateTime1: string | null
  dateTime2: string | null
  disabled?: boolean
  onChange: (durationMilliseconds: number) => void
}

export const TimeDifference = memo(({
  dateTime1, dateTime2, disabled, onChange,
}: Props) => {
  const [durationState, setDurationState] = useState<TimeDiffObj>(defaultDifObj)

  useEffect(() => {
    const calc = (): TimeDiffObj => {
      const diff = dayjs(dateTime2)
        .diff(dateTime1)
      const dur = dayjs.duration(diff)

      return {
        years: dur.get('years'),
        months: dur.get('months'),
        days: dur.get('days'),
        hours: dur.get('hours'),
        minutes: dur.get('minutes'),
        seconds: dur.get('seconds'),
      }
    }

    setDurationState(dateTime1 && dateTime2 ? calc() : defaultDifObj)
  }, [dateTime1, dateTime2])

  const handleChange = (duration: Durations) => (value: number | null) => {
    const change = () => {
      const newDurationState = { ...durationState, [duration]: value }
      const DayjsDuration: Duration = dayjs.duration(newDurationState)
      onChange(DayjsDuration.as('milliseconds'))
    }

    !disabled && change()
  }

  return (
    <div>
      <InputNumber
        prefix="Y"
        min={-1000}
        max={1000}
        value={durationState.years}
        onChange={handleChange('years')}
        size="small"
        disabled={disabled}
      />
      <InputNumber
        prefix="M"
        min={-12}
        max={12}
        value={durationState.months}
        onChange={handleChange('months')}
        size="small"
        disabled={disabled}
      />
      <InputNumber
        prefix="D"
        min={-31}
        max={31}
        value={durationState.days}
        onChange={handleChange('days')}
        size="small"
        disabled={disabled}
      />
      <InputNumber
        prefix="h"
        min={-24}
        max={24}
        value={durationState.hours}
        onChange={handleChange('hours')}
        size="small"
        disabled={disabled}
      />
      <InputNumber
        prefix="m"
        min={-60}
        max={60}
        value={durationState.minutes}
        onChange={handleChange('minutes')}
        size="small"
        disabled={disabled}
      />
      <InputNumber
        prefix="s"
        min={-60}
        max={60}
        value={durationState.seconds}
        onChange={handleChange('seconds')}
        size="small"
        disabled={disabled}
      />
    </div>
  )
})
