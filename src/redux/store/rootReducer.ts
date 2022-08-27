import { combineReducers } from '@reduxjs/toolkit'

import foldersSliceReducer from '../reducers/foldersSlice-reducer'
import uploadSliceReducer from '../reducers/uploadSlice-reducer'
import mainPageSliceReducer from '../reducers/mainPageSlice-reducer'
import testsSliceReducer from '../reducers/testsSlice-reducer'
import sessionSliceReducer from '../reducers/sessionSlice-reducer'

const rootReducer = combineReducers({
  folderReducer: foldersSliceReducer,
  uploadReducer: uploadSliceReducer,
  mainPageReducer: mainPageSliceReducer,
  testsReducer: testsSliceReducer,
  sessionSlice: sessionSliceReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
