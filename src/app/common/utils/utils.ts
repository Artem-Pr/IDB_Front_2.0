import {
  addIndex,
  compose,
  dec,
  filter,
  inc,
  includes,
  intersection,
  isEmpty,
  map,
  mapAccumRight,
  omit,
  prop,
  reject,
  sortBy,
  toLower,
  union,
  without,
} from 'ramda'

import { ResultStatusType } from 'antd/es/result'

import {
  DownloadingObject,
  DownloadingRawObject,
  ExifFilesList,
  Keywords,
  LoadingStatus,
  NameParts,
  UpdatingFieldsWithPath,
  UploadingObject,
} from '../../../redux/types'
import { dateTimeFormat, formatDate } from './date'

export const invokableCompose = <any>compose
export const filterIndexed = addIndex(filter)
export const copyByJSON = (obj: any) => JSON.parse(JSON.stringify(obj))
export const removeExtraSlash = (value: string): string => (value.endsWith('/') ? value.slice(0, -1) : value)
export const removeExtraFirstSlash = (value: string): string => (value.startsWith('/') ? value.slice(1) : value)
// Todo: use R.last instead
export const getLastItem = (list: number[]): number => list[list.length - 1]
export const removeEmptyFields = (obj: Record<string, any>) => reject(field => !field)(obj)
export const sortByField = <K extends Record<string, any>>(fieldName: keyof K) =>
  sortBy<K>(compose(toLower, prop(String(fieldName))))
export const isVideo = (contentType: string) => contentType.startsWith('video')

export const getNameParts = (fullName: string): NameParts => {
  const getNameObj = (fullName: string) => {
    const separatedNameArr = fullName.split('.')
    const shortName = separatedNameArr.slice(0, -1).join('.')
    const ext = '.' + separatedNameArr[separatedNameArr.length - 1]
    return { shortName, ext }
  }
  const isValidName = fullName && fullName !== '-'
  return isValidName ? getNameObj(fullName) : { shortName: '-', ext: '' }
}

export const getTempPath = (filesArr: UploadingObject[], index: number): string => filesArr[index].tempPath
export const isExifExist = (exifList: ExifFilesList, tempPath: string): boolean => !!exifList[tempPath]

export const getUpdatedExifFieldsObj = (exifList: ExifFilesList, tempPath: string): UpdatingFieldsWithPath => {
  const exifObj = exifList[tempPath]
  const originalDate = exifObj?.DateTimeOriginal ? formatDate(exifObj?.DateTimeOriginal as string, dateTimeFormat) : '-'
  return {
    keywords: exifObj?.Keywords || null,
    megapixels: exifObj?.Megapixels || '',
    rating: exifObj?.Rating || 0,
    description: exifObj?.Description || '',
    originalDate,
    tempPath,
  }
}

export const updateFilesArrItemByField = (
  fieldName: keyof UploadingObject,
  filesArr: UploadingObject[],
  updatingFieldsObj: { [key: string]: any }
): UploadingObject[] => {
  return filesArr.map(item => {
    const isEqualFileName = item[fieldName] === updatingFieldsObj[fieldName]
    return isEqualFileName ? { ...item, ...updatingFieldsObj } : item
  })
}

export const renameEqualStrings = (strArr: string[]) => {
  const count = (accum: Record<string, number>, curValue: string) => {
    const numberOf = accum[curValue] ? inc(accum[curValue]) : 1
    return { ...copyByJSON(accum), [curValue]: numberOf }
  }

  const arrCreator = (accum: Record<string, number>, curValue: string): [Record<string, number>, string] => {
    const newValue = accum[curValue] ? dec(accum[curValue]) : curValue
    const newAccum = { ...copyByJSON(accum), [curValue]: newValue }
    const additionalNumber = accum[curValue] ? `_${accum[curValue].toString().padStart(3, '0')}` : ''
    return [newAccum, `${curValue}${additionalNumber}`]
  }

  const isUniq = (numberOf: number): boolean => numberOf === 1

  const countSrtObj = strArr.reduce(count, {})
  const countSrtObjWithoutUniqWords = reject(isUniq, countSrtObj)
  const newStrArr = mapAccumRight(arrCreator, countSrtObjWithoutUniqWords, strArr)
  return newStrArr[1]
}

