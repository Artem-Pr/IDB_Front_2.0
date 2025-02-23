import { mainApi } from 'src/api/api'
import { errorMessage, successMessage } from 'src/app/common/notifications'
import type { AppThunk } from 'src/redux/store/types'

import { mainPageReducerSetIsDeleteProcessing } from '..'
import { getMainPageReducerSelectedList, getMainPageReducerFilesArr } from '../selectors'

import { fetchPhotos } from './fetchPhotos'

export const removeSelectedFiles = (): AppThunk => (dispatch, getState) => {
  const dSelectedList = getMainPageReducerSelectedList(getState())
  const downloadingFiles = getMainPageReducerFilesArr(getState())
  const fileIdsList = dSelectedList.map(index => downloadingFiles[index].id)
  mainPageReducerSetIsDeleteProcessing(true)
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
    .finally(() => mainPageReducerSetIsDeleteProcessing(false))
}
