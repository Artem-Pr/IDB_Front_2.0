import { useMemo } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import {
  clearDownloadingState,
  clearDSelectedList,
  selectAllD,
  setDownloadingFiles,
  updateDOpenMenus,
} from '../../../../../redux/reducers/mainPageSlice-reducer'
import { removeIntersectingKeywords } from '../../../../common/utils'
import {
  allDownloadingKeywordsSelector,
  curFolderInfo,
  dAllSameKeywordsSelector,
  dPageGalleryPropsSelector,
  main,
} from '../../../../../redux/selectors'

export const useMainMenuProps = () => {
  const dispatch = useDispatch()
  const mainGalleryProps = useSelector(dPageGalleryPropsSelector)
  const { openMenus, selectedList, imageArr } = mainGalleryProps
  const { isExifLoading } = useSelector(main)
  const uniqKeywords = useSelector(allDownloadingKeywordsSelector)
  const sameKeywords = useSelector(dAllSameKeywordsSelector)
  const { currentFolderPath } = useSelector(curFolderInfo)

  const query = new URLSearchParams(location.search)
  const isComparisonPage = Boolean(query.get('comparison'))

  return useMemo(
    () => ({
      filesArr: imageArr,
      selectedList: selectedList,
      isExifLoading,
      uniqKeywords,
      sameKeywords,
      openKeys: openMenus,
      currentFolderPath,
      isComparisonPage,
      clearSelectedList: () => dispatch(clearDSelectedList()),
      selectAll: () => dispatch(selectAllD()),
      updateOpenMenus: (value: string[]) => dispatch(updateDOpenMenus(value)),
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
    ]
  )
}
