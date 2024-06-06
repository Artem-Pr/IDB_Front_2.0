import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  addToDSelectedList,
  clearDSelectedList,
  removeFromDSelectedList,
} from 'src/redux/reducers/mainPageSlice/mainPageSlice'
import { dPageGalleryPropsSelector, main } from 'src/redux/selectors'

export const useGalleryProps = () => {
  const dispatch = useDispatch()
  const mainGalleryProps = useSelector(dPageGalleryPropsSelector)
  const { isGalleryLoading } = useSelector(main)

  return useMemo(
    () => ({
      ...mainGalleryProps,
      removeFromSelectedList: (indexArr: number[]) => dispatch(removeFromDSelectedList(indexArr)),
      addToSelectedList: (indexArr: number[]) => dispatch(addToDSelectedList(indexArr)),
      clearSelectedList: () => dispatch(clearDSelectedList()),
      isLoading: isGalleryLoading,
      isMainPage: true,
    }),
    [dispatch, isGalleryLoading, mainGalleryProps],
  )
}
