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
    folderReducerSetCurrentFolderInfo(state, action: PayloadAction<Partial<DirectoryInfo>>) {
      state.currentFolderInfo = {
        ...state.currentFolderInfo,
        ...action.payload,
      }
    },
    folderReducerSetExpandedKeys(state, action: PayloadAction<Key[]>) {
      state.currentFolderInfo.expandedKeys = action.payload
    },
    folderReducerSetFolderTree(state, action: PayloadAction<FolderTreeItem[]>) {
      state.folderTree = action.payload
    },
    folderReducerSetCurrentFolderPath(state, action: PayloadAction<string>) {
      state.currentFolderInfo.currentFolderPath = action.payload
    },
    folderReducerSetCurrentFolderKey(state, action: PayloadAction<string>) {
      state.currentFolderInfo.currentFolderKey = action.payload
    },
    folderReducerSetPathsArr(state, action: PayloadAction<string[]>) {
      state.pathsArr = action.payload
    },
    folderReducerSetKeywordsList(state, action: PayloadAction<string[]>) {
      state.keywordsList = action.payload
    },
    folderReducerSetNumberOfFilesInDirectory(state, action: PayloadAction<number>) {
      state.currentFolderInfo.numberOfFiles = action.payload
    },
    folderReducerSetNumberOfSubdirectories(state, action: PayloadAction<number>) {
      state.currentFolderInfo.numberOfSubdirectories = action.payload
    },
    folderReducerSetShowInfoModal(state, action: PayloadAction<boolean>) {
      state.currentFolderInfo.showInfoModal = action.payload
    },
    folderReducerSetShowSubfolders(state, action: PayloadAction<boolean>) {
      state.currentFolderInfo.showSubfolders = action.payload
    },
    folderReducerSetIsDynamicFolders(state, action: PayloadAction<boolean>) {
      state.currentFolderInfo.isDynamicFolders = action.payload
    },
  },
})

export const {
  folderReducerSetCurrentFolderInfo,
  folderReducerSetCurrentFolderKey,
  folderReducerSetCurrentFolderPath,
  folderReducerSetExpandedKeys,
  folderReducerSetFolderTree,
  folderReducerSetIsDynamicFolders,
  folderReducerSetKeywordsList,
  folderReducerSetNumberOfFilesInDirectory,
  folderReducerSetNumberOfSubdirectories,
  folderReducerSetPathsArr,
  folderReducerSetShowInfoModal,
  folderReducerSetShowSubfolders,
} = folderSlice.actions

export const foldersSliceReducer = folderSlice.reducer
