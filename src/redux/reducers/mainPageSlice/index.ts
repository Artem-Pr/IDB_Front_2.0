import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'

import type { Media } from 'src/api/models/media'
import { MainMenuKeys, MimeTypes } from 'src/common/constants'

import type {
  GalleryPagination,
  GallerySortingItem,
  Preview,
  SortingData,
} from '../../types'

import { defaultGallerySortingList } from './helpers'
import { initialState } from './mainPageState'
import type { SearchMenu } from './types'

const mainPageSlice = createSlice({
  name: 'mainPage',
  initialState,
  reducers: {
    mainPageReducerSetSort(state, action: PayloadAction<Partial<SortingData>>) {
      state.sort = {
        ...current(state).sort,
        ...action.payload,
      }
    },
    mainPageReducerResetSort(state) {
      state.sort.gallerySortingList = defaultGallerySortingList
    },
    mainPageReducerSetRandomSort(state, action: PayloadAction<boolean>) {
      state.sort.randomSort = action.payload
    },
    mainPageReducerSetGallerySortingList(state, action: PayloadAction<GallerySortingItem[]>) {
      state.sort.gallerySortingList = action.payload
    },
    mainPageReducerSetGroupedByDate(state, action: PayloadAction<boolean>) {
      state.sort.groupedByDate = action.payload
    },
    mainPageReducerSetRawFiles(state, action: PayloadAction<Media[]>) {
      state.rawFiles = action.payload
    },
    mainPageReducerSetFilesArr(state, action: PayloadAction<Media[]>) {
      state.filesArr = action.payload
    },
    mainPageReducerAddToSelectedList(state, action: PayloadAction<number[]>) {
      const updatedSelectedList = [...current(state).selectedList, ...action.payload]
      const set = new Set(updatedSelectedList)
      state.selectedList = Array.from(set)
    },
    mainPageReducerRemoveFromSelectedList(state, action: PayloadAction<number[]>) {
      const set = new Set(state.selectedList)
      action.payload.forEach(index => set.delete(index))
      state.selectedList = Array.from(set)
    },
    mainPageReducerSetOpenMenus(state, action: PayloadAction<MainMenuKeys[]>) {
      state.openMenus = action.payload
    },
    mainPageReducerClearSelectedList(state) {
      state.selectedList = []
    },
    mainPageReducerSelectAll(state) {
      state.selectedList = state.filesArr.map((_, i) => i)
    },
    mainPageReducerSetSearchMenu(state, action: PayloadAction<Partial<SearchMenu>>) {
      state.searchMenu = {
        ...current(state).searchMenu,
        ...action.payload,
      }
    },
    mainPageReducerSetRatingFilter(state, action: PayloadAction<number>) {
      state.searchMenu.rating = action.payload
    },
    mainPageReducerSetSearchFileName(state, action: PayloadAction<string>) {
      state.searchMenu.fileName = action.payload
    },
    mainPageReducerSetIncludeAllSearchTags(state, action: PayloadAction<boolean>) {
      state.searchMenu.includeAllSearchTags = action.payload
    },
    mainPageReducerSetSearchTags(state, action: PayloadAction<string[]>) {
      state.searchMenu.searchTags = action.payload
    },
    mainPageReducerSetExcludeTags(state, action: PayloadAction<string[]>) {
      state.searchMenu.excludeTags = action.payload
    },
    mainPageReducerSetMimeTypes(state, action: PayloadAction<MimeTypes[]>) {
      state.searchMenu.mimetypes = action.payload
    },
    mainPageReducerSetDateRange(state, action: PayloadAction<[string, string] | null>) {
      state.searchMenu.dateRange = action.payload
    },
    mainPageReducerSetIsAnyDescriptionFilter(state, action: PayloadAction<boolean>) {
      state.searchMenu.anyDescription = action.payload
    },
    mainPageReducerSetDescriptionFilter(state, action: PayloadAction<string>) {
      state.searchMenu.description = action.payload
    },
    mainPageReducerResetSearchMenu(state) {
      state.searchMenu = initialState.searchMenu
    },
    mainPageReducerSetGalleryPagination(state, action: PayloadAction<Partial<GalleryPagination>>) {
      state.galleryPagination = {
        ...current(state).galleryPagination,
        ...action.payload,
      }
    },
    mainPageReducerClearState(state) {
      state.filesArr = initialState.filesArr
      state.selectedList = initialState.selectedList
    },
    mainPageReducerSetIsExifLoading(state, action: PayloadAction<boolean>) {
      state.isExifLoading = action.payload
    },
    mainPageReducerSetIsGalleryLoading(state, action: PayloadAction<boolean>) {
      state.isGalleryLoading = action.payload
    },
    mainPageReducerSetIsDeleteProcessing(state, action: PayloadAction<boolean>) {
      state.isDeleteProcessing = action.payload
    },
    mainPageReducerSetFilesSizeSum(state, action: PayloadAction<number>) {
      state.filesSizeSum = action.payload
    },
    mainPageReducerSetPreview(state, action: PayloadAction<Partial<Preview>>) {
      state.preview = {
        ...current(state).preview,
        ...action.payload,
      }
    },
    mainPageReducerStopVideoPreview(state) {
      state.preview.stop = true
    },
    mainPageReducerStartVideoPreview(state) {
      state.preview.stop = false
    },
    mainPageReducerClearPreview(state) {
      state.preview = initialState.preview
    },
  },
})

export const {
  mainPageReducerAddToSelectedList,
  mainPageReducerClearPreview,
  mainPageReducerClearSelectedList,
  mainPageReducerClearState,
  mainPageReducerRemoveFromSelectedList,
  mainPageReducerResetSearchMenu,
  mainPageReducerResetSort,
  mainPageReducerSelectAll,
  mainPageReducerSetDateRange,
  mainPageReducerSetDescriptionFilter,
  mainPageReducerSetExcludeTags,
  mainPageReducerSetFilesArr,
  mainPageReducerSetFilesSizeSum,
  mainPageReducerSetGalleryPagination,
  mainPageReducerSetGallerySortingList,
  mainPageReducerSetGroupedByDate,
  mainPageReducerSetIncludeAllSearchTags,
  mainPageReducerSetIsAnyDescriptionFilter,
  mainPageReducerSetIsDeleteProcessing,
  mainPageReducerSetIsExifLoading,
  mainPageReducerSetIsGalleryLoading,
  mainPageReducerSetMimeTypes,
  mainPageReducerSetOpenMenus,
  mainPageReducerSetPreview,
  mainPageReducerSetRandomSort,
  mainPageReducerSetRatingFilter,
  mainPageReducerSetRawFiles,
  mainPageReducerSetSearchFileName,
  mainPageReducerSetSearchMenu,
  mainPageReducerSetSearchTags,
  mainPageReducerSetSort,
  mainPageReducerStartVideoPreview,
  mainPageReducerStopVideoPreview,
} = mainPageSlice.actions

export const mainPageSliceReducer = mainPageSlice.reducer
