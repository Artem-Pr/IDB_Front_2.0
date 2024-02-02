import { combineReducers } from '@reduxjs/toolkit'

import { foldersSliceReducer } from '../reducers/foldersSlice'
import { mainPageReducer } from '../reducers/mainPageSlice'
import { sessionSliceReducer } from '../reducers/sessionSlice'
import { settingsSliceReducer } from '../reducers/settingsSlice'
import { testsSliceReducer } from '../reducers/testsSlice/testsSlice'
import { uploadPageReducer } from '../reducers/uploadSlice'

const rootReducer = combineReducers({
  folderReducer: foldersSliceReducer,
  uploadReducer: uploadPageReducer,
  mainPageReducer,
  testsReducer: testsSliceReducer,
  sessionSlice: sessionSliceReducer,
  settingSlice: settingsSliceReducer,
})

export default rootReducer
