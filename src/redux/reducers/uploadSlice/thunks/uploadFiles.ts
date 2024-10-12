import { mainApi } from 'src/api/api'
import type { Media } from 'src/api/models/media'
import { addNewPathToPathsArr, createFolderTree } from 'src/app/common/folderTree'
import { errorMessage } from 'src/app/common/notifications'
import { getFilePathWithoutName } from 'src/app/common/utils'
import { getFileAPIRequestFromMediaList } from 'src/app/common/utils/getFileAPIRequestFromMedia'
import {
  folderInfoCurrentFolder, pathsArr, uploadingFiles,
} from 'src/redux/selectors'
import type { AppThunk } from 'src/redux/store/types'

import { setFolderTree, setPathsArr } from '../../foldersSlice'
import { setUploadingStatus } from '../uploadSlice'

export const uploadFiles = (): AppThunk => (dispatch, getState) => {
  const getUpdatedPathsArr = (mediaList: Media[]) => {
    const pathsBeforeUploading = pathsArr(getState())
    return mediaList
      .filter((media): media is Media & { filePath: string } => Boolean(media.filePath))
      .map(({ filePath }) => getFilePathWithoutName(filePath))
      .reduce<string[]>((accum, currentPath) => addNewPathToPathsArr(accum, currentPath), pathsBeforeUploading)
  }

  dispatch(setUploadingStatus('loading'))

  const filesToUpload = uploadingFiles(getState())
  const currentFolderPath = folderInfoCurrentFolder(getState())
  const UploadingObjects = getFileAPIRequestFromMediaList(filesToUpload, currentFolderPath)

  mainApi
    .savePhotosInDB(UploadingObjects)
    .then(({ data }) => {
      const updatedPathsArr = getUpdatedPathsArr(data)
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
