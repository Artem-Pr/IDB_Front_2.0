import { ResultStatusType } from 'antd/es/result'
import {
  addIndex,
  compose,
  dec,
  descend,
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
  sortWith,
  toLower,
  union,
  without,
} from 'ramda'

import type {
  DownloadingObject,
  DownloadingRawObject,
  ExifFilesList,
  Keywords,
  LoadingStatus,
  NameParts,
  RawFullExifObj,
  UpdatingFieldsWithPath,
  UploadingObject,
} from '../../../redux/types'
import { MimeTypes } from '../../../redux/types/MimeTypes'

import { dateTimeFormat, formatDate } from './date'

export const invokableCompose = <any>compose
export const filterIndexed = addIndex(filter)
export const copyByJSON = (obj: any) => JSON.parse(JSON.stringify(obj))
export const removeExtraSlash = (value: string): string => (value.endsWith('/') ? value.slice(0, -1) : value)
export const removeExtraFirstSlash = (value: string): string => (value.startsWith('/') ? value.slice(1) : value)
// Todo: use R.last instead
export const getLastItem = (list: number[]): number => list[list.length - 1]
export const removeEmptyFields = (obj: Record<string, any>) => reject(field => !field)(obj)
export const sortByField = <K extends Record<string, any>>(fieldName: keyof K) => (
  sortBy<K>(compose(toLower, prop(String(fieldName))))
)
export const sortByFieldDescending = <K extends Record<string, any>>(fieldName: keyof K) => (
  sortWith<K>([descend(compose(toLower, prop(String(fieldName))))])
)
export const typeIsMimeTypesKey = (type: string): type is keyof typeof MimeTypes => type.toLowerCase() in MimeTypes
export const isMimeType = (type: string): type is MimeTypes => Object.values(MimeTypes)
  .includes(type as MimeTypes)
export const isVideo = (contentType: MimeTypes) => contentType.startsWith('video')
export const isVideoByExt = (fileExtension: string) => {
  const lowerCaseExt = fileExtension.toLowerCase()
  return typeIsMimeTypesKey(lowerCaseExt) ? isVideo(MimeTypes[lowerCaseExt]) : false
}
export const capitalize = (str: string): string => str.charAt(0)
  .toUpperCase() + str.slice(1)

const getNameObj = (fullName: string) => {
  const separatedNameArr = fullName.split('.')
  const shortName = separatedNameArr.slice(0, -1)
    .join('.')
  const extWithoutDot = separatedNameArr.at(-1)
  const ext = `.${extWithoutDot}`
  return { shortName, ext, extWithoutDot }
}

export const getNameParts = (fullName: string): NameParts => {
  const isValidName = fullName && fullName !== '-'
  return isValidName ? getNameObj(fullName) : { shortName: '-', ext: '' }
}

export const getTempPath = (filesArr: UploadingObject[], index: number): string => filesArr[index].tempPath
export const isExifExist = (exifList: ExifFilesList, tempPath: string): boolean => !!exifList[tempPath]

const tryToRestoreKeywords = (keywords: string | null): string[] | null => {
  const keywordsArray = keywords?.split('.')
  return keywordsArray?.length ? keywordsArray : null
}
// TODO: add tests
const getPrepareKeywordsFromRawExif = (exifObj: RawFullExifObj | undefined) => {
  const getPreparedKeywords = (keywords: RawFullExifObj['Keywords']) => (
    Array.isArray(keywords) ? keywords : tryToRestoreKeywords(keywords)
  )
  return Array.isArray(exifObj?.Subject) ? exifObj.Subject : getPreparedKeywords(exifObj?.Keywords || null)
}

export const getUpdatedExifFieldsObj = (exifList: ExifFilesList, tempPath: string): UpdatingFieldsWithPath => {
  const exifObj = exifList[tempPath]

  const originalDateRaw = exifObj?.DateTimeOriginal || exifObj?.CreationDate || exifObj?.CreateDate
  const originalDateFormatted = originalDateRaw ? formatDate(originalDateRaw.rawValue, dateTimeFormat) : '-'

  return {
    keywords: getPrepareKeywordsFromRawExif(exifObj),
    megapixels: exifObj?.Megapixels || '',
    rating: exifObj?.Rating || 0,
    description: exifObj?.Description || '',
    originalDate: originalDateFormatted,
    tempPath,
  }
}

