import { upload } from 'src/redux/selectors'
import type { AppThunk } from 'src/redux/store/types'

import { clearSelectedList, removeBlob, updateUploadingFilesArr } from '../uploadSlice'

export const removeFilesFromUploadState = (): AppThunk => (dispatch, getState) => {
  const removeBlobPreview = () => (
    uploadingFiles.forEach(({ originalName }, idx) => selectedList.includes(idx) && dispatch(removeBlob(originalName)))
  )

  const { uploadingFiles, selectedList } = upload(getState())
  const filteredUploadingFiles = uploadingFiles.filter((_, idx) => !selectedList.includes(idx))

  removeBlobPreview()
  dispatch(updateUploadingFilesArr(filteredUploadingFiles))
  dispatch(clearSelectedList())
}
