import { AppDispatch } from './store'
import {
  setIsFullSizePreview,
  setMaxImagePreviewSlideLimit,
  setMinImagePreviewSlideLimit,
  setSavePreview,
} from '../reducers/settingsSlice-reducer'
import { localStorageAPI } from '../../app/common/utils/localStorageAPI'
import {
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
} from '../reducers/mainPageSlice/mainPageSlice'
import {
  setCurrentFolderKey,
  setCurrentFolderPath,
  setExpandedKeys,
  setIsDynamicFolders,
} from '../reducers/foldersSlice-reducer'
import { setGallerySortingList as setGallerySortingListUploadPage } from '../reducers/uploadSlice/uploadSlice'

export const setDefaultStore = (dispatch: AppDispatch) => {
  dispatch(setSavePreview(localStorageAPI.savePreview))
  dispatch(setIsFullSizePreview(localStorageAPI.fullSizePreview))
  dispatch(setMaxImagePreviewSlideLimit(localStorageAPI.maxImagePreviewLimit))
  dispatch(setMinImagePreviewSlideLimit(localStorageAPI.minImagePreviewLimit))

  dispatch(updateDOpenMenus(localStorageAPI.DOpenMenus))

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
  dispatch(setSearchFileName(fileName))
  dispatch(setRatingFilter(rating))
  dispatch(setIncludeAllSearchTags(includeAllSearchTags))
  dispatch(setSearchTags(searchTags))
  dispatch(setExcludeTags(excludeTags))
  dispatch(setMimeTypes(mimetypes))
  dispatch(setDateRange(dateRange))
  dispatch(setDescriptionFilter(description))
  dispatch(setIsAnyDescriptionFilter(anyDescription))

  dispatch(setGalleryPagination(localStorageAPI.galleryPagination))
  dispatch(setGallerySortingListMainPage(localStorageAPI.gallerySortingListMainPage))
  dispatch(setGallerySortingListUploadPage(localStorageAPI.gallerySortingListUploadPage))
  dispatch(setGroupedByDateMainPage(localStorageAPI.groupedByDateMainPage))
  dispatch(setRandomSort(localStorageAPI.randomSort))

  dispatch(setCurrentFolderPath(localStorageAPI.currentFolderPath))
  dispatch(setCurrentFolderKey(localStorageAPI.currentFolderKey))
  dispatch(setExpandedKeys(localStorageAPI.expandedKeys))
  dispatch(setIsDynamicFolders(localStorageAPI.isDynamicFolders))
}
