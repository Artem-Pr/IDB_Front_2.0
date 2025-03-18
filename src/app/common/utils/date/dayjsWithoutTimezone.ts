import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

import { DATE_TIME_FORMAT } from 'src/constants/dateConstants'

export const dayjsWithoutTimezone = (
  date: string | Dayjs,
  format: string = DATE_TIME_FORMAT,
)
: Dayjs => dayjs(date, format)
