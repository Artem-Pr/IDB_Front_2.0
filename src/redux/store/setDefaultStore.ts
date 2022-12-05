import { AppDispatch } from './store'
import {
  setIsFullSizePreview,
  setMaxImagePreviewSlideLimit,
  setMinImagePreviewSlideLimit,
} from '../reducers/settingsSlice-reducer'
import { localStorageAPI } from '../../app/common/utils/localStorageAPI'
import {
  setDateRange,
  setExcludeTags,
  setGalleryPagination,
  setGallerySortingList,
  setMimeTypes,
  setRandomSort,
  setSearchFileName,
  setSearchTags,
  updateDOpenMenus,
} from '../reducers/mainPageSlice/mainPageSlice'
import { setCurrentFolderKey, setCurrentFolderPath, setExpandedKeys } from '../reducers/foldersSlice-reducer'

export const setDefaultStore = (dispatch: AppDispatch) => {
  dispatch(setIsFullSizePreview(localStorageAPI.fullSizePreview))
  dispatch(setMaxImagePreviewSlideLimit(localStorageAPI.maxImagePreviewLimit))
  dispatch(setMinImagePreviewSlideLimit(localStorageAPI.minImagePreviewLimit))

  dispatch(updateDOpenMenus(localStorageAPI.DOpenMenus))

  const { searchTags, excludeTags, mimetypes, dateRange, fileName } = localStorageAPI.searchMenu
  dispatch(setSearchFileName(fileName))
  dispatch(setSearchTags(searchTags))
  dispatch(setExcludeTags(excludeTags))
  dispatch(setMimeTypes(mimetypes))
  dispatch(setDateRange(dateRange))

  dispatch(setGalleryPagination(localStorageAPI.galleryPagination))
  dispatch(setGallerySortingList(localStorageAPI.gallerySortingList))
  dispatch(setRandomSort(localStorageAPI.randomSort))

  dispatch(setCurrentFolderPath(localStorageAPI.currentFolderPath))
  dispatch(setCurrentFolderKey(localStorageAPI.currentFolderKey))
  dispatch(setExpandedKeys(localStorageAPI.expandedKeys))
}
