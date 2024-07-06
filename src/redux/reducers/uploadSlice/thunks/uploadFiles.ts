import { mainApi } from 'src/api/api'
import type { UpdatedFileAPIRequest } from 'src/api/dto/request-types'
import { errorMessage } from 'src/app/common/notifications'
import type { AppThunk } from 'src/redux/store/types'

import { setUploadingStatus } from '../uploadSlice'

export const uploadFiles = (UploadingObjects: UpdatedFileAPIRequest[]): AppThunk => dispatch => {
  dispatch(setUploadingStatus('loading'))
  mainApi
    .savePhotosInDB(UploadingObjects)
    .then(({ data: { success, error } }) => {
      success && dispatch(setUploadingStatus('success'))
      error && dispatch(setUploadingStatus('error')) && errorMessage(new Error(error), 'Upload files error', 0)
    })
    .catch(error => {
      dispatch(setUploadingStatus('error'))
      console.error(error)

      errorMessage(error, 'Upload files error')
    })
}
