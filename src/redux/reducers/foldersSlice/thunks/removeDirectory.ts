import { difference } from 'ramda'

import { mainApi } from 'src/api/api'
import { createFolderTree } from 'src/app/common/folderTree'
import { errorMessage, successMessage } from 'src/app/common/notifications'
import type { AppThunk } from 'src/redux/store/types'

import { setFolderTree, setPathsArr } from '..'
import { fetchPhotos } from '../../mainPageSlice/thunks'
import { getFolderReducerFolderInfoCurrentFolder, getFolderReducerFolderPathsArr } from '../selectors'

export const removeDirectory = (): AppThunk => (dispatch, getState) => {
  const currentFolderPath = getFolderReducerFolderInfoCurrentFolder(getState())
  const paths = getFolderReducerFolderPathsArr(getState())
  const updateContent = (removedFilePaths: string[]) => {
    const updatedPaths = difference(paths, removedFilePaths)

    dispatch(setFolderTree(createFolderTree(updatedPaths)))
    dispatch(setPathsArr(updatedPaths))
    dispatch(fetchPhotos())
    successMessage('Folder was deleted successfully!')
  }
  mainApi
    .deleteDirectory(currentFolderPath)
    .then(({ data }) => {
      updateContent(data.directoriesToRemove)
    })
    .catch(error => errorMessage(new Error(error), 'Directory deleting ERROR: ', 0))
}
