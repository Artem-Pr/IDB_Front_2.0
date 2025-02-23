import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'

import type { Media } from 'src/api/models/media'
import { MainMenuKeys } from 'src/common/constants'

import type {
  BlobDispatchPayload,
  BlobUpdateNamePayload,
  GallerySortingItem,
  LoadingStatus,
} from '../../types'

import { defaultGallerySortingList } from './helpers'
import { initialState } from './uploadState'

const uploadSlice = createSlice({
  name: 'uploadPage',
  initialState,
  reducers: {
    uploadReducerResetSort(state) {
      state.sort.gallerySortingList = defaultGallerySortingList
    },
    uploadReducerSetGallerySortingList(state, action: PayloadAction<GallerySortingItem[]>) {
      state.sort.gallerySortingList = action.payload
    },
    uploadReducerSetGroupedByDate(state, action: PayloadAction<boolean>) {
      state.sort.groupedByDate = action.payload
    },
    uploadReducerSetFilesArr(state, action: PayloadAction<Media[]>) {
      state.filesArr = action.payload
    },
    uploadReducerAddToSelectedList(state, action: PayloadAction<number[]>) {
      const updatedSelectedList = [...current(state).selectedList, ...action.payload]
      const set = new Set(updatedSelectedList)
      state.selectedList = Array.from(set)
    },
    uploadReducerRemoveFromSelectedList(state, action: PayloadAction<number[]>) {
      const set = new Set(state.selectedList)
      action.payload.forEach(index => set.delete(index))
      state.selectedList = Array.from(set)
    },
    uploadReducerClearSelectedList(state) {
      state.selectedList = []
    },
    uploadReducerSelectAll(state) {
      state.selectedList = state.filesArr.map((_, i) => i)
    },
    uploadReducerSetOpenMenus(state, action: PayloadAction<MainMenuKeys[]>) {
      state.openMenus = action.payload
    },
    uploadReducerRemoveFromOpenMenus(state, action: PayloadAction<MainMenuKeys>) {
      const set = new Set(state.openMenus)
      set.delete(action.payload)
      state.openMenus = Array.from(set)
    },
    uploadReducerClearState(state) {
      state.filesArr = initialState.filesArr
      state.selectedList = initialState.selectedList
      state.checkForDuplicatesOnlyInCurrentFolder = initialState.checkForDuplicatesOnlyInCurrentFolder
      state.uploadingBlobs = initialState.uploadingBlobs
    },
    uploadReducerIncreaseCountOfPreviewLoading(state) {
      ++state.previewLoadingCount
    },
    uploadReducerDecreaseCountOfPreviewLoading(state) {
      --state.previewLoadingCount
    },
    uploadReducerSetUploadingStatus(state, action: PayloadAction<LoadingStatus>) {
      state.uploadingStatus = action.payload
    },
    uploadReducerSetBlob(state, action: PayloadAction<BlobDispatchPayload>) {
      state.uploadingBlobs[action.payload.name] = action.payload.originalPath
    },
    uploadReducerUpdateBlobName(state, action: PayloadAction<BlobUpdateNamePayload>) {
      state.uploadingBlobs[action.payload.newName] = state.uploadingBlobs[action.payload.oldName]
      delete state.uploadingBlobs[action.payload.oldName]
    },
    uploadReducerRemoveBlob(state, action: PayloadAction<string>) {
      delete state.uploadingBlobs[action.payload]
    },
    uploadReducerSetCheckDuplicatesInCurrentDir(state, action: PayloadAction<boolean>) {
      state.checkForDuplicatesOnlyInCurrentFolder = action.payload
    },
  },
})

export const {
  uploadReducerAddToSelectedList,
  uploadReducerClearSelectedList,
  uploadReducerClearState,
  uploadReducerDecreaseCountOfPreviewLoading,
  uploadReducerIncreaseCountOfPreviewLoading,
  uploadReducerRemoveBlob,
  uploadReducerRemoveFromOpenMenus,
  uploadReducerRemoveFromSelectedList,
  uploadReducerResetSort,
  uploadReducerSelectAll,
  uploadReducerSetBlob,
  uploadReducerSetCheckDuplicatesInCurrentDir,
  uploadReducerSetGallerySortingList,
  uploadReducerSetGroupedByDate,
  uploadReducerSetUploadingStatus,
  uploadReducerUpdateBlobName,
  uploadReducerSetOpenMenus,
  uploadReducerSetFilesArr,
} = uploadSlice.actions

export const uploadPageSliceReducer = uploadSlice.reducer
