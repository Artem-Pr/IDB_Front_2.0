import { isEmpty } from 'ramda'

import { AppThunk } from '../../../store/store'
import { mainApi } from '../../../../api/api'
import { DownloadingObject, DownloadingRawObject } from '../../../types'
import { convertDownloadingRawObjectArr } from '../../../../app/common/utils'
import { errorMessage } from '../../../../app/common/notifications'
import {
  clearDSelectedList,
  setDGalleryLoading,
  setDownloadingFiles,
  setFilesSizeSum,
  setGalleryPagination,
  setRawFiles,
} from '../mainPageSlice'
import { prepareSortingList } from '../../../../api/helpers'

interface FetchPhotos {
  isNameComparison?: boolean
  comparisonFolder?: string
}

export const fetchPhotos =
  (settings?: FetchPhotos): AppThunk =>
  (dispatch, getState) => {
    const isNameComparison = settings?.isNameComparison || false
    const comparisonFolder = settings?.comparisonFolder
    const {
      mainPageReducer,
      folderReducer: { currentFolderInfo },
      settingSlice: { isFullSizePreview },
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
      gallerySortingList,
      randomSort,
    } = mainPageReducer
    const { currentPage, nPerPage } = galleryPagination
    const folderPath = isNameComparison ? '' : currentFolderInfo.currentFolderPath
    const showSubfolders = currentFolderInfo.showSubfolders
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
        ...(randomSort && { randomSort }),
      })
      .then(({ data }) => {
        const rawFiles: DownloadingRawObject[] = data?.files || []
        const files: DownloadingObject[] = convertDownloadingRawObjectArr(rawFiles)
        dispatch(clearDSelectedList())
        dispatch(setRawFiles(rawFiles))
        dispatch(setDownloadingFiles(files))
        dispatch(setGalleryPagination(data.searchPagination))
        dispatch(setFilesSizeSum(data.filesSizeSum))
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
