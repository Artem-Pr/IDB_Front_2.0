import { isEmpty } from 'ramda'

import { mainApi } from 'src/api/api'
import { prepareSortingList } from 'src/api/helpers'
import type { Media } from 'src/api/models/media'
import { createFolderTree } from 'src/app/common/folderTree'
import { errorMessage } from 'src/app/common/notifications'
import type { AppThunk } from 'src/redux/store/types'

import {
  mainPageReducerClearState,
  mainPageReducerSetIsGalleryLoading,
  mainPageReducerSetFilesArr,
  mainPageReducerSetFilesSizeSum,
  mainPageReducerSetGalleryPagination,
  mainPageReducerSetRawFiles,
} from '..'
import { folderReducerSetFolderTree, folderReducerSetPathsArr } from '../../foldersSlice'

import { fetchMainPageDuplicates } from './fetchMainPageDuplicates'

export const fetchPhotos = (): AppThunk => (dispatch, getState) => {
  const {
    mainPageSliceReducer: mainPageReducer,
    foldersSliceReducer: { currentFolderInfo },
    sessionSliceReducer: { isDuplicatesChecking },
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
  const folderPath = currentFolderInfo.currentFolderPath
  const { showSubfolders, isDynamicFolders } = currentFolderInfo
  dispatch(mainPageReducerSetIsGalleryLoading(true))
  mainApi
    .getPhotosByTags({
      filters: {
        ...(rating && { rating }),
        ...(fileName && { fileName: fileName.trim() }),
        ...(includeAllSearchTags && { includeAllSearchTags }),
        ...(!isEmpty(searchTags) && { searchTags }),
        ...(!isEmpty(excludeTags) && { excludeTags }),
        ...(!isEmpty(mimetypes) && { mimetypes }),
        ...(dateRange && { dateRange }),
        ...(anyDescription && { anyDescription }),
        ...(description && !anyDescription && { description: description.trim() }),
      },
      sorting: {
        sort: prepareSortingList(gallerySortingList),
        ...(randomSort && { randomSort }),
      },
      folders: {
        ...(folderPath && { folderPath }),
        ...(showSubfolders && { showSubfolders }),
        ...(isDynamicFolders && { isDynamicFolders }),
      },
      pagination: {
        page: currentPage,
        perPage: nPerPage,
      },
    })
    .then(({
      data: {
        files, searchPagination, filesSizeSum, dynamicFolders,
      },
    }) => {
      const mediaFiles: Media[] = files || []
      dynamicFolders && dynamicFolders.length && dispatch(folderReducerSetPathsArr(dynamicFolders))
      dynamicFolders && dynamicFolders.length && dispatch(folderReducerSetFolderTree(createFolderTree(dynamicFolders)))
      dispatch(mainPageReducerClearState())
      dispatch(mainPageReducerSetRawFiles(mediaFiles)) // TODO: check setRawFiles if it's needed
      dispatch(mainPageReducerSetFilesArr(mediaFiles))
      dispatch(mainPageReducerSetGalleryPagination(searchPagination))
      dispatch(mainPageReducerSetFilesSizeSum(filesSizeSum))

      mediaFiles.length && isDuplicatesChecking && dispatch(fetchMainPageDuplicates(mediaFiles))

      dispatch(mainPageReducerSetIsGalleryLoading(false))
    })
    .catch(error => {
      const showError = () => {
        errorMessage(error, 'downloading files error: ')
        dispatch(mainPageReducerSetIsGalleryLoading(false))
      }
      error.message !== 'canceled' && showError()
    })
}
