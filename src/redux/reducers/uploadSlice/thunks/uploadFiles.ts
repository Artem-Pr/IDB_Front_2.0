import { mainApi } from 'src/api/api'
import { createFolderTree } from 'src/app/common/folderTree'
import { errorMessage } from 'src/app/common/notifications'
import { getFileAPIRequestFromMediaList } from 'src/app/common/utils/getFileAPIRequestFromMedia'
import {
  folderInfoCurrentFolder, updatedPathsArrFromMediaList, uploadingFiles,
} from 'src/redux/selectors'
import type { AppThunk } from 'src/redux/store/types'

import { setFolderTree, setPathsArr } from '../../foldersSlice'
import { setUploadingStatus } from '../uploadSlice'

export const uploadFiles = (): AppThunk => (dispatch, getState) => {
  dispatch(setUploadingStatus('loading'))

  const filesToUpload = uploadingFiles(getState())
  const currentFolderPath = folderInfoCurrentFolder(getState())
  const UploadingObjects = getFileAPIRequestFromMediaList(filesToUpload, currentFolderPath)

  mainApi
    .savePhotosInDB(UploadingObjects)
    .then(({ data }) => {
      const updatedPathsArr = updatedPathsArrFromMediaList(getState(), data)
      const updatedFolderTree = createFolderTree(updatedPathsArr)

      dispatch(setPathsArr(updatedPathsArr))
      dispatch(setFolderTree(updatedFolderTree))
      dispatch(setUploadingStatus('success'))
    })
    .catch(error => {
      dispatch(setUploadingStatus('error'))
      console.error(error)

      errorMessage(error, 'Upload files error')
    })
}
