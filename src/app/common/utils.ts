import moment from 'moment'
import { dec, inc, includes, mapAccumRight, reject } from 'ramda'

import { ExifFilesList, NameParts, UpdatingFieldsWithPath, UploadingObject } from '../../redux/types'

export const dateFormat = 'YYYY.MM.DD'

export const copyByJSON = (obj: any) => JSON.parse(JSON.stringify(obj))
export const removeExtraSlash = (value: string): string => (value.endsWith('/') ? value.slice(0, -1) : value)
// Todo: use R.last instead
export const getLastItem = (list: number[]): number => list[list.length - 1]
export const removeEmptyFields = (obj: Record<string, any>) => reject(field => !field)(obj)
export const formatDateTimeOriginal = (DateTimeOriginal: string) =>
  moment(DateTimeOriginal, 'YYYY:MM:DD hh:mm:ss').format(dateFormat)

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
  return {
    keywords: exifObj?.Keywords || null,
    megapixels: exifObj?.Megapixels || '',
    originalDate: formatDateTimeOriginal(exifObj?.DateTimeOriginal as string),
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

export const editFilesArr = (
  selectedList: number[],
  filesArr: UploadingObject[],
  editedFields: Record<string, any>
): UploadingObject[] => {
  return filesArr.map((item, i) => {
    const isEditFile = includes(i, selectedList)
    return isEditFile ? { ...item, ...editedFields } : item
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
