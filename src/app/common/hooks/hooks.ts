import { useMemo } from 'react'
import { compose, curry, isEmpty, omit } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { upload } from '../../../redux/selectors'
import { addKeywordsToAllFiles, getRenamedObjects, removeIntersectingKeywords, updateFilesArrayItems } from '../utils'
import { setIsExifLoading, updateUploadingFilesArr } from '../../../redux/reducers/uploadSlice'
import { fetchFullExif } from '../../../redux/reducers/uploadSlice/thunks'
import type { DownloadingObject, UploadingObject } from '../../../redux/types'
import { PagePaths } from '../../../redux/types'
import { setDownloadingFiles } from '../../../redux/reducers/mainPageSlice/mainPageSlice'

export const useCurrentPage = () => {
  const { pathname } = useLocation()

  return {
    isUploadingPage: pathname === PagePaths.UPLOAD,
    isMainPage: pathname === PagePaths.MAIN || pathname === PagePaths.DEFAULT,
    currentPageNumber: pathname,
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
    dispatch(setIsExifLoading(true))
    return response.then(() => dispatch(setIsExifLoading(false)))
  }

  const updateUploadingFiles = (tempPath: string, all = false): Promise<boolean> => {
    const response = all ? updateAll() : updateOne(tempPath)
    return response ? load(response) : Promise.resolve(true)
  }

  return {
    updateUploadingFiles,
  }
}

export const useEditFilesArr = (
  selectedList: number[],
  filesArr: UploadingObject[],
  sameKeywords: string[] = [],
  isMainPage: boolean
) => {
  const dispatch = useDispatch()
  const updatingAction = useMemo(() => (isMainPage ? setDownloadingFiles : updateUploadingFilesArr), [isMainPage])

  return useMemo(() => {
    const addEditedFieldsToFileArr = (
      filesArr: UploadingObject[],
      editedFields: Partial<UploadingObject>
    ): UploadingObject[] => {
      const keywords: string[] = editedFields?.keywords || []
      const updatedFileArr = isEmpty(keywords) ? filesArr : addKeywordsToAllFiles(keywords, filesArr)
      return updatedFileArr.map(item => ({ ...item, ...omit(['keywords'], editedFields) }))
    }

    const selectedFilesArr = filesArr.filter((_, idx) => selectedList.includes(idx))
    const selectedFilesWithoutSameKeywords = removeIntersectingKeywords(sameKeywords, selectedFilesArr)
    const AddEditedFieldsToFilteredFileArr: (editedFields: Partial<UploadingObject>) => UploadingObject[] = curry(
      addEditedFieldsToFileArr
    )(selectedFilesWithoutSameKeywords)
    const mixUpdatedFilesItemsWithOriginalOnes = curry(updateFilesArrayItems)(isMainPage ? '_id' : 'tempPath', filesArr)

    return compose(
      dispatch,
      <any>updatingAction,
      mixUpdatedFilesItemsWithOriginalOnes,
      getRenamedObjects,
      AddEditedFieldsToFilteredFileArr
    )
  }, [filesArr, sameKeywords, isMainPage, dispatch, updatingAction, selectedList])
}
