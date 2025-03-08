import { createListenerMiddleware } from '@reduxjs/toolkit'

import { localStorageAPI } from 'src/common/localStorageAPI'
import { getMainPageReducerGalleryPagination } from 'src/redux/reducers/mainPageSlice/selectors'
import { sessionReducerSetIsDuplicatesChecking } from 'src/redux/reducers/sessionSlice'

import {
  folderReducerSetCurrentFolderKey,
  folderReducerSetCurrentFolderPath,
  folderReducerSetExpandedKeys,
  folderReducerSetIsDynamicFolders,
} from '../../reducers/foldersSlice'
import {
  mainPageReducerResetSearchMenu,
  mainPageReducerResetSort as resetSortMainPage,
  mainPageReducerSetDateRange,
  mainPageReducerSetDescriptionFilter,
  mainPageReducerSetExcludeTags,
  mainPageReducerSetGalleryPagination,
  mainPageReducerSetGallerySortingList as setGallerySortingListMainPage,
  mainPageReducerSetGroupedByDate as setGroupedByDateMainPage,
  mainPageReducerSetIncludeAllSearchTags,
  mainPageReducerSetIsAnyDescriptionFilter,
  mainPageReducerSetMimeTypes,
  mainPageReducerSetRandomSort,
  mainPageReducerSetRatingFilter,
  mainPageReducerSetSearchFileName,
  mainPageReducerSetSearchTags,
  mainPageReducerSetOpenMenus,
} from '../../reducers/mainPageSlice'
import { defaultGallerySortingList as defaultGallerySortingListMainPage } from '../../reducers/mainPageSlice/helpers'
import { initialState } from '../../reducers/mainPageSlice/mainPageState'
import {
  settingsReducerSetIsVideoPreviewMuted,
  settingsReducerSetMaxPreviewSlideLimit,
  settingsReducerSetMinPreviewSlideLimit,
} from '../../reducers/settingsSlice'
import {
  uploadReducerResetSort as resetSortUploadPage,
  uploadReducerSetGallerySortingList as setGallerySortingListUploadPage,
} from '../../reducers/uploadSlice'
import { defaultGallerySortingList as defaultGallerySortingListUploadPage } from '../../reducers/uploadSlice/helpers'
import type { RootState } from '../types'

export const listenerMiddleware = createListenerMiddleware<RootState>()

listenerMiddleware.startListening({
  actionCreator: settingsReducerSetMaxPreviewSlideLimit,
  effect: action => {
    localStorageAPI.maxImagePreviewLimit = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: settingsReducerSetMinPreviewSlideLimit,
  effect: action => {
    localStorageAPI.minImagePreviewLimit = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: mainPageReducerSetOpenMenus,
  effect: action => {
    localStorageAPI.DOpenMenus = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: mainPageReducerSetRatingFilter,
  effect: action => {
    const { searchMenu } = localStorageAPI
    localStorageAPI.searchMenu = { ...searchMenu, rating: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: mainPageReducerSetSearchFileName,
  effect: action => {
    const { searchMenu } = localStorageAPI
    localStorageAPI.searchMenu = { ...searchMenu, fileName: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: mainPageReducerSetIncludeAllSearchTags,
  effect: action => {
    const { searchMenu } = localStorageAPI
    localStorageAPI.searchMenu = { ...searchMenu, includeAllSearchTags: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: mainPageReducerSetSearchTags,
  effect: action => {
    const { searchMenu } = localStorageAPI
    localStorageAPI.searchMenu = { ...searchMenu, searchTags: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: mainPageReducerSetExcludeTags,
  effect: action => {
    const { searchMenu } = localStorageAPI
    localStorageAPI.searchMenu = { ...searchMenu, excludeTags: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: mainPageReducerSetMimeTypes,
  effect: action => {
    const { searchMenu } = localStorageAPI
    localStorageAPI.searchMenu = { ...searchMenu, mimetypes: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: mainPageReducerSetDateRange,
  effect: action => {
    const { searchMenu } = localStorageAPI
    localStorageAPI.searchMenu = { ...searchMenu, dateRange: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: mainPageReducerSetIsAnyDescriptionFilter,
  effect: action => {
    const { searchMenu } = localStorageAPI
    localStorageAPI.searchMenu = { ...searchMenu, anyDescription: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: mainPageReducerSetDescriptionFilter,
  effect: action => {
    const { searchMenu } = localStorageAPI
    localStorageAPI.searchMenu = { ...searchMenu, description: action.payload }
  },
})

listenerMiddleware.startListening({
  actionCreator: mainPageReducerResetSearchMenu,
  effect: () => {
    localStorageAPI.searchMenu = initialState.searchMenu
  },
})

listenerMiddleware.startListening({
  actionCreator: mainPageReducerSetGalleryPagination,
  effect: (action, state) => {
    const galleryPagination = getMainPageReducerGalleryPagination(state.getState())
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
  actionCreator: mainPageReducerSetRandomSort,
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
  actionCreator: folderReducerSetCurrentFolderPath,
  effect: action => {
    localStorageAPI.currentFolderPath = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: folderReducerSetCurrentFolderKey,
  effect: action => {
    localStorageAPI.currentFolderKey = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: folderReducerSetExpandedKeys,
  effect: action => {
    localStorageAPI.expandedKeys = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: folderReducerSetIsDynamicFolders,
  effect: action => {
    localStorageAPI.isDynamicFolders = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: settingsReducerSetIsVideoPreviewMuted,
  effect: action => {
    localStorageAPI.isVideoPreviewMuted = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: sessionReducerSetIsDuplicatesChecking,
  effect: action => {
    localStorageAPI.isDuplicatesChecking = action.payload
  },
})

export const settingsMiddleware = listenerMiddleware.middleware
