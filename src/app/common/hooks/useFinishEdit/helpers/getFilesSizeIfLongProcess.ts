import type { Media } from 'src/api/models/media'
import { formatSize } from 'src/app/common/utils'

import { getFileSizesSum } from './getFileSizesSum'

export const maxFileSizeForExifUpdating = 200_000_000 // 200 Mb

export const getFilesSizeIfLongProcess = (filesArr: Media[], selectedList: number[]) => {
  const fileSizesSum = getFileSizesSum(filesArr, selectedList)
  return fileSizesSum > maxFileSizeForExifUpdating ? formatSize(fileSizesSum) : false
}
