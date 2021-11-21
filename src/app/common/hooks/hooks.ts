import { useMemo } from 'react'
import { compose, curry, isEmpty, omit } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { upload } from '../../../redux/selectors'
import { addKeywordsToAllFiles, getRenamedObjects, removeIntersectingKeywords, updateFilesArrayItems } from '../utils'
import { fetchFullExif, setLoading, updateUploadingFilesArr } from '../../../redux/reducers/uploadSlice-reducer'
import { DownloadingObject, Pages, UploadingObject } from '../../../redux/types'
import { setDownloadingFiles } from '../../../redux/reducers/mainPageSlice-reducer'

export const useCurrentPage = () => {
  const { pathname } = useLocation()

  const getPageNumber = (pathname: string): Pages => {
    switch (pathname) {
      case '/':
        return Pages.MAIN
      case '/upload':
        return Pages.UPLOAD
      case '/test-db':
        return Pages.TEST_DB
      default:
        return Pages.MAIN
    }
  }

  const currentPage = getPageNumber(pathname)

  return {
    isUploadingPage: currentPage === Pages.UPLOAD,
    isMainPage: currentPage === Pages.MAIN,
    currentPageNumber: currentPage,
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
      editedFields: Record<string, any>
    ): UploadingObject[] => {
      const keywords: string[] = editedFields?.keywords || []
      const updatedFileArr = isEmpty(keywords) ? filesArr : addKeywordsToAllFiles(keywords, filesArr)
      return updatedFileArr.map(item => ({ ...item, ...omit(['keywords'], editedFields) }))
    }

    const selectedFilesArr = filesArr.filter((_, idx) => selectedList.includes(idx))
    const selectedFilesWithoutSameKeywords = removeIntersectingKeywords(sameKeywords, selectedFilesArr)
    const AddEditedFieldsToFilteredFileArr = curry(addEditedFieldsToFileArr)(selectedFilesWithoutSameKeywords)
    const mixUpdatedFilesItemsWithOriginalOnes = curry(updateFilesArrayItems)(isMainPage ? '_id' : 'tempPath', filesArr)

    return compose(
      dispatch,
      updatingAction,
      mixUpdatedFilesItemsWithOriginalOnes,
      getRenamedObjects,
      AddEditedFieldsToFilteredFileArr
    )
  }, [filesArr, sameKeywords, isMainPage, dispatch, updatingAction, selectedList])
}
