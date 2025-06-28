import type { ExifFilter } from '../types'

export const prepareExifFilters = (exifFilters: ExifFilter[]) => exifFilters
  .filter(f => f.propertyName && !f.isDisabled)
  .map(({ id: _id, ...rest }) => rest) 