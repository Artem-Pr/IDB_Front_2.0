import { difference } from 'ramda'

import { mainApi } from 'src/api/api'
import { createFolderTree } from 'src/app/common/folderTree'
import { errorMessage, successMessage } from 'src/app/common/notifications'
import { folderInfoCurrentFolder, pathsArr } from 'src/redux/selectors'
import type { AppThunk } from 'src/redux/store/types'

import { fetchPhotos } from '../../mainPageSlice/thunks'
import { setFolderTree, setPathsArr } from '../foldersSlice'

export const removeDirectory = (): AppThunk => (dispatch, getState) => {
  const currentFolderPath = folderInfoCurrentFolder(getState())
  const paths = pathsArr(getState())
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
