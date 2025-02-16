import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { PagePaths, MainMenuKeys } from 'src/common/constants'
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
import { currentFilesList, getIsCurrentPage } from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'

import { removeIntersectingKeywords } from '../utils'

export const useCurrentPage = () => {
  const { pathname } = useLocation()

  return pathname as PagePaths
}

export const useSelectAll = () => {
  const dispatch = useAppDispatch()
  const { isMainPage, isUploadPage } = useSelector(getIsCurrentPage)

  const selectAll = useCallback(() => {
    isMainPage && dispatch(selectAllDownload())
    isUploadPage && dispatch(selectAllUpload())
  }, [dispatch, isMainPage, isUploadPage])

  return { selectAll }
}

export const useClearSelectedList = () => {
  const dispatch = useAppDispatch()
  const { isMainPage, isUploadPage } = useSelector(getIsCurrentPage)

  const clearSelectedList = useCallback(() => {
    isMainPage && dispatch(clearSelectedListDownload())
    isUploadPage && dispatch(clearSelectedListUpload())
  }, [dispatch, isMainPage, isUploadPage])

  return { clearSelectedList }
}

export const useRemoveKeyword = () => {
  const dispatch = useAppDispatch()
  const filesArr = useSelector(currentFilesList)
  const { isMainPage, isUploadPage } = useSelector(getIsCurrentPage)

  const removeKeyword = useCallback(
    (keyword: string) => {
      const filesArrWithoutKeyword = removeIntersectingKeywords([keyword], filesArr)
      isMainPage && dispatch(setDownloadingFiles(filesArrWithoutKeyword))
      isUploadPage && dispatch(updateUploadingFilesArr(filesArrWithoutKeyword))
    },
    [dispatch, filesArr, isMainPage, isUploadPage],
  )

  return { removeKeyword }
}

export const useUpdateOpenMenus = () => {
  const dispatch = useAppDispatch()
  const { isMainPage, isUploadPage } = useSelector(getIsCurrentPage)

  const setOpenMenus = useCallback(
    (value: MainMenuKeys[]) => {
      isMainPage && dispatch(updateDOpenMenus(value))
      isUploadPage && dispatch(updateOpenMenus(value))
    },
    [dispatch, isMainPage, isUploadPage],
  )

  return { setOpenMenus }
}

export const useClearFilesArray = () => {
  const dispatch = useAppDispatch()
  const { isMainPage, isUploadPage } = useSelector(getIsCurrentPage)

  const clearFilesArr = useCallback(() => {
    isMainPage && dispatch(clearDownloadingState())
    isUploadPage && dispatch(clearUploadingState())
  }, [dispatch, isMainPage, isUploadPage])

  return { clearFilesArr }
}
