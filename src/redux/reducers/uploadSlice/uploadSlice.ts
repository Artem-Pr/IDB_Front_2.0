/* eslint functional/immutable-data: 0 */
import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'

import type {
  BlobDispatchPayload,
  BlobUpdateNamePayload,
  ExifFilesList,
  LoadingStatus,
  UploadingObject,
} from '../../types'
import { MainMenuKeys } from '../../types'
import { initialState } from './uploadState'
import type { FullExifPayload } from './types'

const uploadSlice = createSlice({
  name: 'uploadPage',
  initialState,
  reducers: {
    updateUploadingFilesArr(state, action: PayloadAction<UploadingObject[]>) {
      state.uploadingFiles = action.payload
    },
    addFullExifFile(state, action: PayloadAction<FullExifPayload>) {
      const { tempPath, fullExifObj } = action.payload
      state.fullExifFilesList[tempPath] = fullExifObj
    },
    updateFullExifFile(state, action: PayloadAction<ExifFilesList>) {
      state.fullExifFilesList = { ...state.fullExifFilesList, ...action.payload }
    },
    addToSelectedList(state, action: PayloadAction<number[]>) {
      const updatedSelectedList = [...current(state).selectedList, ...action.payload]
      const set = new Set(updatedSelectedList)
      state.selectedList = Array.from(set)
    },
    removeFromSelectedList(state, action: PayloadAction<number[]>) {
      const set = new Set(state.selectedList)
      action.payload.forEach(index => set.delete(index))
      state.selectedList = Array.from(set)
    },
    clearSelectedList(state) {
      state.selectedList = []
    },
    selectAll(state) {
      state.selectedList = state.uploadingFiles.map((_, i) => i)
    },
    updateOpenMenus(state, action: PayloadAction<MainMenuKeys[]>) {
      state.openMenus = action.payload
    },
    removeFromOpenMenus(state, action: PayloadAction<MainMenuKeys>) {
      const set = new Set(state.openMenus)
      set.delete(action.payload)
      state.openMenus = Array.from(set)
    },
    clearUploadingState(state) {
      state.uploadingFiles = initialState.uploadingFiles
      state.selectedList = initialState.selectedList
      state.fullExifFilesList = initialState.fullExifFilesList
      state.checkForDuplicatesOnlyInCurrentFolder = initialState.checkForDuplicatesOnlyInCurrentFolder
      state.uploadingBlobs = initialState.uploadingBlobs
    },
    setIsExifLoading(state, action: PayloadAction<boolean>) {
      state.isExifLoading = action.payload
    },
    increaseCountOfPreviewLoading(state) {
      ++state.previewLoadingCount
    },
    decreaseCountOfPreviewLoading(state) {
      --state.previewLoadingCount
    },
    setUploadingStatus(state, action: PayloadAction<LoadingStatus>) {
      state.uploadingStatus = action.payload
    },
    setBlob(state, action: PayloadAction<BlobDispatchPayload>) {
      state.uploadingBlobs[action.payload.name] = action.payload.originalPath
    },
    updateBlobName(state, action: PayloadAction<BlobUpdateNamePayload>) {
      state.uploadingBlobs[action.payload.newName] = state.uploadingBlobs[action.payload.oldName]
      delete state.uploadingBlobs[action.payload.oldName]
    },
    removeBlob(state, action: PayloadAction<string>) {
      delete state.uploadingBlobs[action.payload]
    },
    setCheckForDuplicatesOnlyInCurrentFolder(state, action: PayloadAction<boolean>) {
      state.checkForDuplicatesOnlyInCurrentFolder = action.payload
    },
  },
})

export const {
  addFullExifFile,
  addToSelectedList,
  clearSelectedList,
  clearUploadingState,
  decreaseCountOfPreviewLoading,
  increaseCountOfPreviewLoading,
  removeBlob,
  removeFromOpenMenus,
  removeFromSelectedList,
  selectAll,
  setBlob,
  setCheckForDuplicatesOnlyInCurrentFolder,
  setIsExifLoading,
  setUploadingStatus,
  updateBlobName,
  updateFullExifFile,
  updateOpenMenus,
  updateUploadingFilesArr,
} = uploadSlice.actions

export const uploadSliceReducer = uploadSlice.reducer
