/* eslint functional/immutable-data: 0 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const DEFAULT_PREVIEW_SIZE = 150

interface State {
  asideMenuWidth: number
  fitContain: boolean
  previewSize: number
  isTimesDifferenceApplied: boolean
}

const initialState: State = {
  asideMenuWidth: 400,
  fitContain: false,
  previewSize: DEFAULT_PREVIEW_SIZE,
  isTimesDifferenceApplied: false,
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setAsideMenuWidth(state, action: PayloadAction<number>) {
      state.asideMenuWidth = action.payload
    },
    setFitContain(state, action: PayloadAction<boolean>) {
      state.fitContain = action.payload
    },
    setPreviewSize(state, action: PayloadAction<number>) {
      state.previewSize = action.payload
    },
    refreshPreviewSize(state) {
      state.previewSize = DEFAULT_PREVIEW_SIZE
    },
    setIsTimeDifferenceApplied(state, action: PayloadAction<boolean>) {
      state.isTimesDifferenceApplied = action.payload
    },
  },
})

export const { setAsideMenuWidth, setFitContain, setPreviewSize, refreshPreviewSize, setIsTimeDifferenceApplied } =
  sessionSlice.actions

export default sessionSlice.reducer