export const renameShortNames = (namePartArr: NameParts[]): NameParts[] => {
  const shortNames = namePartArr.map(({ shortName }) => shortName)
  const renamedShortNames = renameEqualStrings(shortNames)
  return renamedShortNames.map((item, i) => ({ shortName: item, ext: namePartArr[i].ext }))
}

export const getRenamedObjects = <T extends { name: string }>(filesArr: T[]): T[] => {
  const newFilesArr: T[] = copyByJSON(filesArr)
  const fileNameParts: NameParts[] = newFilesArr.map(({ name }) => getNameParts(name))
  const renamedNameParts = renameShortNames(fileNameParts)
  return newFilesArr.map((item, i) => {
    const { shortName, ext } = renamedNameParts[i]
    return { ...item, name: shortName + ext }
  })
}

export const removeIntersectingKeywords = <T extends { keywords: Keywords }>(
  sameKeywords: string[],
  filesArr: T[]
): T[] => {
  return filesArr.map(item => {
    return { ...item, keywords: without(sameKeywords, item.keywords || []) }
  })
}

export const addKeywordsToAllFiles = <T extends { keywords: Keywords }>(newKeywords: string[], filesArr: T[]): T[] => {
  return filesArr.map(item => {
    return { ...item, keywords: union(newKeywords, item.keywords || []) }
  })
}

export const updateFilesArrayItems = <T extends Record<string, any>>(
  uniqField: keyof T,
  originalFilesArr: T[],
  newFilesArr: T[]
): T[] => {
  const findUpdatedObj = (originalUniqField: string) => newFilesArr.find(file => file[uniqField] === originalUniqField)
  return originalFilesArr.map(file => findUpdatedObj(file[uniqField]) || file)
}

export const isValidResultStatus = (status: LoadingStatus): ResultStatusType | null => {
  return status !== 'empty' && status !== 'loading' ? status : null
}

export const getSameKeywords = (
  filesArr: UploadingObject[] | DownloadingObject[],
  selectedList: number[]
): string[] => {
  const getIntersectionArr = (keywordsArrays: string[][]) => {
    return keywordsArrays.length
      ? keywordsArrays.reduce((previousValue, currentValue): string[] => intersection(previousValue, currentValue))
      : []
  }

  return compose(
    getIntersectionArr,
    map((item: UploadingObject) => item.keywords || []),
    filterIndexed((bom, index) => includes(index, selectedList))
  )(filesArr)
}

export const convertDownLoadingRawObj = (downLoadingRawObj: DownloadingRawObject): DownloadingObject => {
  const { originalName, mimetype } = downLoadingRawObj
  return { ...omit(['mimetype', 'originalName'], downLoadingRawObj), name: originalName, type: mimetype }
}

export const convertDownloadingRawObjectArr = (rawArr: DownloadingRawObject[]): DownloadingObject[] => {
  return rawArr.map(item => convertDownLoadingRawObj(item))
}

export const getFilesWithUpdatedKeywords = <T extends { keywords: Keywords }>(
  filesArr: T[],
  keywords: string[]
): T[] => {
  const newFilesArr = copyByJSON(filesArr)
  return isEmpty(keywords) ? newFilesArr : addKeywordsToAllFiles(keywords, newFilesArr)
}

export const getFilePathWithoutName = (fullPath: string): string => {
  return fullPath.split('/').slice(0, -1).join('/')
}

export const getFolderNameWithoutPath = (fullPath: string): string => {
  return fullPath.split('/').slice(-1).join('/')
}
