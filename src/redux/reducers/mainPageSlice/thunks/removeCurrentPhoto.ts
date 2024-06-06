import { mainApi } from 'src/api/api'
import { errorMessage, successMessage } from 'src/app/common/notifications'
import { main } from 'src/redux/selectors'
import type { AppThunk } from 'src/redux/store/types'

import { setIsDeleteProcessing } from '../mainPageSlice'

import { fetchPhotos } from './fetchPhotos'

export const removeCurrentPhoto = (): AppThunk => (dispatch, getState) => {
  const { dSelectedList, downloadingFiles } = main(getState())
  const currentPhotoId = downloadingFiles[dSelectedList[0]].id
  setIsDeleteProcessing(true)
  mainApi
    .deletePhoto(currentPhotoId)
    .then(({ data: { success, error } }) => {
      success && successMessage('File deleted successfully')
      success && dispatch(fetchPhotos())
      error && errorMessage(new Error(error), 'Deleting file error: ', 0)
    })
    .catch(error => {
      console.error('error', error)
      errorMessage(error.message, 'Deleting file error: ', 0)
    })
    .finally(() => setIsDeleteProcessing(false))
}
