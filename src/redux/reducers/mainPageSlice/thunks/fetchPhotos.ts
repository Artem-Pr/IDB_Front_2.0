import { isEmpty } from 'ramda'

import { mainApi } from 'src/api/api'
import { prepareSortingList } from 'src/api/helpers'
import type { Media } from 'src/api/models/media'
import { createFolderTree } from 'src/app/common/folderTree'
import { errorMessage } from 'src/app/common/notifications'
import type { AppThunk } from 'src/redux/store/types'

import { setFolderTree, setPathsArr } from '../../foldersSlice/foldersSlice'
import {
  clearDSelectedList,
  setDGalleryLoading,
  setDownloadingFiles,
  setFilesSizeSum,
  setGalleryPagination,
  setRawFiles,
} from '../mainPageSlice'

interface FetchPhotos {
  isNameComparison?: boolean
  comparisonFolder?: string
}

export const fetchPhotos = (settings?: FetchPhotos): AppThunk => (dispatch, getState) => {
  const isNameComparison = settings?.isNameComparison || false
  const comparisonFolder = settings?.comparisonFolder
  const {
    mainPageReducer,
    folderReducer: { currentFolderInfo },
    settingSlice: { isFullSizePreview, savePreview },
  } = getState()
  const {
    searchMenu: {
      fileName,
      searchTags,
      excludeTags,
      mimetypes,
      dateRange,
      includeAllSearchTags,
      description,
      rating,
      anyDescription,
    },
    galleryPagination,
    sort: { gallerySortingList, randomSort },
  } = mainPageReducer
  const { currentPage, nPerPage } = galleryPagination
  const folderPath = isNameComparison ? '' : currentFolderInfo.currentFolderPath
  const { showSubfolders, isDynamicFolders } = currentFolderInfo
  dispatch(setDGalleryLoading(true))
  mainApi
    .getPhotosByTags({
      page: currentPage,
      sorting: prepareSortingList(gallerySortingList),
      perPage: nPerPage,
      ...(rating && { rating }),
      ...(fileName && { fileName }),
      ...(includeAllSearchTags && { includeAllSearchTags }),
      ...(!isEmpty(searchTags) && { searchTags }),
      ...(!isEmpty(excludeTags) && { excludeTags }),
      ...(!isEmpty(mimetypes) && { mimetypes }),
      ...(dateRange && { dateRange }),
      ...(anyDescription && { anyDescription }),
      ...(description && !anyDescription && { description }),
      ...(folderPath && { folderPath }),
      ...(comparisonFolder && { comparisonFolder }),
      ...(isNameComparison && { isNameComparison }),
      ...(showSubfolders && { showSubfolders }),
      ...(isFullSizePreview && { isFullSizePreview }),
      ...(!savePreview && { dontSavePreview: !savePreview }),
      ...(randomSort && { randomSort }),
      ...(isDynamicFolders && { isDynamicFolders }),
    })
    .then(({
      data: {
        files, searchPagination, filesSizeSum, dynamicFolders,
      },
    }) => {
      const mediaFiles: Media[] = files || []
      dynamicFolders && dynamicFolders.length && dispatch(setPathsArr(dynamicFolders))
      dynamicFolders && dynamicFolders.length && dispatch(setFolderTree(createFolderTree(dynamicFolders)))
      dispatch(clearDSelectedList())
      dispatch(setRawFiles(mediaFiles)) // TODO: check setRawFiles if it's needed
      dispatch(setDownloadingFiles(mediaFiles))
      dispatch(setGalleryPagination(searchPagination))
      dispatch(setFilesSizeSum(filesSizeSum))
      dispatch(setDGalleryLoading(false))
    })
    .catch(error => {
      const showError = () => {
        errorMessage(error, 'downloading files error: ')
        dispatch(setDGalleryLoading(false))
      }
      error.message !== 'canceled' && showError()
    })
}
