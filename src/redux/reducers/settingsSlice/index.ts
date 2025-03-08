import { createSlice, current } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface State {
  imagePreviewSlideLimits: {
    min: number
    max: number
  }
  isVideoPreviewMuted: boolean
  unusedKeywords: string[]
}

export const initialState: State = {
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
    settingsReducerSetImagePreviewSlideLimits(state, action: PayloadAction<State['imagePreviewSlideLimits']>) {
      state.imagePreviewSlideLimits = action.payload
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
  settingsReducerSetImagePreviewSlideLimits,
  settingsReducerSetIsVideoPreviewMuted,
  settingsReducerSetMaxPreviewSlideLimit,
  settingsReducerSetMinPreviewSlideLimit,
  settingsReducerSetUnusedKeywords,
} = settingsSlice.actions

export const settingsSliceReducer = settingsSlice.reducer
