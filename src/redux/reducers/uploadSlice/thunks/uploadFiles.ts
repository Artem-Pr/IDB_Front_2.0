import { mainApi } from 'src/api/api'
import { createFolderTree } from 'src/app/common/folderTree'
import { errorMessage } from 'src/app/common/notifications'
import { getFileAPIRequestFromMediaList } from 'src/app/common/utils/getFileAPIRequestFromMedia'
import type { AppThunk } from 'src/redux/store/types'

import { uploadReducerSetUploadingStatus } from '..'
import { setFolderTree, setPathsArr } from '../../foldersSlice'
import { getFolderReducerFolderInfoCurrentFolder, getFolderReducerUpdatedPathsArrFromMediaList } from '../../foldersSlice/selectors'
import { getUploadReducerFilesArr } from '../selectors'

export const uploadFiles = (): AppThunk => (dispatch, getState) => {
  dispatch(uploadReducerSetUploadingStatus('loading'))

  const filesToUpload = getUploadReducerFilesArr(getState())
  const currentFolderPath = getFolderReducerFolderInfoCurrentFolder(getState())
  const UploadingObjects = getFileAPIRequestFromMediaList(filesToUpload, currentFolderPath)

  mainApi
    .savePhotosInDB(UploadingObjects)
    .then(({ data }) => {
      const updatedPathsArr = getFolderReducerUpdatedPathsArrFromMediaList(getState(), data)
      const updatedFolderTree = createFolderTree(updatedPathsArr)

      dispatch(setPathsArr(updatedPathsArr))
      dispatch(setFolderTree(updatedFolderTree))
      dispatch(uploadReducerSetUploadingStatus('success'))
    })
    .catch(error => {
      dispatch(uploadReducerSetUploadingStatus('error'))
      console.error(error)

      errorMessage(error, 'Upload files error')
    })
}
