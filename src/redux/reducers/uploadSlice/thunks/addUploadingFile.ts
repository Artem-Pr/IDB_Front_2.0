import type { UploadingObject } from '../../../types'
import type { AppThunk } from '../../../store/store'
import { sortByField } from '../../../../app/common/utils/utils'
import { updateUploadingFilesArr } from '../uploadSlice'

export const addUploadingFile =
  (uploadingFile: UploadingObject): AppThunk =>
  (dispatch, getState) => {
    const { uploadingFiles } = getState().uploadReducer
    const updatedUploadingFiles = sortByField<UploadingObject>('name')([...uploadingFiles, uploadingFile])
    dispatch(updateUploadingFilesArr(updatedUploadingFiles))
  }
