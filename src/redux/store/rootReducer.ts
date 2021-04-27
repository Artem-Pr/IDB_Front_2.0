import { combineReducers } from '@reduxjs/toolkit'

import foldersSliceReducer from '../reducers/foldersSlice-reducer'
import uploadSliceReducer from '../reducers/uploadSlice-reducer'

const rootReducer = combineReducers({
  folderReducer: foldersSliceReducer,
  uploadReducer: uploadSliceReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
