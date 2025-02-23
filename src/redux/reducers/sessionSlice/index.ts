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
    sessionReducerRefreshPreviewSize(state) {
      state.previewSize = DEFAULT_PREVIEW_SIZE
    },
    sessionReducerSetAsideMenuWidth(state, action: PayloadAction<number>) {
      state.asideMenuWidth = action.payload
    },
    sessionReducerSetCurrentPage(state, action: PayloadAction<PagePaths.MAIN | PagePaths.UPLOAD | null>) {
      state.currentPage = action.payload
    },
    sessionReducerSetFitContain(state, action: PayloadAction<boolean>) {
      state.fitContain = action.payload
    },
    sessionReducerSetIsDuplicatesChecking(state, action: PayloadAction<boolean>) {
      state.isDuplicatesChecking = action.payload
    },
    sessionReducerSetIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    sessionReducerSetIsTimeDifferenceApplied(state, action: PayloadAction<boolean>) {
      state.isTimesDifferenceApplied = action.payload
    },
    sessionReducerSetPreviewSize(state, action: PayloadAction<number>) {
      state.previewSize = action.payload
    },
  },
})

export const {
  sessionReducerRefreshPreviewSize,
  sessionReducerSetAsideMenuWidth,
  sessionReducerSetCurrentPage,
  sessionReducerSetFitContain,
  sessionReducerSetIsDuplicatesChecking,
  sessionReducerSetIsLoading,
  sessionReducerSetIsTimeDifferenceApplied,
  sessionReducerSetPreviewSize,
} = sessionSlice.actions

export const sessionSliceReducer = sessionSlice.reducer
