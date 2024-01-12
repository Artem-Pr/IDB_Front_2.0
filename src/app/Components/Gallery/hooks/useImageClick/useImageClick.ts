import { useCallback } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { RawPreview } from '../../type'
import { getLastItem } from '../../../../common/utils'
import { cleanPreview, setPreview } from '../../../../../redux/reducers/mainPageSlice/mainPageSlice'
import { uploadingBlobs } from '../../../../../redux/selectors'
import { Preview } from '../../../../../redux/types'

interface UseImageClickProps {
  addToSelectedList: (indexArr: number[]) => void
  clearSelectedList: () => void
  hoveredIndex: number | null
  isEditMenu: boolean
  isPropertiesMenu: boolean
  isShiftPressed: boolean
  isTemplateMenu: boolean
  removeFromSelectedList: (index: number[]) => void
  selectWithShift: (lastSelectedElemIndex: number) => void
  selectedList: number[]
}

export const useImageClick = ({
  addToSelectedList,
  clearSelectedList,
  hoveredIndex,
  isEditMenu,
  isPropertiesMenu,
  isShiftPressed,
  isTemplateMenu,
  removeFromSelectedList,
  selectWithShift,
  selectedList,
}: UseImageClickProps) => {
  const dispatch = useDispatch()
  const blobFiles = useSelector(uploadingBlobs)

  const updatePreview = useCallback(
    (newPreview: Preview) => {
      dispatch(cleanPreview())
      setTimeout(() => {
        dispatch(setPreview(newPreview))
      })
    },
    [dispatch]
  )

  const handleImageClick = useCallback(
    (i: number, rawPreview?: RawPreview) => {
      const updateFilesArr = () => {
        addToSelectedList([i])
      }
      const selectOnlyOne = () => {
        clearSelectedList()
        updateFilesArr()
      }
      const selectAnyQuantity = () => {
        selectedList.includes(i) ? removeFromSelectedList([i]) : updateFilesArr()
      }

      const lastSelectedElemIndex = getLastItem(selectedList)

      isShiftPressed && !isEditMenu && (lastSelectedElemIndex || hoveredIndex) && selectWithShift(lastSelectedElemIndex)
      !isShiftPressed && isPropertiesMenu && !isEditMenu && !isTemplateMenu && selectOnlyOne()
      !isShiftPressed && isEditMenu && selectOnlyOne()
      !isShiftPressed && isTemplateMenu && selectAnyQuantity()

      rawPreview &&
        updatePreview({
          previewType: rawPreview.type,
          originalName: rawPreview.name,
          originalPath: rawPreview.fullSizeJpgStatic || rawPreview.originalPath || blobFiles[rawPreview.name],
          preview: rawPreview.preview,
        })
    },
    [
      addToSelectedList,
      blobFiles,
      clearSelectedList,
      hoveredIndex,
      isEditMenu,
      isPropertiesMenu,
      isShiftPressed,
      isTemplateMenu,
      removeFromSelectedList,
      selectWithShift,
      selectedList,
      updatePreview,
    ]
  )

  return { handleImageClick }
}
