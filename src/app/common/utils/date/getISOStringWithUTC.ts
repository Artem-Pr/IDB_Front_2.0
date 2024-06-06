import type { ConfigType } from 'dayjs'
import dayjs from 'dayjs'

export const getISOStringWithUTC = (date: ConfigType): string => dayjs(date)
  .utc(true)
  .toISOString()
