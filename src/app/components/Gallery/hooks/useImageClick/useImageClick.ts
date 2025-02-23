import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import type { Media } from 'src/api/models/media'
import { getLastItem } from 'src/app/common/utils'
import { mainPageReducerClearPreview, mainPageReducerSetPreview } from 'src/redux/reducers/mainPageSlice'
import { getUploadReducerBlobs } from 'src/redux/reducers/uploadSlice/selectors'
import type { Preview } from 'src/redux/types'

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
  const blobFiles = useSelector(getUploadReducerBlobs)

  const updatePreview = useCallback(
    (newPreview: Preview) => {
      dispatch(mainPageReducerClearPreview())
      setTimeout(() => {
        dispatch(mainPageReducerSetPreview(newPreview))
      })
    },
    [dispatch],
  )

  const handleImageClick = useCallback(
    (i: number, rawPreview?: Media) => {
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

      rawPreview
        && updatePreview({
          previewType: rawPreview.mimetype,
          originalName: rawPreview.originalName,
          staticPath: rawPreview.staticPath || blobFiles[rawPreview.originalName],
          staticPreview: rawPreview.staticPreview,
          staticVideoFullSize: rawPreview.staticVideoFullSize,
          exif: rawPreview.exif,
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
    ],
  )

  return { handleImageClick }
}
