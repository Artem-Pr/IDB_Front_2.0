import type { UploadingObject } from '../../../types'
import type { AppThunk } from '../../../store/store'
import { updateUploadingFilesArr } from '../uploadSlice'
import { upload } from '../../../selectors'
import { setIsLoading } from '../../sessionSlice-reducer'

export const updateUploadingFile =
  (uploadingFile: UploadingObject): AppThunk =>
  (dispatch, getState) => {
    const { uploadingFiles } = upload(getState())
    const updatedUploadingFiles = uploadingFiles.map(file => (file.name === uploadingFile.name ? uploadingFile : file))
    dispatch(updateUploadingFilesArr(updatedUploadingFiles))

    const isLastFile = updatedUploadingFiles.every(({ preview }) => Boolean(preview))
    isLastFile && dispatch(setIsLoading(false))
  }
