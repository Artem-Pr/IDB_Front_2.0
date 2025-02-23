import { createSlice, current } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface State {
  globalLoader: boolean
  imagePreviewSlideLimits: {
    min: number
    max: number
  }
  isVideoPreviewMuted: boolean
  unusedKeywords: string[]
}

export const initialState: State = {
  globalLoader: false,
  imagePreviewSlideLimits: {
    min: 50,
    max: 300,
  },
  isVideoPreviewMuted: true,
  unusedKeywords: [],
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    settingsReducerSetGlobalLoader(state, action: PayloadAction<boolean>) {
      state.globalLoader = action.payload
    },
    settingsReducerSetMinPreviewSlideLimit(state, action: PayloadAction<number>) {
      state.imagePreviewSlideLimits.min = action.payload
    },
    settingsReducerSetMaxPreviewSlideLimit(state, action: PayloadAction<number>) {
      state.imagePreviewSlideLimits.max = action.payload
    },
    settingsReducerSetUnusedKeywords(state, action: PayloadAction<string[]>) {
      state.unusedKeywords = action.payload
    },
    settingsReducerSetIsVideoPreviewMuted(state, action: PayloadAction<boolean>) {
      state.isVideoPreviewMuted = action.payload
    },
    settingsReducerDeleteUnusedKeyword(state, action: PayloadAction<string>) {
      state.unusedKeywords = current(state).unusedKeywords.filter(keyword => keyword !== action.payload)
    },
  },
})

export const {
  settingsReducerDeleteUnusedKeyword,
  settingsReducerSetGlobalLoader,
  settingsReducerSetIsVideoPreviewMuted,
  settingsReducerSetMaxPreviewSlideLimit,
  settingsReducerSetMinPreviewSlideLimit,
  settingsReducerSetUnusedKeywords,
} = settingsSlice.actions

export const settingsSliceReducer = settingsSlice.reducer
