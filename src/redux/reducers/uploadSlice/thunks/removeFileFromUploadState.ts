import type { AppThunk } from '../../../store/store'
import { clearSelectedList, updateUploadingFilesArr } from '../uploadSlice'

export const removeFileFromUploadState = (): AppThunk => (dispatch, getState) => {
  const { uploadingFiles, selectedList } = getState().uploadReducer
  const filteredUploadingFiles = uploadingFiles.filter((_, idx) => !selectedList.includes(idx))
  dispatch(updateUploadingFilesArr(filteredUploadingFiles))
  dispatch(clearSelectedList())
}
