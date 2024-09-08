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
  prop,
  reject,
  sortBy,
  sortWith,
  toLower,
  union,
  without,
} from 'ramda'

import type { Media } from 'src/api/models/media'
import type {
  Keywords,
  LoadingStatus,
  NameParts,
} from 'src/redux/types'
import { MimeTypes } from 'src/redux/types/MimeTypes'

export const invokableCompose = <any>compose
export const filterIndexed = addIndex(filter)
export const copyByJSON = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))
export const removeExtraSlash = (value: string): string => (value.endsWith('/') ? value.slice(0, -1) : value)
export const removeExtraFirstSlash = (value: string): string => (value.startsWith('/') ? value.slice(1) : value)
// Todo: use R.last instead
export const getLastItem = (list: number[]): number => list[list.length - 1]
export const removeEmptyFields = <T extends Record<string, any>>(obj: T): Partial<T> => reject(field => !field)(obj)
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

export const wait = async (timeMs: number = 0, func?: Function) => new Promise(resolve => { setTimeout(resolve, timeMs) })
  .then(() => func && func())

const getNameObj = (fullName: string): NameParts => {
  const separatedNameArr = fullName.split('.')
  const shortName = separatedNameArr.slice(0, -1)
    .join('.')
  const extWithoutDot = <NameParts['extWithoutDot']>separatedNameArr.at(-1)
  const ext: NameParts['ext'] = extWithoutDot ? `.${extWithoutDot}` : ''
  return { shortName, ext, extWithoutDot }
}

export const getNameParts = (fullName: string): NameParts => {
  const isValidName = fullName && fullName !== '-'
  return isValidName ? getNameObj(fullName) : { shortName: '-', ext: '' }
}

export const updateFilesArrItemByField = (
  fieldName: keyof Media,
  filesArr: Media[],
  updatingFieldsObj: Partial<Media>,
): Media[] => filesArr.map(item => {
  const isEqualFileName = item[fieldName] === updatingFieldsObj[fieldName]
  return isEqualFileName ? { ...item, ...updatingFieldsObj } : item
})

export const renameEqualStrings = (strArr: string[]) => {
  const count = (accum: Record<string, number>, curValue: string) => {
    const numberOf = accum[curValue] ? inc(accum[curValue]) : 1
    return { ...copyByJSON(accum), [curValue]: numberOf }
  }

  const arrCreator = (accum: Record<string, number>, curValue: string): [Record<string, number>, string] => {
    const newValue = accum[curValue] ? dec(accum[curValue]) : Number(curValue)
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

export const getRenamedObjects = <T extends { originalName: Media['originalName'] | '-' }>(filesArr: T[]): T[] => {
  const newFilesArr = copyByJSON(filesArr)
  const fileNameParts: NameParts[] = newFilesArr.map(({ originalName }) => getNameParts(originalName))
  const renamedNameParts = renameShortNames(fileNameParts)
  return newFilesArr.map((item, i) => {
    const { shortName, ext } = renamedNameParts[i]
    return { ...item, originalName: shortName + ext }
  })
}

export const removeIntersectingKeywords = <T extends { keywords: Keywords }>(
  sameKeywords: string[],
  filesArr: T[],
): T[] => filesArr.map(item => ({ ...item, keywords: without(sameKeywords, item.keywords || []) }))

export const addKeywordsToAllFiles = <T extends { keywords: Keywords }>(newKeywords: string[], filesArr: T[]): T[] => (
  filesArr.map(item => ({ ...item, keywords: union(newKeywords, item.keywords || []) }))
)

export const updateFilesArrayItems = <T extends keyof Media>(
  uniqField: T,
  originalFilesArr: Media[],
  newFilesArr: Media[],
) => {
  const findUpdatedObj = (originalUniqField: Media[T]) => (
    newFilesArr.find(file => file[uniqField] === originalUniqField)
  )
  return originalFilesArr.map(file => findUpdatedObj(file[uniqField]) || file)
}

export const isValidResultStatus = (status: LoadingStatus): ResultStatusType | null => (
  status !== 'empty' && status !== 'loading' ? status : null
)

export const getSameKeywords = (
  filesArr: Media[],
  selectedList: number[],
): string[] => {
  const getIntersectionArr = (keywordsArrays: string[][]) => (keywordsArrays.length
    ? keywordsArrays.reduce((previousValue, currentValue): string[] => intersection(previousValue, currentValue))
    : [])

  return compose<any, any, any, any>(
    getIntersectionArr,
    map((item: Media) => item.keywords || []),
    filterIndexed((__: any, index: number) => includes(index, selectedList)),
  )(filesArr)
}

export const getFilesWithUpdatedKeywords = <T extends { keywords: Keywords }>(
  filesArr: T[],
  keywords: string[] | null | undefined,
): T[] => {
  const newFilesArr = copyByJSON(filesArr)
  return !keywords || isEmpty(keywords) ? newFilesArr : addKeywordsToAllFiles(keywords, newFilesArr)
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
