import { useCallback } from 'react'

import {
  resetSort as resetSortMainPage,
  setGallerySortingList as setGallerySortingListMainPage,
  setGroupedByDate as setGroupedByDateMainPage,
  setRandomSort as setRandomSortMainPage,
} from '../../../../redux/reducers/mainPageSlice/mainPageSlice'
import {
  resetSort as resetSortUploadingPage,
  setGallerySortingList as setGallerySortingListUploadingPage,
  setGroupedByDate as setGroupedByDateUploadingPage,
} from '../../../../redux/reducers/uploadSlice/uploadSlice'
import { useAppDispatch } from '../../../../redux/store/store'
import type { GallerySortingItem } from '../../../../redux/types'
import { useCurrentPage } from '../../../common/hooks'
import { useSort } from '../../../common/hooks/useSort'

export const useSortingMenu = () => {
  const dispatch = useAppDispatch()
  const { isMainPage, isUploadingPage } = useCurrentPage()
  const { gallerySortingList, groupedByDate, randomSort } = useSort()

  const setSortingList = useCallback(
    (updatedList: GallerySortingItem[]) => {
      isMainPage && dispatch(setGallerySortingListMainPage(updatedList))
      isUploadingPage && dispatch(setGallerySortingListUploadingPage(updatedList))
    },
    [dispatch, isMainPage, isUploadingPage],
  )

  const resetSort = useCallback(() => {
    isMainPage && dispatch(resetSortMainPage())
    isUploadingPage && dispatch(resetSortUploadingPage())
  }, [dispatch, isMainPage, isUploadingPage])

  const setRandomSort = useCallback(
    (isRandomSort: boolean) => {
      dispatch(setRandomSortMainPage(isRandomSort))
    },
    [dispatch],
  )

  const setGroupedByDate = useCallback(
    (isGroupedByDate: boolean) => {
      isMainPage && dispatch(setGroupedByDateMainPage(isGroupedByDate))
      isUploadingPage && dispatch(setGroupedByDateUploadingPage(isGroupedByDate))
    },
    [dispatch, isMainPage, isUploadingPage],
  )

  return {
    gallerySortingList, groupedByDate, randomSort, setSortingList, resetSort, setRandomSort, setGroupedByDate,
  }
}
