import { upload } from '../../../selectors'
import type { AppThunk } from '../../../store/types'
import { clearSelectedList, removeBlob, updateUploadingFilesArr } from '../uploadSlice'

export const removeFileFromUploadState = (): AppThunk => (dispatch, getState) => {
  const removeBlobPreview = () => (
    uploadingFiles.forEach(({ name }, idx) => selectedList.includes(idx) && dispatch(removeBlob(name)))
  )

  const { uploadingFiles, selectedList } = upload(getState())
  const filteredUploadingFiles = uploadingFiles.filter((_, idx) => !selectedList.includes(idx))

  removeBlobPreview()
  dispatch(updateUploadingFilesArr(filteredUploadingFiles))
  dispatch(clearSelectedList())
}
