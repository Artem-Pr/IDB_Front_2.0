import { mainApi } from 'src/api/api'
import { errorMessage, successMessage } from 'src/app/common/notifications'
import { main } from 'src/redux/selectors'
import type { AppThunk } from 'src/redux/store/types'

import { setIsDeleteProcessing } from '../mainPageSlice'

import { fetchPhotos } from './fetchPhotos'

export const removeSelectedFiles = (): AppThunk => (dispatch, getState) => {
  const { dSelectedList, downloadingFiles } = main(getState())
  const fileIdsList = dSelectedList.map(index => downloadingFiles[index].id)
  setIsDeleteProcessing(true)
  mainApi
    .deleteFiles(fileIdsList)
    .then(() => {
      successMessage('File deleted successfully')
      dispatch(fetchPhotos())
    })
    .catch(error => {
      console.error('error', error)
      errorMessage(error, 'Deleting file error: ', 0)
    })
    .finally(() => setIsDeleteProcessing(false))
}
