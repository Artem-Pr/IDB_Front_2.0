/* eslint functional/immutable-data: 0 */
import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'

import type { DownloadingObject, DownloadingRawObject, GallerySortingItem, Preview } from '../../types'
import { MimeTypes } from '../../types/MimeTypes'
import { GalleryPagination, MainMenuKeys } from '../../types'
import { initialState } from './mainPageState'
import { defaultGallerySortingList } from './helpers'

const mainPageSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    resetSort(state) {
      state.gallerySortingList = defaultGallerySortingList
    },
    setRandomSort(state, action: PayloadAction<boolean>) {
      state.randomSort = action.payload
    },
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
    setSearchFileName(state, action: PayloadAction<string>) {
      state.searchMenu.fileName = action.payload
    },
    setIncludeAllSearchTags(state, action: PayloadAction<boolean>) {
      state.searchMenu.includeAllSearchTags = action.payload
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
    setDateRange(state, action: PayloadAction<[string, string] | null>) {
      state.searchMenu.dateRange = action.payload
    },
    resetSearchMenu(state) {
      state.searchMenu = initialState.searchMenu
    },
    setGalleryPagination(state, action: PayloadAction<Partial<GalleryPagination>>) {
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
  setSearchFileName,
  setIncludeAllSearchTags,
  setSearchTags,
  setExcludeTags,
  setMimeTypes,
  setDateRange,
  clearDownloadingState,
  setGalleryPagination,
  setDLoading,
  setDGalleryLoading,
  setIsDeleteProcessing,
  setFilesSizeSum,
  setPreview,
  setRandomSort,
  resetSort,
  resetSearchMenu,
} = mainPageSlice.actions

export const mainPageReducer = mainPageSlice.reducer
