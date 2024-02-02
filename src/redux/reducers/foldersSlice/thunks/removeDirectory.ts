import { mainApi } from 'src/api/api'
import { createFolderTree } from 'src/app/common/folderTree'
import { errorMessage, successMessage } from 'src/app/common/notifications'
import { curFolderInfo } from 'src/redux/selectors'
import type { AppThunk } from 'src/redux/store/types'

import { fetchPhotos } from '../../mainPageSlice/thunks'
import { setFolderTree, setPathsArr } from '../foldersSlice'

export const removeDirectory = (): AppThunk => (dispatch, getState) => {
  const { currentFolderPath } = curFolderInfo(getState())
  const updateContent = (filePaths: string[]) => {
    dispatch(setFolderTree(createFolderTree(filePaths)))
    dispatch(setPathsArr(filePaths))
    dispatch(fetchPhotos())
    successMessage('Folder was deleted successfully!')
  }
  mainApi
    .deleteDirectory(currentFolderPath)
    .then(({ data }) => {
      data.error && errorMessage(new Error(data.error), 'Directory deleting ERROR: ', 0)
      data.success && updateContent(data.filePaths)
    })
    .catch(error => errorMessage(new Error(error), 'Directory deleting ERROR: ', 0))
}
