import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import {
  compose, curry, isEmpty, omit,
} from 'ramda'

import {
  clearDownloadingState,
  clearDSelectedList as clearSelectedListDownload,
  selectAllD as selectAllDownload,
  setDownloadingFiles,
  updateDOpenMenus,
} from '../../../redux/reducers/mainPageSlice/mainPageSlice'
import {
  clearSelectedList as clearSelectedListUpload,
  clearUploadingState,
  selectAll as selectAllUpload,
  setIsExifLoading,
  updateOpenMenus,
  updateUploadingFilesArr,
} from '../../../redux/reducers/uploadSlice'
import { fetchFullExif } from '../../../redux/reducers/uploadSlice/thunks'
import { fetchDuplicates } from '../../../redux/reducers/uploadSlice/thunks/fetchDuplicates'
import { updateBlobName } from '../../../redux/reducers/uploadSlice/uploadSlice'
import {
  allSameKeywords,
  currentFilesList,
  currentSelectedList,
  isGlobalExifLoading,
  openMenusSelector,
  selectedDateList,
  selectedFilesList,
  uniqKeywords,
  upload,
} from '../../../redux/selectors'
import { useAppDispatch } from '../../../redux/store/store'
import type { RootState } from '../../../redux/store/types'
import { PagePaths } from '../../../redux/types'
import type {
  BlobUpdateNamePayload, DownloadingObject, MainMenuKeys, UploadingObject,
} from '../../../redux/types'
import {
  addKeywordsToAllFiles, getRenamedObjects, removeIntersectingKeywords, updateFilesArrayItems,
} from '../utils'

const isEditNameOperation = (blobNameData: BlobUpdateNamePayload | false): blobNameData is BlobUpdateNamePayload => (
  blobNameData !== false && blobNameData.oldName !== blobNameData.newName
)

const prepareBlobUpdateNamePayload = (newFilesArr: UploadingObject[]) => (
  ({ name, tempPath }: UploadingObject): BlobUpdateNamePayload | false => {
    const updatedName = newFilesArr.find(newItem => newItem.tempPath === tempPath)?.name

    return updatedName
      ? {
        oldName: name,
        newName: updatedName,
      }
      : false
  }
)

export const useCurrentPage = () => {
  const { pathname, search } = useLocation()
  const query = useMemo(() => new URLSearchParams(search), [search])

  return {
    isUploadingPage: pathname === PagePaths.UPLOAD,
    isMainPage: pathname === PagePaths.MAIN || pathname === PagePaths.DEFAULT,
    isComparisonPage: Boolean(query.get('comparison')),
    currentPageNumber: pathname,
  }
}

export const useFilesList = () => {
  const currentPage = useCurrentPage()
  const filesArr = useSelector((state: RootState) => currentFilesList(state, currentPage))

  return { filesArr }
}

export const useSelectedList = () => {
  const currentPage = useCurrentPage()
  const selectedList = useSelector((state: RootState) => currentSelectedList(state, currentPage))

  return { selectedList }
}

export const useSameKeywords = () => {
  const currentPage = useCurrentPage()
  const sameKeywords = useSelector((state: RootState) => allSameKeywords(state, currentPage))

  return { sameKeywords }
}

export const useOpenMenus = () => {
  const currentPage = useCurrentPage()
  return useSelector((state: RootState) => openMenusSelector(state, currentPage))
}

export const useSelectedFilesList = () => {
  const currentPage = useCurrentPage()
  return useSelector((state: RootState) => selectedFilesList(state, currentPage))
}

export const useSelectedDateList = () => {
  const currentPage = useCurrentPage()
  const selectedDates = useSelector((state: RootState) => selectedDateList(state, currentPage))
  return { selectedDates }
}

export const useSelectAll = () => {
  const dispatch = useAppDispatch()
  const { isMainPage, isUploadingPage } = useCurrentPage()

  const selectAll = useCallback(() => {
    isMainPage && dispatch(selectAllDownload())
    isUploadingPage && dispatch(selectAllUpload())
  }, [dispatch, isMainPage, isUploadingPage])

  return { selectAll }
}

export const useClearSelectedList = () => {
  const dispatch = useAppDispatch()
  const { isMainPage, isUploadingPage } = useCurrentPage()

  const clearSelectedList = useCallback(() => {
    isMainPage && dispatch(clearSelectedListDownload())
    isUploadingPage && dispatch(clearSelectedListUpload())
  }, [dispatch, isMainPage, isUploadingPage])

  return { clearSelectedList }
}

export const useIsExifLoading = () => {
  const currentPage = useCurrentPage()

  return useSelector((state: RootState) => isGlobalExifLoading(state, currentPage))
}

export const useRemoveKeyword = () => {
  const dispatch = useAppDispatch()
  const { filesArr } = useFilesList()
  const { isMainPage, isUploadingPage } = useCurrentPage()

  const removeKeyword = useCallback(
    (keyword: string) => {
      const filesArrWithoutKeyword = removeIntersectingKeywords([keyword], filesArr)
      isMainPage && dispatch(setDownloadingFiles(filesArrWithoutKeyword as DownloadingObject[]))
      isUploadingPage && dispatch(updateUploadingFilesArr(filesArrWithoutKeyword))
    },
    [dispatch, filesArr, isMainPage, isUploadingPage],
  )

  return { removeKeyword }
}

