import { Key } from 'react'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { DirectoryInfo, FolderTreeItem, QueryResponse } from '../../types'

export interface State {
  folderTree: FolderTreeItem[]
  currentFolderInfo: Omit<DirectoryInfo, keyof QueryResponse>
  pathsArr: string[]
  keywordsList: string[]
}

const initialState: State = {
  folderTree: [],
  currentFolderInfo: {
    numberOfFiles: 0,
    numberOfSubdirectories: 0,
    currentFolderPath: '',
    currentFolderKey: '',
    expandedKeys: [],
    showInfoModal: false,
    showSubfolders: true,
    isDynamicFolders: false,
  },
  pathsArr: [],
  keywordsList: [],
}

const folderSlice = createSlice({
  name: 'folder',
  initialState,
  reducers: {
    setExpandedKeys(state, action: PayloadAction<Key[]>) {
      state.currentFolderInfo.expandedKeys = action.payload
    },
    setFolderTree(state, action: PayloadAction<FolderTreeItem[]>) {
      state.folderTree = action.payload
    },
    setCurrentFolderPath(state, action: PayloadAction<string>) {
      state.currentFolderInfo.currentFolderPath = action.payload
    },
    setCurrentFolderKey(state, action: PayloadAction<string>) {
      state.currentFolderInfo.currentFolderKey = action.payload
    },
    setPathsArr(state, action: PayloadAction<string[]>) {
      state.pathsArr = action.payload
    },
    setKeywordsList(state, action: PayloadAction<string[]>) {
      state.keywordsList = action.payload
    },
    setNumberOfFilesInDirectory(state, action: PayloadAction<number>) {
      state.currentFolderInfo.numberOfFiles = action.payload
    },
    setNumberOfSubdirectories(state, action: PayloadAction<number>) {
      state.currentFolderInfo.numberOfSubdirectories = action.payload
    },
    setShowInfoModal(state, action: PayloadAction<boolean>) {
      state.currentFolderInfo.showInfoModal = action.payload
    },
    setShowSubfolders(state, action: PayloadAction<boolean>) {
      state.currentFolderInfo.showSubfolders = action.payload
    },
    setIsDynamicFolders(state, action: PayloadAction<boolean>) {
      state.currentFolderInfo.isDynamicFolders = action.payload
    },
  },
})

export const {
  setCurrentFolderKey,
  setCurrentFolderPath,
  setExpandedKeys,
  setFolderTree,
  setIsDynamicFolders,
  setKeywordsList,
  setNumberOfFilesInDirectory,
  setNumberOfSubdirectories,
  setPathsArr,
  setShowInfoModal,
  setShowSubfolders,
} = folderSlice.actions

export const foldersSliceReducer = folderSlice.reducer
