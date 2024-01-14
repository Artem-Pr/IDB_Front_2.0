/* eslint-disable functional/immutable-data */
import { createListenerMiddleware } from '@reduxjs/toolkit'

import {
  setIsFullSizePreview,
  setMaxImagePreviewSlideLimit,
  setMinImagePreviewSlideLimit,
  setSavePreview,
} from '../../reducers/settingsSlice-reducer'
import { localStorageAPI } from '../../../app/common/utils/localStorageAPI'
import {
  resetSearchMenu,
  resetSort,
  setDateRange,
  setDescriptionFilter,
  setExcludeTags,
  setGalleryPagination,
  setGallerySortingList,
  setGroupedByDate,
  setIncludeAllSearchTags,
  setIsAnyDescriptionFilter,
  setMimeTypes,
  setRandomSort,
  setRatingFilter,
  setSearchFileName,
  setSearchTags,
  updateDOpenMenus,
} from '../../reducers/mainPageSlice/mainPageSlice'
import { defaultGallerySortingList } from '../../reducers/mainPageSlice/helpers'
import {
  setCurrentFolderKey,
  setCurrentFolderPath,
  setExpandedKeys,
  setIsDynamicFolders,
} from '../../reducers/foldersSlice-reducer'
import { initialState } from '../../reducers/mainPageSlice/mainPageState'
import { RootState } from '../rootReducer'

export const listenerMiddleware = createListenerMiddleware<RootState>()

listenerMiddleware.startListening({
  actionCreator: setSavePreview,
  effect: action => {
    localStorageAPI.savePreview = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: setIsFullSizePreview,
  effect: action => {
    localStorageAPI.fullSizePreview = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: setMaxImagePreviewSlideLimit,
  effect: action => {
    localStorageAPI.maxImagePreviewLimit = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: setMinImagePreviewSlideLimit,
  effect: action => {
    localStorageAPI.minImagePreviewLimit = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: updateDOpenMenus,
  effect: action => {
    localStorageAPI.DOpenMenus = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: setRatingFilter,
  effect: action => {
    const searchMenu = localStorageAPI.searchMenu
    localStorageAPI.searchMenu = { ...searchMenu, rating: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: setSearchFileName,
  effect: action => {
    const searchMenu = localStorageAPI.searchMenu
    localStorageAPI.searchMenu = { ...searchMenu, fileName: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: setIncludeAllSearchTags,
  effect: action => {
    const searchMenu = localStorageAPI.searchMenu
    localStorageAPI.searchMenu = { ...searchMenu, includeAllSearchTags: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: setSearchTags,
  effect: action => {
    const searchMenu = localStorageAPI.searchMenu
    localStorageAPI.searchMenu = { ...searchMenu, searchTags: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: setExcludeTags,
  effect: action => {
    const searchMenu = localStorageAPI.searchMenu
    localStorageAPI.searchMenu = { ...searchMenu, excludeTags: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: setMimeTypes,
  effect: action => {
    const searchMenu = localStorageAPI.searchMenu
    localStorageAPI.searchMenu = { ...searchMenu, mimetypes: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: setDateRange,
  effect: action => {
    const searchMenu = localStorageAPI.searchMenu
    localStorageAPI.searchMenu = { ...searchMenu, dateRange: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: setIsAnyDescriptionFilter,
  effect: action => {
    const searchMenu = localStorageAPI.searchMenu
    localStorageAPI.searchMenu = { ...searchMenu, anyDescription: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: setDescriptionFilter,
  effect: action => {
    const searchMenu = localStorageAPI.searchMenu
    localStorageAPI.searchMenu = { ...searchMenu, description: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: resetSearchMenu,
  effect: () => {
    localStorageAPI.searchMenu = initialState.searchMenu
  },
})

listenerMiddleware.startListening({
  actionCreator: setGalleryPagination,
  effect: (action, state) => {
    const { galleryPagination } = state.getState().mainPageReducer
    localStorageAPI.galleryPagination = { ...galleryPagination, ...action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: setGallerySortingList,
  effect: action => {
    localStorageAPI.gallerySortingList = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: resetSort,
  effect: () => {
    localStorageAPI.gallerySortingList = defaultGallerySortingList
  },
})

listenerMiddleware.startListening({
  actionCreator: setRandomSort,
  effect: action => {
    localStorageAPI.randomSort = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: setGroupedByDate,
  effect: action => {
    localStorageAPI.groupedByDate = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: setCurrentFolderPath,
  effect: action => {
    localStorageAPI.currentFolderPath = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: setCurrentFolderKey,
  effect: action => {
    localStorageAPI.currentFolderKey = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: setExpandedKeys,
  effect: action => {
    localStorageAPI.expandedKeys = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: setIsDynamicFolders,
  effect: action => {
    localStorageAPI.isDynamicFolders = action.payload
  },
})

export const settingsMiddleware = listenerMiddleware.middleware
