import { FieldsObj } from '../../../../../redux/types'
import { getFileSizesSum } from './getFileSizesSum'
import { formatSize } from '../../../utils'

export const maxFileSizeForExifUpdating = 200_000_000 // 200 Mb

export const getFilesSizeIfLongProcess = (filesArr: FieldsObj[], selectedList: number[]) => {
  const fileSizesSum = getFileSizesSum(filesArr, selectedList)
  return fileSizesSum > maxFileSizeForExifUpdating ? formatSize(fileSizesSum) : false
}
