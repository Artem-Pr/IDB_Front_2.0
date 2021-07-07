import { combineReducers } from '@reduxjs/toolkit'

import foldersSliceReducer from '../reducers/foldersSlice-reducer'
import uploadSliceReducer from '../reducers/uploadSlice-reducer'
import mainPageSliceReducer from '../reducers/mainPageSlice-reducer'

const rootReducer = combineReducers({
  folderReducer: foldersSliceReducer,
  uploadReducer: uploadSliceReducer,
  mainPageReducer: mainPageSliceReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
