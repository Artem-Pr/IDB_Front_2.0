import type { ConfigType } from 'dayjs'
import dayjs from 'dayjs'

import { DATE_TIME_FORMAT, INVALID_DATE } from './dateFormats'

export const formatDate = (DateTimeOriginal: ConfigType, inputFormat?: string, outputFormat?: string): string => {
  try {
    const FormattedDate = dayjs(DateTimeOriginal, inputFormat)
      .format(outputFormat || DATE_TIME_FORMAT)

    return FormattedDate === INVALID_DATE ? '' : FormattedDate
  } catch (e) {
    console.error('formatDate error: ', e)
    return ''
  }
}
