import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'

import type { Media } from 'src/api/models/media'

import type {
  BlobDispatchPayload,
  BlobUpdateNamePayload,
  ExifFilesList,
  GallerySortingItem,
  LoadingStatus,
} from '../../types'
import { MainMenuKeys } from '../../types'

import { defaultGallerySortingList } from './helpers'
import type { FullExifPayload } from './types'
import { initialState } from './uploadState'

const uploadSlice = createSlice({
  name: 'uploadPage',
  initialState,
  reducers: {
    resetSort(state) {
      state.sort.gallerySortingList = defaultGallerySortingList
    },
    setGallerySortingList(state, action: PayloadAction<GallerySortingItem[]>) {
      state.sort.gallerySortingList = action.payload
    },
    setGroupedByDate(state, action: PayloadAction<boolean>) {
      state.sort.groupedByDate = action.payload
    },
    updateUploadingFilesArr(state, action: PayloadAction<Media[]>) {
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
  resetSort,
  selectAll,
  setBlob,
  setCheckForDuplicatesOnlyInCurrentFolder,
  setGallerySortingList,
  setGroupedByDate,
  setUploadingStatus,
  updateBlobName,
  updateFullExifFile,
  updateOpenMenus,
  updateUploadingFilesArr,
} = uploadSlice.actions

export const uploadPageReducer = uploadSlice.reducer
