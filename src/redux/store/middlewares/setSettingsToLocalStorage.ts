import { createListenerMiddleware } from '@reduxjs/toolkit'

import { setIsDuplicatesChecking } from 'src/redux/reducers/sessionSlice'

import { localStorageAPI } from '../../../app/common/utils/localStorageAPI'
import {
  setCurrentFolderKey,
  setCurrentFolderPath,
  setExpandedKeys,
  setIsDynamicFolders,
} from '../../reducers/foldersSlice/foldersSlice'
import { defaultGallerySortingList as defaultGallerySortingListMainPage } from '../../reducers/mainPageSlice/helpers'
import {
  resetSearchMenu,
  resetSort as resetSortMainPage,
  setDateRange,
  setDescriptionFilter,
  setExcludeTags,
  setGalleryPagination,
  setGallerySortingList as setGallerySortingListMainPage,
  setGroupedByDate as setGroupedByDateMainPage,
  setIncludeAllSearchTags,
  setIsAnyDescriptionFilter,
  setMimeTypes,
  setRandomSort,
  setRatingFilter,
  setSearchFileName,
  setSearchTags,
  updateDOpenMenus,
} from '../../reducers/mainPageSlice/mainPageSlice'
import { initialState } from '../../reducers/mainPageSlice/mainPageState'
import {
  setIsFullSizePreview,
  setIsVideoPreviewMuted,
  setMaxImagePreviewSlideLimit,
  setMinImagePreviewSlideLimit,
  setSavePreview,
} from '../../reducers/settingsSlice/settingsSlice'
import { defaultGallerySortingList as defaultGallerySortingListUploadPage } from '../../reducers/uploadSlice/helpers'
import {
  resetSort as resetSortUploadPage,
  setGallerySortingList as setGallerySortingListUploadPage,
} from '../../reducers/uploadSlice/uploadSlice'
import { main } from '../../selectors'
import type { RootState } from '../types'

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
    const { searchMenu } = localStorageAPI
    localStorageAPI.searchMenu = { ...searchMenu, rating: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: setSearchFileName,
  effect: action => {
    const { searchMenu } = localStorageAPI
    localStorageAPI.searchMenu = { ...searchMenu, fileName: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: setIncludeAllSearchTags,
  effect: action => {
    const { searchMenu } = localStorageAPI
    localStorageAPI.searchMenu = { ...searchMenu, includeAllSearchTags: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: setSearchTags,
  effect: action => {
    const { searchMenu } = localStorageAPI
    localStorageAPI.searchMenu = { ...searchMenu, searchTags: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: setExcludeTags,
  effect: action => {
    const { searchMenu } = localStorageAPI
    localStorageAPI.searchMenu = { ...searchMenu, excludeTags: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: setMimeTypes,
  effect: action => {
    const { searchMenu } = localStorageAPI
    localStorageAPI.searchMenu = { ...searchMenu, mimetypes: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: setDateRange,
  effect: action => {
    const { searchMenu } = localStorageAPI
    localStorageAPI.searchMenu = { ...searchMenu, dateRange: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: setIsAnyDescriptionFilter,
  effect: action => {
    const { searchMenu } = localStorageAPI
    localStorageAPI.searchMenu = { ...searchMenu, anyDescription: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: setDescriptionFilter,
  effect: action => {
    const { searchMenu } = localStorageAPI
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
    const { galleryPagination } = main(state.getState())
    localStorageAPI.galleryPagination = { ...galleryPagination, ...action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: setGallerySortingListMainPage,
  effect: action => {
    localStorageAPI.gallerySortingListMainPage = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: setGallerySortingListUploadPage,
  effect: action => {
    localStorageAPI.gallerySortingListUploadPage = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: resetSortMainPage,
  effect: () => {
    localStorageAPI.gallerySortingListMainPage = defaultGallerySortingListMainPage
  },
})

listenerMiddleware.startListening({
  actionCreator: resetSortUploadPage,
  effect: () => {
    localStorageAPI.gallerySortingListUploadPage = defaultGallerySortingListUploadPage
  },
})

listenerMiddleware.startListening({
  actionCreator: setRandomSort,
  effect: action => {
    localStorageAPI.randomSort = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: setGroupedByDateMainPage,
  effect: action => {
    localStorageAPI.groupedByDateMainPage = action.payload
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

listenerMiddleware.startListening({
  actionCreator: setIsVideoPreviewMuted,
  effect: action => {
    localStorageAPI.isVideoPreviewMuted = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: setIsDuplicatesChecking,
  effect: action => {
    localStorageAPI.isDuplicatesChecking = action.payload
  },
})

export const settingsMiddleware = listenerMiddleware.middleware
