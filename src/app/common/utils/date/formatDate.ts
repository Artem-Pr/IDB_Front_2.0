import moment from 'moment'

import { dateFormat } from './dateFormats'

export const formatDate = (DateTimeOriginal: string | Date, inputFormat?: string) =>
  moment(DateTimeOriginal, inputFormat).format(dateFormat)
