import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

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
import type { MainMenuKeys } from 'src/redux/types'

import { removeIntersectingKeywords } from '../utils'

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
