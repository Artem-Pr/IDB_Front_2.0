import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { PagePaths, MainMenuKeys } from 'src/common/constants'
import {
  mainPageReducerClearState,
  mainPageReducerClearSelectedList,
  mainPageReducerSelectAll,
  mainPageReducerSetFilesArr,
  mainPageReducerSetOpenMenus,
} from 'src/redux/reducers/mainPageSlice'
import { getSessionReducerIsCurrentPage } from 'src/redux/reducers/sessionSlice/selectors'
import {
  uploadReducerClearSelectedList,
  uploadReducerClearState,
  uploadReducerSelectAll,
  uploadReducerSetOpenMenus,
  uploadReducerSetFilesArr,
} from 'src/redux/reducers/uploadSlice'
import { getCurrentFilesArr } from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'

import { removeIntersectingKeywords } from '../utils'

export const useCurrentPage = () => {
  const { pathname } = useLocation()

  return pathname as PagePaths
}

export const useSelectAll = () => {
  const dispatch = useAppDispatch()
  const { isMainPage, isUploadPage } = useSelector(getSessionReducerIsCurrentPage)

  const selectAll = useCallback(() => {
    isMainPage && dispatch(mainPageReducerSelectAll())
    isUploadPage && dispatch(uploadReducerSelectAll())
  }, [dispatch, isMainPage, isUploadPage])

  return { selectAll }
}

export const useClearSelectedList = () => {
  const dispatch = useAppDispatch()
  const { isMainPage, isUploadPage } = useSelector(getSessionReducerIsCurrentPage)

  const clearSelectedList = useCallback(() => {
    isMainPage && dispatch(mainPageReducerClearSelectedList())
    isUploadPage && dispatch(uploadReducerClearSelectedList())
  }, [dispatch, isMainPage, isUploadPage])

  return { clearSelectedList }
}

export const useRemoveKeyword = () => {
  const dispatch = useAppDispatch()
  const filesArr = useSelector(getCurrentFilesArr)
  const { isMainPage, isUploadPage } = useSelector(getSessionReducerIsCurrentPage)

  const removeKeyword = useCallback(
    (keyword: string) => {
      const filesArrWithoutKeyword = removeIntersectingKeywords([keyword], filesArr)
      isMainPage && dispatch(mainPageReducerSetFilesArr(filesArrWithoutKeyword))
      isUploadPage && dispatch(uploadReducerSetFilesArr(filesArrWithoutKeyword))
    },
    [dispatch, filesArr, isMainPage, isUploadPage],
  )

  return { removeKeyword }
}

export const useUpdateOpenMenus = () => {
  const dispatch = useAppDispatch()
  const { isMainPage, isUploadPage } = useSelector(getSessionReducerIsCurrentPage)

  const setOpenMenus = useCallback(
    (value: MainMenuKeys[]) => {
      isMainPage && dispatch(mainPageReducerSetOpenMenus(value))
      isUploadPage && dispatch(uploadReducerSetOpenMenus(value))
    },
    [dispatch, isMainPage, isUploadPage],
  )

  return { setOpenMenus }
}

export const useClearFilesArray = () => {
  const dispatch = useAppDispatch()
  const { isMainPage, isUploadPage } = useSelector(getSessionReducerIsCurrentPage)

  const clearFilesArr = useCallback(() => {
    isMainPage && dispatch(mainPageReducerClearState())
    isUploadPage && dispatch(uploadReducerClearState())
  }, [dispatch, isMainPage, isUploadPage])

  return { clearFilesArr }
}
