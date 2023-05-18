import type { ExifDateTime, RawDataValue } from '../../../../../../redux/types'

export const isObject = (value: RawDataValue): value is Record<string, string | number> | ExifDateTime =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length)
