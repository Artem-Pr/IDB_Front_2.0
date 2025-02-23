import { localStorageAPI } from 'src/common/localStorageAPI'

import {
  setCurrentFolderKey,
  setCurrentFolderPath,
  setExpandedKeys,
  setIsDynamicFolders,
} from '../reducers/foldersSlice'
import {
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
} from '../reducers/mainPageSlice'
import { sessionReducerSetIsDuplicatesChecking } from '../reducers/sessionSlice'
import {
  settingsReducerSetIsVideoPreviewMuted,
  settingsReducerSetMaxPreviewSlideLimit,
  settingsReducerSetMinPreviewSlideLimit,
} from '../reducers/settingsSlice'
import { uploadReducerSetGallerySortingList as setGallerySortingListUploadPage } from '../reducers/uploadSlice'

import type { AppDispatch } from './types'

export const setDefaultStore = (dispatch: AppDispatch) => {
  dispatch(settingsReducerSetMaxPreviewSlideLimit(localStorageAPI.maxImagePreviewLimit))
  dispatch(settingsReducerSetMinPreviewSlideLimit(localStorageAPI.minImagePreviewLimit))

  dispatch(mainPageReducerSetOpenMenus(localStorageAPI.DOpenMenus))

  const {
    searchTags,
    excludeTags,
    mimetypes,
    dateRange,
    fileName,
    includeAllSearchTags,
    rating,
    description,
    anyDescription,
  } = localStorageAPI.searchMenu
  dispatch(mainPageReducerSetSearchFileName(fileName))
  dispatch(mainPageReducerSetRatingFilter(rating))
  dispatch(mainPageReducerSetIncludeAllSearchTags(includeAllSearchTags))
  dispatch(mainPageReducerSetSearchTags(searchTags))
  dispatch(mainPageReducerSetExcludeTags(excludeTags))
  dispatch(mainPageReducerSetMimeTypes(mimetypes))
  dispatch(mainPageReducerSetDateRange(dateRange))
  dispatch(mainPageReducerSetDescriptionFilter(description))
  dispatch(mainPageReducerSetIsAnyDescriptionFilter(anyDescription))

  dispatch(mainPageReducerSetGalleryPagination(localStorageAPI.galleryPagination))
  dispatch(setGallerySortingListMainPage(localStorageAPI.gallerySortingListMainPage))
  dispatch(setGallerySortingListUploadPage(localStorageAPI.gallerySortingListUploadPage))
  dispatch(setGroupedByDateMainPage(localStorageAPI.groupedByDateMainPage))
  dispatch(mainPageReducerSetRandomSort(localStorageAPI.randomSort))

  dispatch(setCurrentFolderPath(localStorageAPI.currentFolderPath))
  dispatch(setCurrentFolderKey(localStorageAPI.currentFolderKey))
  dispatch(setExpandedKeys(localStorageAPI.expandedKeys))
  dispatch(setIsDynamicFolders(localStorageAPI.isDynamicFolders))
  dispatch(settingsReducerSetIsVideoPreviewMuted(localStorageAPI.isVideoPreviewMuted))

  dispatch(sessionReducerSetIsDuplicatesChecking(localStorageAPI.isDuplicatesChecking))
}
