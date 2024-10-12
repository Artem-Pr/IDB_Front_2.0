import type { HookAPI } from 'antd/es/modal/useModal'

import { mainApi } from 'src/api/api'
import { createFolderTree } from 'src/app/common/folderTree'
import { errorMessage } from 'src/app/common/notifications'
import { deleteConfirmation } from 'src/assets/config/moduleConfig'
import { folderElement, folderInfoCurrentFolder } from 'src/redux/selectors'
import type { AppThunk } from 'src/redux/store/types'

import { setCurrentFolderPath, setFolderTree, setPathsArr } from '../foldersSlice'

import { checkDirectory } from './checkDirectory'

export const removeDirectoryIfExists = (confirm: HookAPI['confirm']): AppThunk => (dispatch, getState) => {
  const currentFolderPath = folderInfoCurrentFolder(getState())
  const { pathsArr } = folderElement(getState())

  const onOk = () => {
    dispatch(checkDirectory())
  }

  mainApi.getPathsList()
    .then(({ data }) => {
      if (data.includes(currentFolderPath)) {
        confirm(deleteConfirmation({ onOk, type: 'directory' }))
      } else {
        const filteredPathsArr = pathsArr.filter(path => !path.startsWith(currentFolderPath))
        dispatch(setPathsArr(filteredPathsArr))
        dispatch(setFolderTree(createFolderTree(filteredPathsArr)))
        filteredPathsArr.length && dispatch(setCurrentFolderPath(''))
      }
    })
    .catch(error => errorMessage(new Error(error), 'Directory checking ERROR: ', 0))
}
