/* eslint functional/immutable-data: 0 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface State {
  asideMenuWidth: number
  fitContain: boolean
}

const initialState: State = {
  asideMenuWidth: 400,
  fitContain: false,
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
  },
})

export const { setAsideMenuWidth, setFitContain } = sessionSlice.actions

export default sessionSlice.reducer
