import { mainApi } from 'src/api/requests/api-requests'
import { errorMessage } from 'src/app/common/notifications'
import type { AppThunk } from 'src/redux/store/types'
import type { CheckedDirectoryRequest } from 'src/redux/types'

import { folderReducerSetNumberOfFilesInDirectory, folderReducerSetNumberOfSubdirectories, folderReducerSetShowInfoModal } from '..'
import { getFolderReducerFolderInfoCurrentFolder } from '../selectors'

export const checkDirectory = (): AppThunk => (dispatch, getState) => {
  const dispatchDirectoryInfo = ({ numberOfFiles, numberOfSubdirectories }: CheckedDirectoryRequest) => {
    dispatch(folderReducerSetNumberOfFilesInDirectory(numberOfFiles))
    dispatch(folderReducerSetNumberOfSubdirectories(numberOfSubdirectories))
    dispatch(folderReducerSetShowInfoModal(true))
  }

  const currentFolderPath = getFolderReducerFolderInfoCurrentFolder(getState())
  mainApi
    .checkDirectory(currentFolderPath)
    .then(({ data }) => {
      dispatchDirectoryInfo(data)
    })
    .catch(error => errorMessage(new Error(error), 'Directory checking ERROR: ', 0))
}
