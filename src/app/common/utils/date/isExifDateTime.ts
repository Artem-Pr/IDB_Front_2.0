import type { ConfigType } from 'dayjs'
import dayjs from 'dayjs'
import type { ExifDateTime } from 'exiftool-vendored'

import { EXIF_DATE_TIME_FORMAT } from './dateFormats'

export const isExifDateTime = (value: ConfigType | Record<string, any>): value is ExifDateTime => {
  try {
    return dayjs((value as ExifDateTime)?.rawValue, EXIF_DATE_TIME_FORMAT)
      .isValid()
  } catch (e) {
    console.error('isExifDateTime error: ', e)
    return false
  }
}
