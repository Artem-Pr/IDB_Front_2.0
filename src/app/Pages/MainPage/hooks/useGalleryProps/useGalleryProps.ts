import { useMemo } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import {
  addToDSelectedList,
  clearDSelectedList,
  removeFromDSelectedList,
} from '../../../../../redux/reducers/mainPageSlice-reducer'
import { dPageGalleryPropsSelector, main } from '../../../../../redux/selectors'
import { useUpdateFields } from '../../../../common/hooks'

export const useGalleryProps = () => {
  const dispatch = useDispatch()
  const mainGalleryProps = useSelector(dPageGalleryPropsSelector)
  const { imageArr } = mainGalleryProps
  const { updateUploadingFiles } = useUpdateFields(imageArr)
  const { isGalleryLoading } = useSelector(main)

  return useMemo(
    () => ({
      ...mainGalleryProps,
      removeFromSelectedList: (index: number) => dispatch(removeFromDSelectedList(index)),
      addToSelectedList: (index: number) => dispatch(addToDSelectedList(index)),
      clearSelectedList: () => dispatch(clearDSelectedList()),
      updateFiles: (tempPath: string) => updateUploadingFiles(tempPath),
      isLoading: isGalleryLoading,
      isMainPage: true,
    }),
    [dispatch, isGalleryLoading, mainGalleryProps, updateUploadingFiles]
  )
}
