import type { AppThunk } from 'src/redux/store/types'

import { uploadReducerClearSelectedList, uploadReducerRemoveBlob, uploadReducerSetFilesArr } from '..'
import { getUploadReducerFilesArr, getUploadReducerSelectedList } from '../selectors'

export const removeFilesFromUploadState = (): AppThunk => (dispatch, getState) => {
  const removeBlobPreview = () => (
    uploadingFiles.forEach(({ originalName }, idx) => (
      selectedList.includes(idx) && dispatch(uploadReducerRemoveBlob(originalName))))
  )

  const selectedList = getUploadReducerSelectedList(getState())
  const uploadingFiles = getUploadReducerFilesArr(getState())
  const filteredUploadingFiles = uploadingFiles.filter((_, idx) => !selectedList.includes(idx))

  removeBlobPreview()
  dispatch(uploadReducerSetFilesArr(filteredUploadingFiles))
  dispatch(uploadReducerClearSelectedList())
}