export const useUniqKeywords = () => {
  const currentPage = useCurrentPage()

  return {
    uniqKeywords: useSelector((state: RootState) => uniqKeywords(state, currentPage)),
  }
}

export const useUpdateOpenMenus = () => {
  const dispatch = useAppDispatch()
  const { isMainPage, isUploadingPage } = useCurrentPage()

  const setOpenMenus = useCallback(
    (value: MainMenuKeys[]) => {
      isMainPage && dispatch(updateDOpenMenus(value))
      isUploadingPage && dispatch(updateOpenMenus(value))
    },
    [dispatch, isMainPage, isUploadingPage],
  )

  return { setOpenMenus }
}

export const useClearFilesArray = () => {
  const dispatch = useAppDispatch()
  const { isMainPage, isUploadingPage } = useCurrentPage()

  const clearFilesArr = useCallback(() => {
    isMainPage && dispatch(clearDownloadingState())
    isUploadingPage && dispatch(clearUploadingState())
  }, [dispatch, isMainPage, isUploadingPage])

  return { clearFilesArr }
}

export const useUpdateFields = (filesArr: Array<UploadingObject | DownloadingObject>) => {
  const dispatch = useDispatch<any>()
  const { fullExifFilesList } = useSelector(upload)

  const isExifExist = useCallback((tempPath: string): boolean => !!fullExifFilesList[tempPath], [fullExifFilesList])

  const updateOne = useCallback(
    (tempPath: string): Promise<boolean> | false => !isExifExist(tempPath) && dispatch(fetchFullExif([tempPath])),
    [dispatch, isExifExist],
  )

  const updateAll = useCallback((): Promise<boolean> | false => {
    const tempPathArr = filesArr.map(({ tempPath }) => tempPath)
      .filter(tempPath => !isExifExist(tempPath))
    return !!tempPathArr.length && dispatch(fetchFullExif(tempPathArr))
  }, [dispatch, filesArr, isExifExist])

  const load = useCallback(
    (response: Promise<boolean>): Promise<boolean> => {
      dispatch(setIsExifLoading(true))
      return response.then(() => dispatch(setIsExifLoading(false)))
    },
    [dispatch],
  )

  const updateUploadingFiles = useCallback(
    (tempPath: string, all = false): Promise<boolean> => {
      const response = all ? updateAll() : updateOne(tempPath)
      return response ? load(response) : Promise.resolve(true)
    },
    [load, updateAll, updateOne],
  )

  return {
    updateUploadingFiles,
  }
}

const addEditedFieldsToFileArr = (
  filesArr: UploadingObject[],
  editedFields: Partial<UploadingObject>,
): UploadingObject[] => {
  const keywords: string[] = editedFields?.keywords || []
  const updatedFileArr = isEmpty(keywords) ? filesArr : addKeywordsToAllFiles(keywords, filesArr)
  return updatedFileArr.map(item => ({ ...item, ...omit(['keywords'], editedFields) }))
}

interface UseEditFilesArrProps {
  filesArr: UploadingObject[]
  isMainPage: boolean
  selectedList: number[]
  sameKeywords: string[]
}

export const useEditFilesArr = ({
  filesArr,
  isMainPage,
  selectedList,
  sameKeywords = [],
}: UseEditFilesArrProps) => {
  const dispatch = useAppDispatch()
  const updatingAction = useMemo(() => (isMainPage ? setDownloadingFiles : updateUploadingFilesArr), [isMainPage])

  return useMemo(() => {
    const selectedFilesArr = filesArr.filter((_, idx) => selectedList.includes(idx))
    const selectedFilesWithoutSameKeywords = removeIntersectingKeywords(sameKeywords, selectedFilesArr)
    const AddEditedFieldsToFilteredFileArr: (editedFields: Partial<UploadingObject>) => UploadingObject[] = curry(
      addEditedFieldsToFileArr,
    )(selectedFilesWithoutSameKeywords)
    const mixUpdatedFilesItemsWithOriginalOnes = curry(updateFilesArrayItems)(isMainPage ? '_id' : 'tempPath', filesArr)
    const updateFileBlobsNamesMiddleware = (newFilesArr: UploadingObject[]) => {
      filesArr
        .map(prepareBlobUpdateNamePayload(newFilesArr))
        .filter(isEditNameOperation)
        .forEach(compose(dispatch, updateBlobName))
      return newFilesArr
    }
    const checkNameDuplicatesMiddleware = (newFilesArr: UploadingObject[]) => {
      dispatch(fetchDuplicates(newFilesArr.map(({ name }) => name)))
      return newFilesArr
    }

    return compose(
      dispatch,
      <any>updatingAction,
      mixUpdatedFilesItemsWithOriginalOnes,
      updateFileBlobsNamesMiddleware,
      checkNameDuplicatesMiddleware,
      getRenamedObjects,
      AddEditedFieldsToFilteredFileArr,
    )
  }, [filesArr, sameKeywords, isMainPage, dispatch, updatingAction, selectedList])
}
