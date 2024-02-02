import { upload } from '../../../selectors'
import type { AppThunk } from '../../../store/types'
import type { UploadingObject } from '../../../types'
import { setIsLoading } from '../../sessionSlice/sessionSlice'
import { updateUploadingFilesArr } from '../uploadSlice'

export const updateUploadingFile = (uploadingFile: UploadingObject): AppThunk => (dispatch, getState) => {
  const { uploadingFiles } = upload(getState())
  const updatedUploadingFiles = uploadingFiles.map(file => (file.name === uploadingFile.name ? uploadingFile : file))
  dispatch(updateUploadingFilesArr(updatedUploadingFiles))

  const isLastFile = updatedUploadingFiles.every(({ preview }) => Boolean(preview))
  isLastFile && dispatch(setIsLoading(false))
}