export const updateFilesArrItemByField = (
  fieldName: keyof UploadingObject,
  filesArr: UploadingObject[],
  updatingFieldsObj: { [key: string]: any },
): UploadingObject[] => filesArr.map(item => {
  const isEqualFileName = item[fieldName] === updatingFieldsObj[fieldName]
  return isEqualFileName ? { ...item, ...updatingFieldsObj } : item
})

export const renameEqualStrings = (strArr: string[]) => {
  const count = (accum: Record<string, number>, curValue: string) => {
    const numberOf = accum[curValue] ? inc(accum[curValue]) : 1
    return { ...copyByJSON(accum), [curValue]: numberOf }
  }

  const arrCreator = (accum: Record<string, number>, curValue: string): [Record<string, number>, string] => {
    const newValue = accum[curValue] ? dec(accum[curValue]) : curValue
    const newAccum = { ...copyByJSON(accum), [curValue]: newValue }
    const additionalNumber = accum[curValue]
      ? `_${accum[curValue].toString()
        .padStart(3, '0')}`
      : ''
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
  filesArr: T[],
): T[] => filesArr.map(item => ({ ...item, keywords: without(sameKeywords, item.keywords || []) }))

export const addKeywordsToAllFiles = <T extends { keywords: Keywords }>(newKeywords: string[], filesArr: T[]): T[] => (
  filesArr.map(item => ({ ...item, keywords: union(newKeywords, item.keywords || []) }))
)

export const updateFilesArrayItems = <T extends Record<string, any>>(
  uniqField: keyof T,
  originalFilesArr: T[],
  newFilesArr: T[],
): T[] => {
  const findUpdatedObj = (originalUniqField: string) => newFilesArr.find(file => file[uniqField] === originalUniqField)
  return originalFilesArr.map(file => findUpdatedObj(file[uniqField]) || file)
}

export const isValidResultStatus = (status: LoadingStatus): ResultStatusType | null => (
  status !== 'empty' && status !== 'loading' ? status : null
)

export const getSameKeywords = (
  filesArr: UploadingObject[] | DownloadingObject[],
  selectedList: number[],
): string[] => {
  const getIntersectionArr = (keywordsArrays: string[][]) => (keywordsArrays.length
    ? keywordsArrays.reduce((previousValue, currentValue): string[] => intersection(previousValue, currentValue))
    : [])

  return compose<any, any, any, any>(
    getIntersectionArr,
    map((item: UploadingObject) => item.keywords || []),
    filterIndexed((__: any, index: number) => includes(index, selectedList)),
  )(filesArr)
}

export const convertDownLoadingRawObj = (downLoadingRawObj: DownloadingRawObject): DownloadingObject => {
  const { originalName, mimetype } = downLoadingRawObj
  return { ...omit(['mimetype', 'originalName'], downLoadingRawObj), name: originalName, type: mimetype }
}

export const convertDownloadingRawObjectArr = (rawArr: DownloadingRawObject[]): DownloadingObject[] => (
  rawArr.map(item => convertDownLoadingRawObj(item))
)

export const getFilesWithUpdatedKeywords = <T extends { keywords: Keywords }>(
  filesArr: T[],
  keywords: string[],
): T[] => {
  const newFilesArr = copyByJSON(filesArr)
  return isEmpty(keywords) ? newFilesArr : addKeywordsToAllFiles(keywords, newFilesArr)
}

export const getFilePathWithoutName = (fullPath: string): string => fullPath.split('/')
  .slice(0, -1)
  .join('/')

export const getFolderNameWithoutPath = (fullPath: string): string => fullPath.split('/')
  .slice(-1)
  .join('/')

export const changeExtension = (nameWithExtension: string, newExtension: string): string => (
  `${nameWithExtension
    .split('.')
    .slice(0, -1)
    .join('.')
  }.${newExtension}`
)
