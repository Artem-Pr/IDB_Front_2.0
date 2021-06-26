/* eslint functional/immutable-data: 0 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { FolderTreeItem } from '../types'
import { AppThunk } from '../store/store'
import api from '../../api/api'
import { errorMessage } from '../../app/common/notifications'

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
  api
    .getPathsList()
    .then(({ data }) => data.length && dispatch(setPathsArr(data)))
    .catch(error => errorMessage(error, 'Error when getting Paths: '))
}

export const fetchKeywordsList = (): AppThunk => dispatch => {
  api
    .getKeywordsList()
    .then(({ data }) => data.length && dispatch(setKeywordsList(data)))
    .catch(error => errorMessage(error, 'Error when getting Keywords List: '))
}
