import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import {
  mainPageReducerClearSelectedList,
  mainPageReducerResetSort as resetSortMainPage,
  mainPageReducerSetGallerySortingList as setGallerySortingListMainPage,
  mainPageReducerSetGroupedByDate as setGroupedByDateMainPage,
  mainPageReducerSetRandomSort as setRandomSortMainPage,
} from 'src/redux/reducers/mainPageSlice'
import { getSessionReducerIsCurrentPage } from 'src/redux/reducers/sessionSlice/selectors'
import {
  uploadReducerClearSelectedList,
  uploadReducerResetSort as resetSortUploadingPage,
  uploadReducerSetGallerySortingList as setGallerySortingListUploadingPage,
  uploadReducerSetGroupedByDate as setGroupedByDateUploadingPage,
} from 'src/redux/reducers/uploadSlice'
import { getSort } from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'
import type { GallerySortingItem } from 'src/redux/types'

export const useSortingMenu = () => {
  const dispatch = useAppDispatch()
  const { isMainPage, isUploadPage } = useSelector(getSessionReducerIsCurrentPage)
  const { gallerySortingList, groupedByDate, randomSort } = useSelector(getSort)

  const setSortingList = useCallback(
    (updatedList: GallerySortingItem[]) => {
      isMainPage && dispatch(setGallerySortingListMainPage(updatedList))
      isUploadPage && dispatch(setGallerySortingListUploadingPage(updatedList))
    },
    [dispatch, isMainPage, isUploadPage],
  )

  const resetSort = useCallback(() => {
    isMainPage && dispatch(resetSortMainPage())
    isUploadPage && dispatch(resetSortUploadingPage())
  }, [dispatch, isMainPage, isUploadPage])

  const setRandomSort = useCallback(
    (isRandomSort: boolean) => {
      dispatch(setRandomSortMainPage(isRandomSort))
    },
    [dispatch],
  )

  const setGroupedByDate = useCallback(
    (isGroupedByDate: boolean) => {
      if (isMainPage) {
        dispatch(setGroupedByDateMainPage(isGroupedByDate))
        dispatch(mainPageReducerClearSelectedList())
      }
      if (isUploadPage) {
        dispatch(setGroupedByDateUploadingPage(isGroupedByDate))
        dispatch(uploadReducerClearSelectedList())
      }
    },
    [dispatch, isMainPage, isUploadPage],
  )

  return {
    gallerySortingList, groupedByDate, randomSort, setSortingList, resetSort, setRandomSort, setGroupedByDate,
  }
}
