import { getCurrentFilesArr } from 'src/redux/selectors'
import type { AppThunk } from 'src/redux/store/types'

import { uploadReducerClearSelectedList, uploadReducerRemoveBlob, uploadReducerSetFilesArr } from '..'
import { getUploadReducerSelectedList } from '../selectors'

export const removeSelectedFilesFromUploadState = (): AppThunk => (dispatch, getState) => {
  const removeBlobPreview = () => (
    uploadingFiles.forEach(({ originalName }, idx) => (
      selectedList.includes(idx) && dispatch(uploadReducerRemoveBlob(originalName))))
  )

  const selectedList = getUploadReducerSelectedList(getState())
  const uploadingFiles = getCurrentFilesArr(getState())
  const filteredUploadingFiles = uploadingFiles.filter((_, idx) => !selectedList.includes(idx))

  removeBlobPreview()
  dispatch(uploadReducerSetFilesArr(filteredUploadingFiles))
  dispatch(uploadReducerClearSelectedList())
}
