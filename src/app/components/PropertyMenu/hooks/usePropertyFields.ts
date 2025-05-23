import { ReactNode, useMemo } from 'react'

import type { Tags } from 'exiftool-vendored'

import type { Media } from 'src/api/models/media'
import { formatDate } from 'src/app/common/utils/date'

import { createKeywordsList, createUniqKeywords } from '../helpers'
import type { PropertiesFieldNames, FieldsLabels } from '../types'

const getDurationNumber = (exif: Tags): number => {
  if (typeof exif.Duration === 'number') return exif.Duration
  if (typeof exif.TrackDuration === 'number') return exif.TrackDuration
  if (typeof exif.MediaDuration === 'number') return exif.MediaDuration
  return 0
}

const getDescriptionList = (
  accum: FieldsLabelsWithArrayDescription,
  description: Media['description'],
): FieldsLabelsWithArrayDescription['description'] => {
  if (accum.description) return Array.from(new Set([...accum.description, description].filter(Boolean)))
  if (description) return [description]
  return undefined
}

const getBulkValue = <T extends keyof FieldsLabelsWithArrayDescription, K extends FieldsLabelsWithArrayDescription[T]>(
  accum: FieldsLabelsWithArrayDescription,
  valueObj: { [key in T]: K },
  callback?: (value: K) => ReactNode,
): ReactNode => {
  const key = Object.keys(valueObj)[0]

  const isFieldTheSame = accum[key] === valueObj[key]
  const isFieldFirst = !accum[key]
  if (isFieldFirst || isFieldTheSame) return callback ? callback(valueObj[key]) : valueObj[key]
  return '...'
}

// Order of fields is important
const fieldLabels: Partial<PropertiesFieldNames> = {
  rating: 'Rating',
  originalName: 'Name',
  originalDate: 'OriginalDate',
  changeDate: 'ChangeDate',
  filePath: 'File path',
  size: 'Size',
  imageSize: 'Image size',
  videoDuration: 'Duration',
  videoFrameRate: 'FPS',
  avgBitRate: 'AvgBitrate',
  megapixels: 'Megapixels',
  mimetype: 'Type',
  keywords: 'Keywords',
  description: 'Description',
}

type FieldsLabelsWithArrayDescription = Partial<
Omit<FieldsLabels, 'description' | 'existedFilesArr'> & {
  description?: Media['description'][]
  existedFilesArr?: string[]
}
>

export const usePropertyFields = (filesArr: Media[], selectedList: number[]) => {
  const fieldsObjElements = useMemo<Partial<FieldsLabels> | null>(() => {
    const getSumFieldsObjData = (): Partial<FieldsLabels> => {
      const selectedFiles = filesArr.filter((_, i) => selectedList.includes(i))
      const sumFieldsObjData = selectedFiles.reduce<FieldsLabelsWithArrayDescription>(
        (accum, {
          rating, description, originalName, originalDate, changeDate, size, imageSize, megapixels, mimetype, keywords,
          exif: { Duration, VideoFrameRate, AvgBitrate },
        }): FieldsLabelsWithArrayDescription => ({
          changeDate: accum.changeDate === changeDate && typeof changeDate === 'string' ? formatDate(new Date(changeDate)) : '...',
          description: getDescriptionList(accum, description),
          filePath: '...',
          imageSize: getBulkValue(accum, { imageSize }),
          keywords: createUniqKeywords(accum.keywords, keywords),
          megapixels: getBulkValue(accum, { megapixels }),
          mimetype: getBulkValue(accum, { mimetype }),
          originalDate: getBulkValue(accum, { originalDate }, formatDate),
          originalName: getBulkValue(accum, { originalName }),
          rating: getBulkValue(accum, { rating }),
          size: (accum.size || 0) + (size || 0),
          videoDuration: (accum.videoDuration || 0) + (Duration || 0),
          videoFrameRate: getBulkValue(accum, { videoFrameRate: VideoFrameRate }),
          avgBitRate: getBulkValue(accum, { avgBitRate: AvgBitrate }),
        }),
        {},
      )

      const sumFieldsObjDataWithStringifiedDescription: Partial<FieldsLabels> = {
        ...sumFieldsObjData,
        description: sumFieldsObjData?.description?.join(';\n'),
      }

      return sumFieldsObjDataWithStringifiedDescription
    }

    const getOneFieldObjData = (): Partial<FieldsLabels> => {
      const {
        exif, changeDate, originalDate, keywords, description, ...otherFields
      } = filesArr[selectedList[0]]

      return {
        ...otherFields,
        changeDate: changeDate ? formatDate(changeDate) : undefined,
        description: description || undefined,
        keywords: createKeywordsList(keywords),
        originalDate: originalDate ? formatDate(originalDate) : undefined,
        videoDuration: getDurationNumber(exif) || undefined,
        videoFrameRate: exif.VideoFrameRate || undefined,
        avgBitRate: exif.AvgBitrate || undefined,
      }
    }

    const getFieldObjData = () => (selectedList.length === 1 ? getOneFieldObjData() : getSumFieldsObjData())

    return !selectedList.length ? null : getFieldObjData()
  }, [filesArr, selectedList])

  return { fieldsObjElements, fieldLabels }
}
