import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { PagePaths } from 'src/common/constants'

export const DEFAULT_PREVIEW_SIZE = 150

export interface State {
  asideMenuWidth: number
  currentPage: PagePaths.MAIN | PagePaths.UPLOAD | null
  fitContain: boolean
  isDuplicatesChecking: boolean
  isLoading: boolean
  isTimesDifferenceApplied: boolean
  previewSize: number
}

const initialState: State = {
  asideMenuWidth: 400,
  currentPage: null,
  fitContain: false,
  isDuplicatesChecking: false,
  isLoading: false,
  isTimesDifferenceApplied: false,
  previewSize: DEFAULT_PREVIEW_SIZE,
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
    setCurrentPage(state, action: PayloadAction<PagePaths.MAIN | PagePaths.UPLOAD | null>) {
      state.currentPage = action.payload
    },
    setFitContain(state, action: PayloadAction<boolean>) {
      state.fitContain = action.payload
    },
    setIsDuplicatesChecking(state, action: PayloadAction<boolean>) {
      state.isDuplicatesChecking = action.payload
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setIsTimeDifferenceApplied(state, action: PayloadAction<boolean>) {
      state.isTimesDifferenceApplied = action.payload
    },
    setPreviewSize(state, action: PayloadAction<number>) {
      state.previewSize = action.payload
    },
  },
})

export const {
  refreshPreviewSize,
  setAsideMenuWidth,
  setCurrentPage,
  setFitContain,
  setIsDuplicatesChecking,
  setIsLoading,
  setIsTimeDifferenceApplied,
  setPreviewSize,
} = sessionSlice.actions

export const sessionSliceReducer = sessionSlice.reducer
