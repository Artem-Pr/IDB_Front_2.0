import { useDispatch } from 'react-redux'

import { configureStore } from '@reduxjs/toolkit'

import { saveLocalStorageSession, setDefaultStore } from './localStorageSync'
import rootReducer from './rootReducer'
import type { AppDispatch } from './types'

const store = configureStore({
  reducer: rootReducer,
})

setDefaultStore(store.dispatch)

window.addEventListener('beforeunload', () => {
  const state = store.getState()
  saveLocalStorageSession(state)
})

export const useAppDispatch: () => AppDispatch = useDispatch
export default store
