/* eslint functional/immutable-data: 0 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface State {
  asideMenuWidth: number
}

const initialState: State = {
  asideMenuWidth: 400,
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setAsideMenuWidth(state, action: PayloadAction<number>) {
      state.asideMenuWidth = action.payload
    },
  },
})

export const { setAsideMenuWidth } = sessionSlice.actions

export default sessionSlice.reducer
