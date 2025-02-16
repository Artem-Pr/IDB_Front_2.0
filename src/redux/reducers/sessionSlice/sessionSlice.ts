import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { PagePaths } from 'src/common/constants'

export const DEFAULT_PREVIEW_SIZE = 150

export interface State {
  asideMenuWidth: number
  fitContain: boolean
  previewSize: number
  isTimesDifferenceApplied: boolean
  isLoading: boolean
  currentPage: PagePaths.MAIN | PagePaths.UPLOAD | null
}

const initialState: State = {
  asideMenuWidth: 400,
  fitContain: false,
  previewSize: DEFAULT_PREVIEW_SIZE,
  isTimesDifferenceApplied: false,
  isLoading: false,
  currentPage: null,
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    refreshPreviewSize(state) {
      state.previewSize = DEFAULT_PREVIEW_SIZE
    },
    setAsideMenuWidth(state, action: PayloadAction<number>) {
      state.asideMenuWidth = action.payload
    },
    setFitContain(state, action: PayloadAction<boolean>) {
      state.fitContain = action.payload
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setIsTimeDifferenceApplied(state, action: PayloadAction<boolean>) {
      state.isTimesDifferenceApplied = action.payload
    },
    setCurrentPage(state, action: PayloadAction<PagePaths.MAIN | PagePaths.UPLOAD | null>) {
      state.currentPage = action.payload
    },
    setPreviewSize(state, action: PayloadAction<number>) {
      state.previewSize = action.payload
    },
  },
})

export const {
  refreshPreviewSize,
  setAsideMenuWidth,
  setFitContain,
  setIsLoading,
  setIsTimeDifferenceApplied,
  setCurrentPage,
  setPreviewSize,
} = sessionSlice.actions

export const sessionSliceReducer = sessionSlice.reducer
