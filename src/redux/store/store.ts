import { useDispatch } from 'react-redux'

import { configureStore } from '@reduxjs/toolkit'

import { settingsMiddleware } from './middlewares/setSettingsToLocalStorage'
import rootReducer from './rootReducer'
import { setDefaultStore } from './setDefaultStore'
import type { AppDispatch } from './types'

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware()
    .prepend(settingsMiddleware),
})

setDefaultStore(store.dispatch)

export const useAppDispatch: () => AppDispatch = useDispatch
export default store
