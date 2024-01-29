import { AppThunk } from '../../../store/store'
import { mainApi } from '../../../../api/api'
import { errorMessage, successMessage } from '../../../../app/common/notifications'
import { setIsDeleteProcessing } from '../mainPageSlice'
import { fetchPhotos } from './fetchPhotos'
import { main } from '../../../selectors'

export const removeCurrentPhoto = (): AppThunk => (dispatch, getState) => {
  const { dSelectedList, downloadingFiles } = main(getState())
  const currentPhotoId = downloadingFiles[dSelectedList[0]]._id
  setIsDeleteProcessing(true)
  mainApi
    .deletePhoto(currentPhotoId)
    .then(({ data: { success, error } }) => {
      success && successMessage('File deleted successfully')
      success && dispatch(fetchPhotos())
      error && errorMessage(new Error(error), 'Deleting file error: ', 0)
    })
    .catch(error => {
      console.log('error', error)
      errorMessage(error.message, 'Deleting file error: ', 0)
    })
    .finally(() => setIsDeleteProcessing(false))
}
