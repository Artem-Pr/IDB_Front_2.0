import { useMemo } from 'react'

import { createKeywordsList, createUniqKeywords } from '../helpers'
import { formatDate } from '../../../common/utils/date'
import type { FieldNames, FieldsLabels } from '../types'
import type { FieldsObj } from '../../../../redux/types'

const fieldLabels: Partial<FieldNames> = {
  rating: 'Rating',
  name: 'Name',
  originalDate: 'OriginalDate',
  changeDate: 'ChangeDate',
  filePath: 'File path',
  size: 'Size',
  imageSize: 'Image size',
  megapixels: 'Megapixels',
  type: 'Type',
  keywords: 'Keywords',
  description: 'Description',
}

type FieldsLabelsWithArrayDescription = Partial<
  Omit<FieldsLabels, 'description'> & { description?: (string | undefined)[] }
>

export const usePropertyFields = (filesArr: FieldsObj[], selectedList: number[]) => {
  const fieldsObjElements = useMemo<Partial<FieldsLabels> | null>(() => {
    const getSumFieldsObjData = (): Partial<FieldsLabels> => {
      const selectedFiles: Partial<FieldsLabels>[] = filesArr.filter((_, i) => selectedList.includes(i))
      const sumFieldsObjData = selectedFiles.reduce<FieldsLabelsWithArrayDescription>(
        (accum, { rating, description, originalDate, changeDate, size, imageSize, megapixels, type, keywords }) => ({
          rating: accum.rating === rating ? rating : '...',
          name: '...',
          filePath: '...',
          description: accum.description
            ? Array.from(new Set([...accum.description, description]))
            : description
            ? [description]
            : undefined,
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
        }),
        {}
      )

      const sumFieldsObjDataWithStringifiedDescription: Partial<FieldsLabels> = {
        ...sumFieldsObjData,
        description: sumFieldsObjData?.description?.join(';\n'),
      }

      return sumFieldsObjDataWithStringifiedDescription
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
