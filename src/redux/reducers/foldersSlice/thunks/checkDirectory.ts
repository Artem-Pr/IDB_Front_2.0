import { mainApi } from 'src/api/api'
import { errorMessage } from 'src/app/common/notifications'
import { folderInfoCurrentFolder } from 'src/redux/selectors'
import type { AppThunk } from 'src/redux/store/types'
import type { CheckedDirectoryRequest } from 'src/redux/types'

import { setNumberOfFilesInDirectory, setNumberOfSubdirectories, setShowInfoModal } from '../foldersSlice'

export const checkDirectory = (): AppThunk => (dispatch, getState) => {
  const dispatchDirectoryInfo = ({ numberOfFiles, numberOfSubdirectories }: CheckedDirectoryRequest) => {
    dispatch(setNumberOfFilesInDirectory(numberOfFiles))
    dispatch(setNumberOfSubdirectories(numberOfSubdirectories))
    dispatch(setShowInfoModal(true))
  }

  const currentFolderPath = folderInfoCurrentFolder(getState())
  mainApi
    .checkDirectory(currentFolderPath)
    .then(({ data }) => {
      dispatchDirectoryInfo(data)
    })
    .catch(error => errorMessage(new Error(error), 'Directory checking ERROR: ', 0))
}
