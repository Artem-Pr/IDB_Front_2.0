import { useMemo } from 'react'

import { FieldsObj } from '../../../../redux/types'

export const useImageArrayGroupedByDate = (imageArr: FieldsObj[]) => {
  const imageArrayGroupedByDate = useMemo(
    () =>
      imageArr.reduce<Record<string, (FieldsObj & { index: number })[]>>((accum, file, idx) => {
        const originalDateWithoutTime = file.originalDate.split(' ')[0]
        const fileWithIndex = { ...file, index: idx }

        return {
          ...accum,
          [originalDateWithoutTime]: accum[originalDateWithoutTime]
            ? [...accum[originalDateWithoutTime], fileWithIndex]
            : [fileWithIndex],
        }
      }, {}),
    [imageArr]
  )

  return { imageArrayGroupedByDate }
}
