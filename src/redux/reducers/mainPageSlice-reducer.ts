/* eslint functional/immutable-data: 0 */
import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { identity, isEmpty, sortBy } from 'ramda'

import {
  DownloadingObject,
  DownloadingRawObject,
  ElementsPerPage,
  GalleryPagination,
  Preview,
  UpdatedObject,
} from '../types'
import { AppThunk } from '../store/store'
import { mainApi } from '../../api/api'
import { errorMessage, successMessage } from '../../app/common/notifications'
import { convertDownloadingRawObjectArr } from '../../app/common/utils'
import { setFolderTree, setPathsArr } from './foldersSlice-reducer'
import { createFolderTree } from '../../app/common/folderTree'
import { MimeTypes } from '../types/MimeTypes'

interface State {
  rawFiles: DownloadingRawObject[]
  downloadingFiles: DownloadingObject[]
  dSelectedList: number[]
  dOpenMenus: string[]
  searchMenu: {
    searchTags: string[]
    excludeTags: string[]
    mimetypes: MimeTypes[]
  }
  galleryPagination: GalleryPagination
  filesSizeSum: number
  isExifLoading: boolean
  isGalleryLoading: boolean
  isDeleteProcessing: boolean
  preview: Preview
}

const initialState: State = {
  rawFiles: [],
  downloadingFiles: [],
  dSelectedList: [],
  dOpenMenus: [],
  searchMenu: {
    searchTags: [],
    excludeTags: [],
    mimetypes: [],
  },
  galleryPagination: {
    currentPage: 1,
    nPerPage: 50,
    resultsCount: 0,
    totalPages: 1,
  },
  filesSizeSum: 0,
  isExifLoading: false,
  isGalleryLoading: false,
  isDeleteProcessing: false,
  preview: {
    previewType: undefined,
    originalName: '',
    originalPath: '',
  },
}

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setRawFiles(state, action: PayloadAction<DownloadingRawObject[]>) {
      state.rawFiles = action.payload
    },
    setDownloadingFiles(state, action: PayloadAction<DownloadingObject[]>) {
      state.downloadingFiles = action.payload
    },
    addToDSelectedList(state, action: PayloadAction<number[]>) {
      const updatedSelectedList = [...current(state).dSelectedList, ...action.payload]
      const set = new Set(updatedSelectedList)
      state.dSelectedList = Array.from(set)
    },
    removeFromDSelectedList(state, action: PayloadAction<number[]>) {
      const set = new Set(state.dSelectedList)
      action.payload.forEach(index => set.delete(index))
      state.dSelectedList = Array.from(set)
    },
    updateDOpenMenus(state, action: PayloadAction<string[]>) {
      state.dOpenMenus = action.payload
    },
    clearDSelectedList(state) {
      state.dSelectedList = []
    },
    selectAllD(state) {
      state.dSelectedList = state.downloadingFiles.map((_, i) => i)
    },
    setSearchTags(state, action: PayloadAction<string[]>) {
      state.searchMenu.searchTags = action.payload
    },
    setExcludeTags(state, action: PayloadAction<string[]>) {
      state.searchMenu.excludeTags = action.payload
    },
    setMimeTypes(state, action: PayloadAction<MimeTypes[]>) {
      state.searchMenu.mimetypes = action.payload
    },
    setGalleryPagination(
      state,
      action: PayloadAction<{
        currentPage?: number
        nPerPage?: ElementsPerPage
        resultsCount?: number
        totalPages?: number
      }>
    ) {
      state.galleryPagination = {
        ...current(state).galleryPagination,
        ...action.payload,
      }
    },
    clearDownloadingState(state) {
      state.downloadingFiles = []
      state.dSelectedList = []
    },
    setDLoading(state, action: PayloadAction<boolean>) {
      state.isExifLoading = action.payload
    },
    setDGalleryLoading(state, action: PayloadAction<boolean>) {
      state.isGalleryLoading = action.payload
    },
    setIsDeleteProcessing(state, action: PayloadAction<boolean>) {
      state.isDeleteProcessing = action.payload
    },
    setFilesSizeSum(state, action: PayloadAction<number>) {
      state.filesSizeSum = action.payload
    },
    setPreview(state, action: PayloadAction<Preview>) {
      state.preview = action.payload
    },
  },
})

export const {
  addToDSelectedList,
  removeFromDSelectedList,
  setRawFiles,
  setDownloadingFiles,
  updateDOpenMenus,
  clearDSelectedList,
  selectAllD,
  setSearchTags,
  setExcludeTags,
  setMimeTypes,
  clearDownloadingState,
  setGalleryPagination,
  setDLoading,
  setDGalleryLoading,
  setIsDeleteProcessing,
  setFilesSizeSum,
  setPreview,
} = uploadSlice.actions

export default uploadSlice.reducer

export const fetchPhotos =
  (isNameComparison?: boolean, comparisonFolder?: string): AppThunk =>
  (dispatch, getState) => {
    const {
      mainPageReducer,
      folderReducer: { currentFolderInfo },
    } = getState()
    const {
      searchMenu: { searchTags, excludeTags, mimetypes },
      galleryPagination,
    } = mainPageReducer
    const { currentPage, nPerPage } = galleryPagination
    const curSearchTags = isEmpty(searchTags) ? undefined : searchTags
    const curExcludeTags = isEmpty(excludeTags) ? undefined : excludeTags
    const curMimeTypes = isEmpty(mimetypes) ? undefined : mimetypes
    const curFolderPath = currentFolderInfo.currentFolderPath || undefined
    const showSubfolders = currentFolderInfo.showSubfolders
    dispatch(setDGalleryLoading(true))
    mainApi
      .getPhotosByTags(
        currentPage,
        nPerPage,
        curSearchTags,
        curExcludeTags,
        curMimeTypes,
        curFolderPath,
        showSubfolders,
        isNameComparison,
        comparisonFolder
      )
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

export const updatePhotos =
  (updatedObjArr: UpdatedObject[]): AppThunk =>
  dispatch => {
    const addNewPathsArr = (newPathsArr: string[]) => {
      dispatch(setPathsArr(sortBy(identity, newPathsArr)))
      dispatch(setFolderTree(createFolderTree(newPathsArr)))
    }

    dispatch(setDGalleryLoading(true))
    mainApi
      .updatePhotos(updatedObjArr)
      .then(response => {
        const { error, files, newFilePath } = response.data
        error && errorMessage(new Error(error), 'updating files error: ', 0)
        files && newFilePath && successMessage('Files updated successfully')
        newFilePath?.length && addNewPathsArr(newFilePath)
        // files && dispatchNewFiles(files)
      })
      .catch(error => {
        console.log('error', error)
        errorMessage(error.message, 'updating files error: ', 0)
      })
      .finally(() => dispatch(setDGalleryLoading(false)))
  }

export const removeCurrentPhoto = (): AppThunk => (dispatch, getState) => {
  const { dSelectedList, downloadingFiles } = getState().mainPageReducer
  const currentPhotoId = downloadingFiles[dSelectedList[0]]._id
  setIsDeleteProcessing(true)
  mainApi
    .deletePhoto(currentPhotoId)
    .then(({ data: { success, error } }) => {
      success && successMessage('File deleted successfully')
      success && dispatch(fetchPhotos())
      error && errorMessage(new Error(error), 'Deleting file error: ', 0)
    })
    .catch(error => {
      console.log('error', error)
      errorMessage(error.message, 'Deleting file error: ', 0)
    })
    .finally(() => setIsDeleteProcessing(false))
}
