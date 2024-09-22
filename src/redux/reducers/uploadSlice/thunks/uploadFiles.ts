import { mainApi } from 'src/api/api'
import { errorMessage } from 'src/app/common/notifications'
import { getFileAPIRequestFromMediaList } from 'src/app/common/utils/getFileAPIRequestFromMedia'
import { curFolderInfo, uploadingFiles } from 'src/redux/selectors'
import type { AppThunk } from 'src/redux/store/types'

import { setUploadingStatus } from '../uploadSlice'

export const uploadFiles = (): AppThunk => (dispatch, getState) => {
  dispatch(setUploadingStatus('loading'))

  const filesToUpload = uploadingFiles(getState())
  const { currentFolderPath } = curFolderInfo(getState())

  const UploadingObjects = getFileAPIRequestFromMediaList(filesToUpload, currentFolderPath)

  mainApi
    .savePhotosInDB(UploadingObjects)
    .then(() => {
      dispatch(setUploadingStatus('success'))
    })
    .catch(error => {
      dispatch(setUploadingStatus('error'))
      console.error(error)

      errorMessage(error, 'Upload files error')
    })
}
