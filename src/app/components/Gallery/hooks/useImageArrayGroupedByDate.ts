import { useMemo } from 'react'

import dayjs from 'dayjs'

import type { Media } from 'src/api/models/media'
import { DATE_FORMAT } from 'src/constants/dateConstants'

export const useImageArrayGroupedByDate = (imageArr: Media[]) => {
  const imageArrayGroupedByDate = useMemo(
    () => imageArr.reduce<Record<string, (Media & { index: number })[]>>((accum, file, idx) => {
      const originalDateWithoutTime = dayjs(file.originalDate)
        .startOf('day')
        .format(DATE_FORMAT)
      const fileWithIndex = { ...file, index: idx }

      return {
        ...accum,
        [originalDateWithoutTime]: accum[originalDateWithoutTime]
          ? [...accum[originalDateWithoutTime], fileWithIndex]
          : [fileWithIndex],
      }
    }, {}),
    [imageArr],
  )

  return { imageArrayGroupedByDate }
}
