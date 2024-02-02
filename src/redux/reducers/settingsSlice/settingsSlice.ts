import { createSlice, current } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface State {
  globalLoader: boolean
  isFullSizePreview: boolean
  savePreview: boolean
  unusedKeywords: string[]
  imagePreviewSlideLimits: {
    min: number
    max: number
  }
}

export const initialState: State = {
  globalLoader: false,
  isFullSizePreview: false,
  savePreview: true,
  unusedKeywords: [],
  imagePreviewSlideLimits: {
    min: 20,
    max: 300,
  },
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setGlobalLoader(state, action: PayloadAction<boolean>) {
      state.globalLoader = action.payload
    },
    setSavePreview(state, action: PayloadAction<boolean>) {
      state.savePreview = action.payload
    },
    setIsFullSizePreview(state, action: PayloadAction<boolean>) {
      state.isFullSizePreview = action.payload
    },
    setMinImagePreviewSlideLimit(state, action: PayloadAction<number>) {
      state.imagePreviewSlideLimits.min = action.payload
    },
    setMaxImagePreviewSlideLimit(state, action: PayloadAction<number>) {
      state.imagePreviewSlideLimits.max = action.payload
    },
    setUnusedKeywords(state, action: PayloadAction<string[]>) {
      state.unusedKeywords = action.payload
    },
    deleteUnusedKeywordFromState(state, action: PayloadAction<string>) {
      state.unusedKeywords = current(state).unusedKeywords.filter(keyword => keyword !== action.payload)
    },
  },
})

export const {
  setGlobalLoader,
  setSavePreview,
  setIsFullSizePreview,
  setMaxImagePreviewSlideLimit,
  setMinImagePreviewSlideLimit,
  setUnusedKeywords,
  deleteUnusedKeywordFromState,
} = settingsSlice.actions

export const settingsSliceReducer = settingsSlice.reducer
