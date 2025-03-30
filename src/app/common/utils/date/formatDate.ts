import type { ConfigType } from 'dayjs'
import dayjs from 'dayjs'

import { DATE_TIME_FORMAT, INVALID_DATE } from 'src/constants/dateConstants'

const isDayjsOrDate = (date: ConfigType): boolean => dayjs.isDayjs(date) || date instanceof Date

export const formatDate = (DateTimeOriginal: ConfigType, inputFormat?: string, outputFormat?: string): string => {
  try {
    const dayjsDateWithUtc = isDayjsOrDate(DateTimeOriginal)
      ? dayjs(DateTimeOriginal, inputFormat)
        .utc(true)
      : dayjs.utc(DateTimeOriginal, inputFormat)

    const FormattedDate = dayjsDateWithUtc.format(outputFormat || DATE_TIME_FORMAT)

    return FormattedDate === INVALID_DATE ? '' : FormattedDate
  } catch (e) {
    console.error('formatDate error: ', e)
    return ''
  }
}
