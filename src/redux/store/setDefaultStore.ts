import { AppDispatch } from './store'
import {
  setIsFullSizePreview,
  setMaxImagePreviewSlideLimit,
  setMinImagePreviewSlideLimit,
} from '../reducers/settingsSlice-reducer'
import { localStorageAPI } from '../../app/common/utils/localStorageAPI'
import {
  setExcludeTags,
  setGalleryPagination,
  setGallerySortingList,
  setMimeTypes,
  setRandomSort,
  setSearchTags,
  updateDOpenMenus,
} from '../reducers/mainPageSlice/mainPageSlice'
import { setCurrentFolderKey, setCurrentFolderPath, setExpandedKeys } from '../reducers/foldersSlice-reducer'

export const setDefaultStore = (dispatch: AppDispatch) => {
  dispatch(setIsFullSizePreview(localStorageAPI.fullSizePreview))
  dispatch(setMaxImagePreviewSlideLimit(localStorageAPI.maxImagePreviewLimit))
  dispatch(setMinImagePreviewSlideLimit(localStorageAPI.minImagePreviewLimit))

  dispatch(updateDOpenMenus(localStorageAPI.DOpenMenus))
  dispatch(setSearchTags(localStorageAPI.searchMenu.searchTags))
  dispatch(setExcludeTags(localStorageAPI.searchMenu.excludeTags))
  dispatch(setMimeTypes(localStorageAPI.searchMenu.mimetypes))
  dispatch(setGalleryPagination(localStorageAPI.galleryPagination))
  dispatch(setGallerySortingList(localStorageAPI.gallerySortingList))
  dispatch(setRandomSort(localStorageAPI.randomSort))

  dispatch(setCurrentFolderPath(localStorageAPI.currentFolderPath))
  dispatch(setCurrentFolderKey(localStorageAPI.currentFolderKey))
  dispatch(setExpandedKeys(localStorageAPI.expandedKeys))
}
