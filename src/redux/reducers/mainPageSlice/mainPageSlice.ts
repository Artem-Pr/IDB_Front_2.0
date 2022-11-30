/* eslint functional/immutable-data: 0 */
import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'

import type { DownloadingObject, DownloadingRawObject, ElementsPerPage, GallerySortingItem, Preview } from '../../types'
import { MimeTypes } from '../../types/MimeTypes'
import { MainMenuKeys } from '../../types'
import { initialState } from './mainPageState'

const mainPageSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setGallerySortingList(state, action: PayloadAction<GallerySortingItem[]>) {
      state.gallerySortingList = action.payload
    },
    setRawFiles(state, action: PayloadAction<DownloadingRawObject[]>) {
      state.rawFiles = action.payload
    },
    setDownloadingFiles(state, action: PayloadAction<DownloadingObject[]>) {
      state.downloadingFiles = action.payload
    },
    addToDSelectedList(state, action: PayloadAction<number[]>) {
      const updatedSelectedList = [...current(state).dSelectedList, ...action.payload]
      const set = new Set(updatedSelectedList)
      state.dSelectedList = Array.from(set)
    },
    removeFromDSelectedList(state, action: PayloadAction<number[]>) {
      const set = new Set(state.dSelectedList)
      action.payload.forEach(index => set.delete(index))
      state.dSelectedList = Array.from(set)
    },
    updateDOpenMenus(state, action: PayloadAction<MainMenuKeys[]>) {
      state.dOpenMenus = action.payload
    },
    clearDSelectedList(state) {
      state.dSelectedList = []
    },
    selectAllD(state) {
      state.dSelectedList = state.downloadingFiles.map((_, i) => i)
    },
    setSearchTags(state, action: PayloadAction<string[]>) {
      state.searchMenu.searchTags = action.payload
    },
    setExcludeTags(state, action: PayloadAction<string[]>) {
      state.searchMenu.excludeTags = action.payload
    },
    setMimeTypes(state, action: PayloadAction<MimeTypes[]>) {
      state.searchMenu.mimetypes = action.payload
    },
    setGalleryPagination(
      state,
      action: PayloadAction<{
        currentPage?: number
        nPerPage?: ElementsPerPage
        resultsCount?: number
        totalPages?: number
      }>
    ) {
      state.galleryPagination = {
        ...current(state).galleryPagination,
        ...action.payload,
      }
    },
    clearDownloadingState(state) {
      state.downloadingFiles = []
      state.dSelectedList = []
    },
    setDLoading(state, action: PayloadAction<boolean>) {
      state.isExifLoading = action.payload
    },
    setDGalleryLoading(state, action: PayloadAction<boolean>) {
      state.isGalleryLoading = action.payload
    },
    setIsDeleteProcessing(state, action: PayloadAction<boolean>) {
      state.isDeleteProcessing = action.payload
    },
    setFilesSizeSum(state, action: PayloadAction<number>) {
      state.filesSizeSum = action.payload
    },
    setPreview(state, action: PayloadAction<Preview>) {
      state.preview = action.payload
    },
  },
})

export const {
  setGallerySortingList,
  addToDSelectedList,
  removeFromDSelectedList,
  setRawFiles,
  setDownloadingFiles,
  updateDOpenMenus,
  clearDSelectedList,
  selectAllD,
  setSearchTags,
  setExcludeTags,
  setMimeTypes,
  clearDownloadingState,
  setGalleryPagination,
  setDLoading,
  setDGalleryLoading,
  setIsDeleteProcessing,
  setFilesSizeSum,
  setPreview,
} = mainPageSlice.actions

export const mainPageReducer = mainPageSlice.reducer