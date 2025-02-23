import { mainApi } from 'src/api/api'
import { createFolderTree } from 'src/app/common/folderTree'
import { errorMessage } from 'src/app/common/notifications'
import type { AppThunk } from 'src/redux/store/types'

import { setFolderTree, setPathsArr } from '..'

export const fetchPathsList = (): AppThunk => dispatch => {
  mainApi
    .getPathsList()
    .then(({ data }) => {
      data.length && dispatch(setPathsArr(data))
      data.length && dispatch(setFolderTree(createFolderTree(data)))
    })
    .catch(error => errorMessage(error, 'Error when getting Paths: '))
}
