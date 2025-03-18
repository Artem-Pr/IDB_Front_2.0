import dayjs from 'dayjs'
import type { Dayjs, ConfigType } from 'dayjs'

export const getDayjsUTC = (
  date: ConfigType,
  incomingFormat?: string,
)
: Dayjs => dayjs.utc(date, incomingFormat)
