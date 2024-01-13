/* eslint functional/immutable-data: 0 */
import { Key } from 'react'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { CheckedDirectoryRequest, DirectoryInfo, FolderTreeItem, QueryResponse } from '../types'
import { AppThunk } from '../store/store'
import { mainApi } from '../../api/api'
import { errorMessage, successMessage } from '../../app/common/notifications'
import { createFolderTree } from '../../app/common/folderTree'
import { fetchPhotos } from './mainPageSlice/thunks'

interface State {
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

export default folderSlice.reducer

export const fetchPathsList = (): AppThunk => dispatch => {
  mainApi
    .getPathsList()
    .then(({ data }) => {
      data.length && dispatch(setPathsArr(data))
      data.length && dispatch(setFolderTree(createFolderTree(data)))
    })
    .catch(error => errorMessage(error, 'Error when getting Paths: '))
}

export const fetchKeywordsList = (): AppThunk => dispatch => {
  mainApi
    .getKeywordsList()
    .then(({ data }) => data.length && dispatch(setKeywordsList(data)))
    .catch(error => errorMessage(error, 'Error when getting Keywords List: '))
}

export const checkDirectory = (): AppThunk => (dispatch, getState) => {
  const dispatchDirectoryInfo = ({ numberOfFiles, numberOfSubdirectories }: CheckedDirectoryRequest) => {
    dispatch(setNumberOfFilesInDirectory(numberOfFiles))
    dispatch(setNumberOfSubdirectories(numberOfSubdirectories))
    dispatch(setShowInfoModal(true))
  }

  const { currentFolderPath } = getState().folderReducer.currentFolderInfo
  mainApi
    .checkDirectory(currentFolderPath)
    .then(({ data }) => {
      data.error && errorMessage(new Error(data.error), 'Directory checking ERROR: ', 0)
      data.success && dispatchDirectoryInfo(data)
    })
    .catch(error => errorMessage(new Error(error), 'Directory checking ERROR: ', 0))
}

export const removeDirectory = (): AppThunk => (dispatch, getState) => {
  const { currentFolderPath } = getState().folderReducer.currentFolderInfo
  const updateContent = (filePaths: string[]) => {
    dispatch(setFolderTree(createFolderTree(filePaths)))
    dispatch(setPathsArr(filePaths))
    dispatch(fetchPhotos())
    successMessage('Folder was deleted successfully!')
  }
  mainApi
    .deleteDirectory(currentFolderPath)
    .then(({ data }) => {
      data.error && errorMessage(new Error(data.error), 'Directory deleting ERROR: ', 0)
      data.success && updateContent(data.filePaths)
    })
    .catch(error => errorMessage(new Error(error), 'Directory deleting ERROR: ', 0))
}
