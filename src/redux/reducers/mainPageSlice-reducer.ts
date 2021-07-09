/* eslint functional/immutable-data: 0 */
import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { isEmpty } from 'ramda'

import { DownloadingObject, DownloadingRawObject, GalleryPagination } from '../types'
import { AppThunk } from '../store/store'
import api from '../../api/api'
import { errorMessage } from '../../app/common/notifications'
import { convertDownloadingRawObjectArr } from '../../app/common/utils'

interface State {
  rawFiles: DownloadingRawObject[]
  downloadingFiles: DownloadingObject[]
  dSelectedList: number[]
  dOpenMenus: string[]
  loading: boolean
  searchTags: string[]
  excludeTags: string[]
  galleryPagination: GalleryPagination
}

const initialState: State = {
  rawFiles: [],
  downloadingFiles: [],
  dSelectedList: [],
  dOpenMenus: [],
  loading: false,
  searchTags: [],
  excludeTags: [],
  galleryPagination: {
    currentPage: 1,
    nPerPage: 20,
    resultsCount: 0,
    totalPages: 1,
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
    addToDSelectedList(state, action: PayloadAction<number>) {
      const set = new Set(current(state).dSelectedList)
      set.add(action.payload)
      state.dSelectedList = Array.from(set)
    },
    updateDOpenMenus(state, action: PayloadAction<string[]>) {
      state.dOpenMenus = action.payload
    },
    setDLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    clearDSelectedList(state) {
      state.dSelectedList = []
    },
    selectAllD(state) {
      state.dSelectedList = state.downloadingFiles.map((_, i) => i)
    },
    setGalleryPagination(state, action: PayloadAction<Record<keyof GalleryPagination, number>>) {
      state.galleryPagination = { ...current(state).galleryPagination, ...action.payload }
    },
    clearDownloadingState(state) {
      state.downloadingFiles = []
      state.dSelectedList = []
    },
  },
})

export const {
  addToDSelectedList,
  setRawFiles,
  setDownloadingFiles,
  updateDOpenMenus,
  setDLoading,
  clearDSelectedList,
  selectAllD,
  clearDownloadingState,
  setGalleryPagination,
} = uploadSlice.actions

export default uploadSlice.reducer

export const fetchPhotos = (page?: number): AppThunk => (dispatch, getState) => {
  const currentState = getState().mainPageReducer
  const { searchTags, excludeTags } = currentState
  const { currentPage, nPerPage } = currentState.galleryPagination
  const curSearchTags = isEmpty(searchTags) ? undefined : searchTags
  const curExcludeTags = isEmpty(excludeTags) ? undefined : excludeTags
  api
    .getPhotosByTags(page || currentPage, nPerPage, curSearchTags, curExcludeTags)
    .then(({ data }) => {
      const rawFiles: DownloadingRawObject[] = data?.files || []
      const files: DownloadingObject[] = convertDownloadingRawObjectArr(rawFiles)
      dispatch(setRawFiles(rawFiles))
      dispatch(setDownloadingFiles(files))
      dispatch(setGalleryPagination(data.searchPagination))
    })
    .catch(error => errorMessage(error, 'downloading files error: '))
}
