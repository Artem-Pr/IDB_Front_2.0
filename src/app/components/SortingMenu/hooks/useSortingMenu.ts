import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import {
  resetSort as resetSortMainPage,
  setGallerySortingList as setGallerySortingListMainPage,
  setGroupedByDate as setGroupedByDateMainPage,
  setRandomSort as setRandomSortMainPage,
} from 'src/redux/reducers/mainPageSlice/mainPageSlice'
import {
  resetSort as resetSortUploadingPage,
  setGallerySortingList as setGallerySortingListUploadingPage,
  setGroupedByDate as setGroupedByDateUploadingPage,
} from 'src/redux/reducers/uploadSlice/uploadSlice'
import { getIsCurrentPage, sort } from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'
import type { GallerySortingItem } from 'src/redux/types'

export const useSortingMenu = () => {
  const dispatch = useAppDispatch()
  const { isMainPage, isUploadPage } = useSelector(getIsCurrentPage)
  const { gallerySortingList, groupedByDate, randomSort } = useSelector(sort)

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
      isMainPage && dispatch(setGroupedByDateMainPage(isGroupedByDate))
      isUploadPage && dispatch(setGroupedByDateUploadingPage(isGroupedByDate))
    },
    [dispatch, isMainPage, isUploadPage],
  )

  return {
    gallerySortingList, groupedByDate, randomSort, setSortingList, resetSort, setRandomSort, setGroupedByDate,
  }
}
