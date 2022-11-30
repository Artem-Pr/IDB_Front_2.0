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

export const fetchPhotos =
  (isNameComparison?: boolean, comparisonFolder?: string): AppThunk =>
  (dispatch, getState) => {
    const {
      mainPageReducer,
      folderReducer: { currentFolderInfo },
      settingSlice: { isFullSizePreview },
    } = getState()
    const {
      searchMenu: { searchTags, excludeTags, mimetypes },
      galleryPagination,
      gallerySortingList,
    } = mainPageReducer
    const { currentPage, nPerPage } = galleryPagination
    const folderPath = currentFolderInfo.currentFolderPath
    const showSubfolders = currentFolderInfo.showSubfolders
    dispatch(setDGalleryLoading(true))
    mainApi
      .getPhotosByTags({
        page: currentPage,
        sorting: prepareSortingList(gallerySortingList),
        perPage: nPerPage,
        ...(!isEmpty(searchTags) && { searchTags }),
        ...(!isEmpty(excludeTags) && { excludeTags }),
        ...(!isEmpty(mimetypes) && { mimetypes }),
        ...(folderPath && { folderPath }),
        ...(comparisonFolder && { comparisonFolder }),
        ...(isNameComparison && { isNameComparison }),
        ...(showSubfolders && { showSubfolders }),
        ...(isFullSizePreview && { isFullSizePreview }),
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
