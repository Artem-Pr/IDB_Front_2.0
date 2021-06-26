/* eslint functional/immutable-data: 0 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { reduce } from 'ramda'

import { FolderTreeItem } from '../types'
import { AppThunk } from '../store/store'
import api from '../../api/api'
import { errorMessage } from '../../app/common/notifications'
import { removeExtraSlash } from '../../app/common/utils'
import { addFolderToFolderTree } from '../../app/common/folderTree'

interface State {
  folderTree: FolderTreeItem[]
  currentFolderPath: string
  pathsArr: string[]
  keywordsList: string[]
}

const initialState: State = {
  folderTree: [],
  currentFolderPath: '',
  pathsArr: [],
  keywordsList: [],
}

const folderSlice = createSlice({
  name: 'folder',
  initialState,
  reducers: {
    setFolderTree(state, action: PayloadAction<FolderTreeItem[]>) {
      state.folderTree = action.payload
    },
    setCurrentFolderPath(state, action: PayloadAction<string>) {
      state.currentFolderPath = action.payload
    },
    setPathsArr(state, action: PayloadAction<string[]>) {
      state.pathsArr = action.payload
    },
    setKeywordsList(state, action: PayloadAction<string[]>) {
      state.keywordsList = action.payload
    },
  },
})

export const { setFolderTree, setCurrentFolderPath, setPathsArr, setKeywordsList } = folderSlice.actions

export default folderSlice.reducer

export const fetchPathsList = (): AppThunk => dispatch => {
  const updateFolderTree = (folderTree: FolderTreeItem[], path: string) => {
    const cleanFolderPath = removeExtraSlash(path)
    return addFolderToFolderTree(cleanFolderPath, folderTree)
  }
  const createFolderTree = (paths: string[]) => reduce(updateFolderTree, [], paths)

  api
    .getPathsList()
    .then(({ data }) => {
      data.length && dispatch(setPathsArr(data))
      data.length && dispatch(setFolderTree(createFolderTree(data)))
    })
    .catch(error => errorMessage(error, 'Error when getting Paths: '))
}

export const fetchKeywordsList = (): AppThunk => dispatch => {
  api
    .getKeywordsList()
    .then(({ data }) => data.length && dispatch(setKeywordsList(data)))
    .catch(error => errorMessage(error, 'Error when getting Keywords List: '))
}
