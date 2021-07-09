import { useMemo } from 'react'
import { compose, curry, isEmpty, omit } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { upload } from '../../redux/selectors'
import {
  addKeywordsToAllFiles,
  getNameParts,
  removeIntersectingKeywords,
  renameShortNames,
  updateFilesArrayItems,
} from './utils'
import { fetchFullExif, setLoading, updateUploadingFilesArr } from '../../redux/reducers/uploadSlice-reducer'
import { DownloadingObject, UploadingObject } from '../../redux/types'

export const useCurrentPage = () => {
  const { pathname } = useLocation()
  const isUploadingPage = pathname === '/upload'
  return {
    isUploadingPage,
    isMainPage: !isUploadingPage,
    currentPageNumber: useMemo(() => (isUploadingPage ? '2' : '1'), [isUploadingPage]),
  }
}

export const useUpdateFields = (filesArr: Array<UploadingObject | DownloadingObject>) => {
  const dispatch = useDispatch<any>()
  const { fullExifFilesList } = useSelector(upload)

  const isExifExist = (tempPath: string): boolean => !!fullExifFilesList[tempPath]

  const updateOne = (tempPath: string): Promise<boolean> | false => {
    return !isExifExist(tempPath) && dispatch(fetchFullExif([tempPath]))
  }

  const updateAll = (): Promise<boolean> | false => {
    const tempPathArr = filesArr.map(({ tempPath }) => tempPath).filter(tempPath => !isExifExist(tempPath))
    return !!tempPathArr.length && dispatch(fetchFullExif(tempPathArr))
  }

  const load = (response: Promise<boolean>): Promise<boolean> => {
    dispatch(setLoading(true))
    return response.then(() => dispatch(setLoading(false)))
  }

  const updateUploadingFiles = (tempPath: string, all = false): Promise<boolean> => {
    const response = all ? updateAll() : updateOne(tempPath)
    return response ? load(response) : Promise.resolve(true)
  }

  return {
    updateUploadingFiles,
  }
}

export const useEditFilesArr = (selectedList: number[], filesArr: UploadingObject[], sameKeywords: string[] = []) => {
  const dispatch = useDispatch()
  return useMemo(() => {
    const getRenamedObjects = (filesArr: UploadingObject[]): UploadingObject[] => {
      const fileNameParts = filesArr.map(({ name }) => getNameParts(name))
      const renamedNameParts = renameShortNames(fileNameParts)
      return filesArr.map((item, i) => {
        const { shortName, ext } = renamedNameParts[i]
        return { ...item, name: shortName + ext }
      })
    }

    const addEditedFieldsToFileArr = (
      filesArr: UploadingObject[],
      editedFields: Record<string, any>
    ): UploadingObject[] => {
      const keywords: string[] = editedFields?.keywords || []
      const updatedFileArr = isEmpty(keywords) ? filesArr : addKeywordsToAllFiles(keywords, filesArr)
      return updatedFileArr.map(item => ({ ...item, ...omit(['keywords'], editedFields) }))
    }

    const selectedFilesArr = filesArr.filter((_, idx) => selectedList.includes(idx))
    const selectedFilesWithoutSameKeywords = removeIntersectingKeywords(sameKeywords, selectedFilesArr)
    const AddEditedFieldsToFilteredFileArr = curry(addEditedFieldsToFileArr)(selectedFilesWithoutSameKeywords)
    const mixUpdatedFilesItemsWithOriginalOnes = curry(updateFilesArrayItems)(filesArr)

    return compose(
      dispatch,
      updateUploadingFilesArr,
      mixUpdatedFilesItemsWithOriginalOnes,
      getRenamedObjects,
      AddEditedFieldsToFilteredFileArr
    )
  }, [dispatch, selectedList, filesArr, sameKeywords])
}
