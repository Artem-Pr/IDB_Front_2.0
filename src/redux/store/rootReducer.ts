import { combineReducers } from '@reduxjs/toolkit'

import { foldersSliceReducer } from '../reducers/foldersSlice'
import { mainPageSliceReducer } from '../reducers/mainPageSlice'
import { sessionSliceReducer } from '../reducers/sessionSlice'
import { settingsSliceReducer } from '../reducers/settingsSlice'
import { testsSliceReducer } from '../reducers/testsSlice'
import { uploadPageSliceReducer } from '../reducers/uploadSlice'

const rootReducer = combineReducers({
  foldersSliceReducer,
  mainPageSliceReducer,
  sessionSliceReducer,
  settingsSliceReducer,
  testsSliceReducer,
  uploadPageSliceReducer,
})

export default rootReducer
