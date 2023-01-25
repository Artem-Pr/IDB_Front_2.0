import moment from 'moment'
import type { Moment } from 'moment'

import { dateTimeFormat } from './dateFormats'

export const formatDate = (DateTimeOriginal: string | Date | Moment, inputFormat?: string) =>
  moment(DateTimeOriginal, inputFormat).format(dateTimeFormat)
