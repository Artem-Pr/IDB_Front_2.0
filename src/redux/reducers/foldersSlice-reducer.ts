/* eslint functional/immutable-data: 0 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { FolderTreeItem } from '../types'

// import { AppThunk } from './store'

interface State {
  folderTree: FolderTreeItem[]
  currentFolderPath: string
  pathsArr: string[]
}

const initialState: State = {
  folderTree: [
    {
      title: 'parent 0',
      key: '0-0',
      children: [
        { title: 'leaf 0-0', key: '0-0-0' },
        { title: 'leaf 0-1', key: '0-0-1' },
        { title: 'parent 0-2', key: '0-0-2' },
      ],
    },
    {
      title: 'parent 1',
      key: '0-1',
      children: [
        { title: 'leaf 1-0', key: '0-1-0' },
        { title: 'leaf 1-1', key: '0-1-1' },
      ],
    },
  ],
  currentFolderPath: '',
  pathsArr: ['folder1/Bom-bom', 'folder2/Bom/sdf'],
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
  },
})

export const { setFolderTree, setCurrentFolderPath, setPathsArr } = folderSlice.actions

export default folderSlice.reducer
