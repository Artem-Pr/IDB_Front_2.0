import React, { useMemo } from 'react'

import PropertyMenu from '../index'
import { createKeywordsList, createUniqKeywords } from '../helpers'
import { formatDate } from '../../../common/utils/date'
import { FieldNames, FieldsLabels, FieldsObj } from '../types'

const fieldLabels: Partial<FieldNames> = {
  name: 'Name',
  originalDate: 'OriginalDate',
  changeDate: 'ChangeDate',
  filePath: 'File path',
  size: 'Size',
  imageSize: 'Image size',
  megapixels: 'Megapixels',
  type: 'Type',
  keywords: 'Keywords',
}

export const usePropertyFields = (
  filesArr: FieldsObj[],
  selectedList: React.ComponentProps<typeof PropertyMenu>['selectedList']
) => {
  const fieldsObjElements = useMemo<Partial<FieldsLabels> | null>(() => {
    const getSumFieldsObjData = (): Partial<FieldsLabels> => {
      const selectedFiles: Partial<FieldsLabels>[] = filesArr.filter((_, i) => selectedList.includes(i))
      return selectedFiles.reduce(
        (accum, { originalDate, changeDate, size, imageSize, megapixels, type, keywords }) => ({
          name: '...',
          filePath: '...',
          keywords: createUniqKeywords(accum.keywords, keywords),
          originalDate: accum.originalDate === originalDate ? originalDate : '...',
          changeDate:
            accum.changeDate === changeDate && typeof changeDate === 'string'
              ? formatDate(new Date(changeDate))
              : '...',
          imageSize: accum.imageSize === imageSize ? imageSize : '...',
          megapixels: accum.megapixels === megapixels ? megapixels : '...',
          type: accum.type === type ? type : '...',
          size: (accum.size || 0) + (size || 0),
        })
      )
    }

    const getOneFieldObjData = (): Partial<FieldsLabels> => {
      const { changeDate, keywords, size, ...otherFields } = filesArr[selectedList[0]]
      return {
        ...otherFields,
        size: size,
        changeDate: formatDate(new Date(changeDate)),
        keywords: createKeywordsList(keywords),
      }
    }

    const getFieldObjData = () => {
      return selectedList.length === 1 ? getOneFieldObjData() : getSumFieldsObjData()
    }

    return !selectedList.length ? null : getFieldObjData()
  }, [filesArr, selectedList])

  return { fieldsObjElements, fieldLabels }
}
