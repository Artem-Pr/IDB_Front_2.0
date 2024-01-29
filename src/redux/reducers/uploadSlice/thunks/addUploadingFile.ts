import type { UploadingObject } from '../../../types'
import type { AppThunk } from '../../../store/store'
import { sortByFieldDescending } from '../../../../app/common/utils'
import { updateUploadingFilesArr } from '../uploadSlice'
import { upload } from '../../../selectors'

export const addUploadingFile =
  (uploadingFile: UploadingObject): AppThunk =>
  (dispatch, getState) => {
    const { uploadingFiles } = upload(getState())
    const updatedUploadingFiles = sortByFieldDescending<UploadingObject>('name')([...uploadingFiles, uploadingFile])
    dispatch(updateUploadingFilesArr(updatedUploadingFiles))
  }
