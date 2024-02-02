import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'

import type {
  DownloadingObject, DownloadingRawObject, GallerySortingItem, Preview,
} from '../../types'
import { GalleryPagination, MainMenuKeys } from '../../types'
import { MimeTypes } from '../../types/MimeTypes'

import { defaultGallerySortingList } from './helpers'
import { initialState } from './mainPageState'

const mainPageSlice = createSlice({
  name: 'mainPage',
  initialState,
  reducers: {
    resetSort(state) {
      state.sort.gallerySortingList = defaultGallerySortingList
    },
    setRandomSort(state, action: PayloadAction<boolean>) {
      state.sort.randomSort = action.payload
    },
    setGallerySortingList(state, action: PayloadAction<GallerySortingItem[]>) {
      state.sort.gallerySortingList = action.payload
    },
    setGroupedByDate(state, action: PayloadAction<boolean>) {
      state.sort.groupedByDate = action.payload
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
    setRatingFilter(state, action: PayloadAction<number>) {
      state.searchMenu.rating = action.payload
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
    setIsAnyDescriptionFilter(state, action: PayloadAction<boolean>) {
      state.searchMenu.anyDescription = action.payload
    },
    setDescriptionFilter(state, action: PayloadAction<string>) {
      state.searchMenu.description = action.payload
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
    setPreviewPlaying(state, action: PayloadAction<boolean>) {
      state.preview.playing = action.payload
    },
    stopVideoPreview(state) {
      state.preview.stop = true
    },
    startVideoPreview(state) {
      state.preview.stop = false
    },
    cleanPreview(state) {
      state.preview = initialState.preview
    },
  },
})

export const {
  addToDSelectedList,
  cleanPreview,
  clearDSelectedList,
  clearDownloadingState,
  removeFromDSelectedList,
  resetSearchMenu,
  resetSort,
  selectAllD,
  setDGalleryLoading,
  setDLoading,
  setDateRange,
  setDescriptionFilter,
  setDownloadingFiles,
  setExcludeTags,
  setFilesSizeSum,
  setGalleryPagination,
  setGallerySortingList,
  setGroupedByDate,
  setIncludeAllSearchTags,
  setIsAnyDescriptionFilter,
  setIsDeleteProcessing,
  setMimeTypes,
  setPreview,
  setPreviewPlaying,
  setRandomSort,
  setRatingFilter,
  setRawFiles,
  setSearchFileName,
  setSearchTags,
  startVideoPreview,
  stopVideoPreview,
  updateDOpenMenus,
} = mainPageSlice.actions

export const mainPageReducer = mainPageSlice.reducer
