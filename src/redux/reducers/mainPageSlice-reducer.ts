/* eslint functional/immutable-data: 0 */
import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { isEmpty } from 'ramda'

import { DownloadingObject, DownloadingRawObject, GalleryPagination, UpdatedObject } from '../types'
import { AppThunk } from '../store/store'
import api from '../../api/api'
import { errorMessage } from '../../app/common/notifications'
import { convertDownloadingRawObjectArr } from '../../app/common/utils'

interface State {
  rawFiles: DownloadingRawObject[]
  downloadingFiles: DownloadingObject[]
  dSelectedList: number[]
  dOpenMenus: string[]
  searchTags: string[]
  excludeTags: string[]
  galleryPagination: GalleryPagination
  isExifLoading: boolean
  isGalleryLoading: boolean
}

const initialState: State = {
  rawFiles: [],
  downloadingFiles: [],
  dSelectedList: [],
  dOpenMenus: [],
  searchTags: [],
  excludeTags: [],
  galleryPagination: {
    currentPage: 1,
    nPerPage: 20,
    resultsCount: 0,
    totalPages: 1,
  },
  isExifLoading: false,
  isGalleryLoading: false,
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
    addToDSelectedList(state, action: PayloadAction<number>) {
      const set = new Set(current(state).dSelectedList)
      set.add(action.payload)
      state.dSelectedList = Array.from(set)
    },
    removeFromDSelectedList(state, action: PayloadAction<number>) {
      const set = new Set(state.dSelectedList)
      set.delete(action.payload)
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
    setGalleryPagination(
      state,
      action: PayloadAction<{ currentPage?: number; nPerPage?: number; resultsCount?: number; totalPages?: number }>
    ) {
      state.galleryPagination = { ...current(state).galleryPagination, ...action.payload }
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
  clearDownloadingState,
  setGalleryPagination,
  setDLoading,
  setDGalleryLoading,
} = uploadSlice.actions

export default uploadSlice.reducer

export const fetchPhotos = (page?: number): AppThunk => (dispatch, getState) => {
  const currentState = getState().mainPageReducer
  const { searchTags, excludeTags } = currentState
  const { currentPage, nPerPage } = currentState.galleryPagination
  const curSearchTags = isEmpty(searchTags) ? undefined : searchTags
  const curExcludeTags = isEmpty(excludeTags) ? undefined : excludeTags
  dispatch(setDGalleryLoading(true))
  api
    .getPhotosByTags(page || currentPage, nPerPage, curSearchTags, curExcludeTags)
    .then(({ data }) => {
      const rawFiles: DownloadingRawObject[] = data?.files || []
      const files: DownloadingObject[] = convertDownloadingRawObjectArr(rawFiles)
      dispatch(clearDSelectedList())
      dispatch(setRawFiles(rawFiles))
      dispatch(setDownloadingFiles(files))
      dispatch(setGalleryPagination(data.searchPagination))
    })
    .catch(error => errorMessage(error, 'downloading files error: '))
    .finally(() => dispatch(setDGalleryLoading(false)))
}

export const updatePhotos = (updatedObjArr: UpdatedObject[]): AppThunk => dispatch => {
  dispatch(setDGalleryLoading(true))
  api
    .updatePhotos(updatedObjArr)
    .then(response => {
      response.data?.error && errorMessage(new Error(response.data.error), 'updating files error: ', 0)
    })
    .catch(error => {
      console.log('error', error)
      errorMessage(error.error, 'updating files error: ')
    })
    .finally(() => dispatch(setDGalleryLoading(false)))
}
