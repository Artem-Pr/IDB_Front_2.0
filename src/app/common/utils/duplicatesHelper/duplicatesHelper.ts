import {
  dec, inc, mapAccumRight, reject,
  groupBy, identity, values,
} from 'ramda'

import type { FileNameWithExt, Media } from 'src/api/models/media'
import type { NameParts } from 'src/redux/types'

import { copyByJSON, getFilePathWithoutName, getNameParts } from '../utils'

export const renameEqualStrings = (strArr: string[]) => {
  const addPostFix = (str: string, numberOf: number) => `${str}_${numberOf
    .toString()
    .padStart(3, '0')
  }`

  const count = (accum: Record<string, number>, curValue: string, _idx: number, arr: string[]) => {
    const numberOf = accum[curValue] ? inc(accum[curValue]) : 1
    const isAlreadyExist = arr.includes(addPostFix(curValue, numberOf))

    return { ...copyByJSON(accum), [curValue]: isAlreadyExist ? inc(numberOf) : numberOf }
  }

  const arrCreator = (accum: Record<string, number>, curValue: string): [Record<string, number>, string] => {
    const numberOf = accum[curValue] ? dec(accum[curValue]) : Number(curValue)
    const newAccum = { ...copyByJSON(accum), [curValue]: numberOf }
    const newValue = accum[curValue] ? addPostFix(curValue, accum[curValue]) : curValue
    return [newAccum, newValue]
  }

  const isUniq = (numberOf: number): boolean => numberOf === 1

  const countSrtObj = strArr.reduce(count, {})
  const countSrtObjWithoutUniqWords = reject(isUniq, countSrtObj)
  const newStrArr = mapAccumRight(arrCreator, countSrtObjWithoutUniqWords, strArr)
  return newStrArr[1]
}

const renameShortNames = (namePartArr: NameParts[]): NameParts[] => {
  const shortNames = namePartArr.map(({ shortName }) => shortName)
  const renamedShortNames = renameEqualStrings(shortNames)
  return renamedShortNames.map((item, i) => ({ shortName: item, ext: namePartArr[i].ext }))
}

export const renameOriginalNameIfNeeded = <T extends { originalName: Media['originalName'] | '-', filePath?: Media['filePath'] }>(filesArr: T[]): T[] => {
  const newFilesArr = copyByJSON(filesArr)
  const fileNameParts: NameParts[] = newFilesArr.map(({ originalName }) => getNameParts(originalName))

  const renamedNameParts = renameShortNames(fileNameParts)
  return newFilesArr.map((item, i) => {
    const { shortName, ext } = renamedNameParts[i]
    const newFileName = shortName + ext
    const filePath = item.filePath && `/${getFilePathWithoutName(item.filePath)}/${newFileName}`
    return { ...item, originalName: newFileName, ...(filePath && { filePath }) }
  })
}

const findStringsWithDuplicates = <T extends string>(arr: string[]): T[] => {
  const groupedElements = groupBy(identity, arr)
  const duplicatedElements = values(groupedElements)
    .filter((group): group is T[] => Boolean(group && group.length > 1))
  return duplicatedElements.map(group => group[0])
}

export const applyOldNamesIfDuplicates = (newFilesArr: Media[], oldFilesArr: Media[]): {
  filesArrWithoutDuplicates: Media[],
  duplicatesNames: Media['originalName'][],
} => {
  const duplicatesAmongUploadingFiles = findStringsWithDuplicates<FileNameWithExt>(
    newFilesArr.map(({ originalName }) => originalName),
  )

  if (duplicatesAmongUploadingFiles.length) {
    const filesArrWithoutDuplicates = newFilesArr.map(newFile => {
      if (duplicatesAmongUploadingFiles.includes(newFile.originalName)) {
        return {
          ...newFile,
          originalName: oldFilesArr.find(file => file.id === newFile.id)?.originalName as FileNameWithExt,
        }
      }

      return newFile
    })

    return {
      filesArrWithoutDuplicates,
      duplicatesNames: duplicatesAmongUploadingFiles,
    }
  }

  return {
    filesArrWithoutDuplicates: newFilesArr,
    duplicatesNames: [],
  }
}
