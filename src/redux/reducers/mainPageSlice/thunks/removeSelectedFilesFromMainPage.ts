import { mainApi } from 'src/api/api'
import { errorMessage, successMessage } from 'src/app/common/notifications'
import { getCurrentFilesArr } from 'src/redux/selectors'
import type { AppThunk } from 'src/redux/store/types'

import { mainPageReducerSetIsDeleteProcessing } from '..'
import { getMainPageReducerSelectedList } from '../selectors'

import { fetchPhotos } from './fetchPhotos'

export const removeSelectedFilesFromMainPage = (): AppThunk => (dispatch, getState) => {
  const mainPageSelectedList = getMainPageReducerSelectedList(getState())
  const downloadingFiles = getCurrentFilesArr(getState())
  const fileIdsList = mainPageSelectedList.map(index => downloadingFiles[index].id)
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
