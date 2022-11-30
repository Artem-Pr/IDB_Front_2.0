import { combineReducers } from '@reduxjs/toolkit'

import foldersSliceReducer from '../reducers/foldersSlice-reducer'
import uploadSliceReducer from '../reducers/uploadSlice-reducer'
import { mainPageReducer } from '../reducers/mainPageSlice'
import testsSliceReducer from '../reducers/testsSlice-reducer'
import sessionSliceReducer from '../reducers/sessionSlice-reducer'
import settingsSliceReducer from '../reducers/settingsSlice-reducer'

const rootReducer = combineReducers({
  folderReducer: foldersSliceReducer,
  uploadReducer: uploadSliceReducer,
  mainPageReducer,
  testsReducer: testsSliceReducer,
  sessionSlice: sessionSliceReducer,
  settingSlice: settingsSliceReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
