import type { AxiosError } from 'axios'

import { mainApi } from 'src/api/requests/api-requests'
import { createFolderTree } from 'src/app/common/folderTree'
import { errorMessage } from 'src/app/common/notifications'
import type { AppThunk } from 'src/redux/store/types'

import { folderReducerSetFolderTree, folderReducerSetPathsArr } from '..'

export const fetchPathsList = (): AppThunk => dispatch => {
  mainApi
    .getPathsList()
    .then(({ data }) => {
      data.length && dispatch(folderReducerSetPathsArr(data))
      data.length && dispatch(folderReducerSetFolderTree(createFolderTree(data)))
    })
    .catch((error: AxiosError) => {
      errorMessage(error, 'Error when getting Paths: ')
    })
}
