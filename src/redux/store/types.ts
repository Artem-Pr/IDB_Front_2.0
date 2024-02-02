import type { Action } from '@reduxjs/toolkit'
import type { ThunkAction } from 'redux-thunk'

import rootReducer from './rootReducer'
import store from './store'

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>
