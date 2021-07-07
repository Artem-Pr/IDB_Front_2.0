/* eslint functional/immutable-data: 0 */
import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'

import { DownloadingObject } from '../types'

interface State {
  downloadingFiles: DownloadingObject[]
  dSelectedList: number[]
  dOpenMenus: string[]
  loading: boolean
}

const initialState: State = {
  downloadingFiles: [],
  dSelectedList: [],
  dOpenMenus: [],
  loading: false,
}

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
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
    clearDownloadingState(state) {
      state.downloadingFiles = []
      state.dSelectedList = []
    },
  },
})

export const {
  addToDSelectedList,
  setDownloadingFiles,
  updateDOpenMenus,
  setDLoading,
  clearDSelectedList,
  selectAllD,
  clearDownloadingState,
} = uploadSlice.actions

export default uploadSlice.reducer
