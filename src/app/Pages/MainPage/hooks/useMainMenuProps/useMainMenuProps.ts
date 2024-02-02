import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  clearDownloadingState,
  clearDSelectedList,
  selectAllD,
  setDownloadingFiles,
  updateDOpenMenus,
} from '../../../../../redux/reducers/mainPageSlice/mainPageSlice'
import {
  allDownloadingKeywordsSelector,
  curFolderInfo,
  dAllSameKeywordsSelector,
  dPageGalleryPropsSelector,
  main,
} from '../../../../../redux/selectors'
import { MainMenuKeys } from '../../../../../redux/types'
import { useCurrentPage } from '../../../../common/hooks'
import { removeIntersectingKeywords } from '../../../../common/utils'

export const useMainMenuProps = () => {
  const dispatch = useDispatch()
  const mainGalleryProps = useSelector(dPageGalleryPropsSelector)
  const { openMenus, selectedList, imageArr } = mainGalleryProps
  const { isExifLoading } = useSelector(main)
  const uniqKeywords = useSelector(allDownloadingKeywordsSelector)
  const sameKeywords = useSelector(dAllSameKeywordsSelector)
  const { currentFolderPath } = useSelector(curFolderInfo)
  const { isComparisonPage } = useCurrentPage()

  return useMemo(
    () => ({
      filesArr: imageArr,
      selectedList,
      isExifLoading,
      uniqKeywords,
      sameKeywords,
      openKeys: openMenus,
      currentFolderPath,
      isComparisonPage,
      clearSelectedList: () => dispatch(clearDSelectedList()),
      selectAll: () => dispatch(selectAllD()),
      updateOpenMenus: (value: MainMenuKeys[]) => dispatch(updateDOpenMenus(value)),
      removeKeyword: (keyword: string) => {
        const filesArrWithoutKeyword = removeIntersectingKeywords([keyword], imageArr)
        dispatch(setDownloadingFiles(filesArrWithoutKeyword))
      },
      removeFiles: () => dispatch(clearDownloadingState()),
    }),
    [
      currentFolderPath,
      dispatch,
      imageArr,
      isComparisonPage,
      isExifLoading,
      openMenus,
      sameKeywords,
      selectedList,
      uniqKeywords,
    ],
  )
}
