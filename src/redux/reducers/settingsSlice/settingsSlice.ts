import { createSlice, current } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface State {
  globalLoader: boolean
  imagePreviewSlideLimits: {
    min: number
    max: number
  }
  isFullSizePreview: boolean
  isVideoPreviewMuted: boolean
  savePreview: boolean
  unusedKeywords: string[]
}

export const initialState: State = {
  globalLoader: false,
  imagePreviewSlideLimits: {
    min: 50,
    max: 300,
  },
  isFullSizePreview: false,
  isVideoPreviewMuted: true,
  savePreview: true,
  unusedKeywords: [],
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
    setIsVideoPreviewMuted(state, action: PayloadAction<boolean>) {
      state.isVideoPreviewMuted = action.payload
    },
    deleteUnusedKeywordFromState(state, action: PayloadAction<string>) {
      state.unusedKeywords = current(state).unusedKeywords.filter(keyword => keyword !== action.payload)
    },
  },
})

export const {
  deleteUnusedKeywordFromState,
  setGlobalLoader,
  setIsFullSizePreview,
  setIsVideoPreviewMuted,
  setMaxImagePreviewSlideLimit,
  setMinImagePreviewSlideLimit,
  setSavePreview,
  setUnusedKeywords,
} = settingsSlice.actions

export const settingsSliceReducer = settingsSlice.reducer
