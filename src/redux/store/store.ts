import { configureStore } from '@reduxjs/toolkit'
import type { Action } from '@reduxjs/toolkit'
import type { ThunkAction } from 'redux-thunk'

import { useDispatch } from 'react-redux'

import rootReducer, { RootState } from './rootReducer'
import { setDefaultStore } from './setDefaultStore'
import { settingsMiddleware } from './middlewares/setSettingsToLocalStorage'

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(settingsMiddleware),
})

setDefaultStore(store.dispatch)

export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>
export const useAppDispatch: () => AppDispatch = useDispatch
export default store
