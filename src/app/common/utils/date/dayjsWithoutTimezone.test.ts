import dayjs from 'dayjs'

import { DATE_TIME_FORMAT } from 'src/constants/dateConstants'

import { dayjsWithoutTimezone } from './dayjsWithoutTimezone'

describe('dayjsWithoutTimezone', () => {
  it('should parse a date string correctly', () => {
    const dateString = '2025.03.14 22:05:32:000'
    const result = dayjsWithoutTimezone(dateString)
    expect(result.format(DATE_TIME_FORMAT))
      .toBe(dateString)
  })

  it('should handle Dayjs object correctly', () => {
    const date = dayjs('2023-10-10T10:00:00Z')
    const result = dayjsWithoutTimezone(date)
    expect(result.isSame(date))
      .toBe(true)
  })

  it('should return a Dayjs object', () => {
    const dateString = '2023-10-10T10:00:00Z'
    const result = dayjsWithoutTimezone(dateString)
    expect(dayjs.isDayjs(result))
      .toBe(true)
  })
})
