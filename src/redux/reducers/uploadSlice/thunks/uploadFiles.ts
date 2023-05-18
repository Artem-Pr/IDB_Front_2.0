import type { UploadingObject } from '../../../types'
import type { AppThunk } from '../../../store/store'
import { mainApi } from '../../../../api/api'
import { errorMessage } from '../../../../app/common/notifications'
import { setUploadingStatus } from '../uploadSlice'

export const uploadFiles =
  (filesArr: UploadingObject[], folderPath: string): AppThunk =>
  dispatch => {
    dispatch(setUploadingStatus('loading'))
    mainApi
      .sendPhotos(filesArr, folderPath)
      .then(({ data: { success, error } }) => {
        success && dispatch(setUploadingStatus('success'))
        error && dispatch(setUploadingStatus('error')) && errorMessage(new Error(error), 'Upload files error', 0)
      })
      .catch(error => {
        dispatch(setUploadingStatus('error'))
        console.error('Error when getting Preview: ' + error)
      })
  }
