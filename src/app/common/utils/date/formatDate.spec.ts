import dayjs from 'dayjs'

import { DATE_TIME_FORMAT } from 'src/constants/dateConstants'

import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('formats a date string correctly with dateTimeFormat', () => {
    const date = '2021-12-25'
    const expected = dayjs(date)
      .format(DATE_TIME_FORMAT)
    const result = formatDate(date)
    expect(result)
      .toEqual(expected)
  })

  it('formats a datetime string correctly with UTC', () => {
    const date = '2021-12-25T15:30:45.000Z'
    const result = formatDate(date, undefined, undefined)
    expect(result)
      .toBe('2021.12.25 15:30:45:000')
  })

  it('formats a Date object correctly with time', () => {
    const date = new Date(2021, 11, 25, 15, 30, 45, 123)
    const result = formatDate(date)
    expect(result)
      .toBe('2021.12.25 15:30:45:123')
  })

  it('formats a dayjs object correctly with time in GMT+0200', () => {
    const date = dayjs('2021-12-25T15:30:45.000')
    const result = formatDate(date)
    expect(result)
      .toBe('2021.12.25 15:30:45:000')
  })

  it('parses and formats according to the given input format', () => {
    const dateString = '25/12/2021'
    const inputFormat = 'DD/MM/YYYY'
    const expected = dayjs(dateString, inputFormat)
      .format(DATE_TIME_FORMAT)
    const result = formatDate(dateString, inputFormat)
    expect(result)
      .toEqual(expected)
  })

  it('parses and formats according to the given output format', () => {
    const dateString = '2021:12:25 15:30:34:567'
    const inputFormat = DATE_TIME_FORMAT
    const outputFormat = 'DD/MM/YYYY'
    const result = formatDate(dateString, inputFormat, outputFormat)
    expect(result)
      .toBe('25/12/2021')
  })
})
