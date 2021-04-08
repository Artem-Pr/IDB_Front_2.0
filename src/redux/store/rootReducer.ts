import { combineReducers } from '@reduxjs/toolkit'

import foldersSliceReducer from '../reducers/foldersSlice-reducer'

const rootReducer = combineReducers({
  folderReducer: foldersSliceReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
