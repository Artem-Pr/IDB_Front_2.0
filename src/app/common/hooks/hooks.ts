import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import {
  compose, curry, isEmpty, omit,
} from 'ramda'

import type { Media } from 'src/api/models/media'
import {
  clearDownloadingState,
  clearDSelectedList as clearSelectedListDownload,
  selectAllD as selectAllDownload,
  setDownloadingFiles,
  updateDOpenMenus,
} from 'src/redux/reducers/mainPageSlice/mainPageSlice'
import {
  clearSelectedList as clearSelectedListUpload,
  clearUploadingState,
  selectAll as selectAllUpload,
  updateOpenMenus,
  updateUploadingFilesArr,
} from 'src/redux/reducers/uploadSlice'
import { fetchDuplicates } from 'src/redux/reducers/uploadSlice/thunks/fetchDuplicates'
import { updateBlobName } from 'src/redux/reducers/uploadSlice/uploadSlice'
import {
  allSameKeywords,
  currentFilesList,
  currentSelectedList,
  openMenusSelector,
  selectedDateList,
  selectedFilesList,
  uniqKeywords,
} from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'
import type { RootState } from 'src/redux/store/types'
import { PagePaths } from 'src/redux/types'
import type { BlobUpdateNamePayload, MainMenuKeys } from 'src/redux/types'

import {
  addKeywordsToAllFiles,
  getRenamedObjects,
  removeIntersectingKeywords,
  updateFilesArrayItems,
} from '../utils'

const isEditNameOperation = (blobNameData: BlobUpdateNamePayload | false): blobNameData is BlobUpdateNamePayload => (
  blobNameData !== false && blobNameData.oldName !== blobNameData.newName
)

const prepareBlobUpdateNamePayload = (newFilesArr: Media[]) => (
  ({ originalName, id }: Media): BlobUpdateNamePayload | false => {
    const updatedName = newFilesArr.find(newItem => newItem.id === id)?.originalName

    return updatedName
      ? {
        oldName: originalName,
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

export const useRemoveKeyword = () => {
  const dispatch = useAppDispatch()
  const { filesArr } = useFilesList()
  const { isMainPage, isUploadingPage } = useCurrentPage()

  const removeKeyword = useCallback(
    (keyword: string) => {
      const filesArrWithoutKeyword = removeIntersectingKeywords([keyword], filesArr)
      isMainPage && dispatch(setDownloadingFiles(filesArrWithoutKeyword))
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

const addEditedFieldsToFileArr = (
  filesArr: Media[],
  editedFields: Partial<Media>,
): Media[] => {
  const keywords: string[] = editedFields?.keywords || []
  const updatedFileArr = isEmpty(keywords) ? filesArr : addKeywordsToAllFiles(keywords, filesArr)
  return updatedFileArr.map(item => ({ ...item, ...omit(['keywords'], editedFields) }))
}

interface UseEditFilesArrProps {
  filesArr: Media[]
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

  const editUploadingFiles = useMemo(() => {
    const selectedFilesArr = filesArr.filter((_, idx) => selectedList.includes(idx))
    const selectedFilesWithoutSameKeywords = removeIntersectingKeywords(sameKeywords, selectedFilesArr)
    const AddEditedFieldsToFilteredFileArr: (editedFields: Partial<Media>) => Media[] = curry(
      addEditedFieldsToFileArr,
    )(selectedFilesWithoutSameKeywords)
    const mixUpdatedFilesItemsWithOriginalOnes = curry(updateFilesArrayItems)('id', filesArr)
    const updateFileBlobsNamesMiddleware = (newFilesArr: Media[]) => {
      filesArr
        .map(prepareBlobUpdateNamePayload(newFilesArr))
        .filter(isEditNameOperation)
        .forEach(compose(dispatch, updateBlobName))
      return newFilesArr
    }
    const checkNameDuplicatesMiddleware = (newFilesArr: Media[]) => {
      dispatch(fetchDuplicates(newFilesArr.map(({ originalName }) => originalName)))
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
  }, [filesArr, sameKeywords, dispatch, updatingAction, selectedList])

  return { editUploadingFiles }
}
