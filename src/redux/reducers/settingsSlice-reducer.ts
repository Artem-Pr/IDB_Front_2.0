/* eslint functional/immutable-data: 0 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface State {
  isFullSizePreview: boolean
  imagePreviewSlideLimits: {
    min: number
    max: number
  }
}

export const initialState: State = {
  isFullSizePreview: false,
  imagePreviewSlideLimits: {
    min: 20,
    max: 300,
  },
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setIsFullSizePreview(state, action: PayloadAction<boolean>) {
      state.isFullSizePreview = action.payload
    },
    setMinImagePreviewSlideLimit(state, action: PayloadAction<number>) {
      state.imagePreviewSlideLimits.min = action.payload
    },
    setMaxImagePreviewSlideLimit(state, action: PayloadAction<number>) {
      state.imagePreviewSlideLimits.max = action.payload
    },
  },
})

export const { setIsFullSizePreview, setMaxImagePreviewSlideLimit, setMinImagePreviewSlideLimit } =
  settingsSlice.actions

export default settingsSlice.reducer
