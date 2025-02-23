import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  mainPageReducerAddToSelectedList,
  mainPageReducerClearSelectedList,
  mainPageReducerRemoveFromSelectedList,
} from 'src/redux/reducers/mainPageSlice'
import {
  getMainPageReducerFilesArr,
  getMainPageReducerSelectedList,
  getMainPageReducerIsGalleryLoading,
  getMainPageReducerOpenMenus,
} from 'src/redux/reducers/mainPageSlice/selectors'

export const useGalleryProps = () => {
  const dispatch = useDispatch()
  const imageArr = useSelector(getMainPageReducerFilesArr)
  const openMenus = useSelector(getMainPageReducerOpenMenus)
  const selectedList = useSelector(getMainPageReducerSelectedList)
  const isGalleryLoading = useSelector(getMainPageReducerIsGalleryLoading)

  return useMemo(
    () => ({
      imageArr,
      openMenus,
      selectedList,
      removeFromSelectedList: (indexArr: number[]) => dispatch(mainPageReducerRemoveFromSelectedList(indexArr)),
      addToSelectedList: (indexArr: number[]) => dispatch(mainPageReducerAddToSelectedList(indexArr)),
      clearSelectedList: () => dispatch(mainPageReducerClearSelectedList()),
      isLoading: isGalleryLoading,
      isMainPage: true,
    }),
    [dispatch, isGalleryLoading, imageArr, openMenus, selectedList],
  )
}
