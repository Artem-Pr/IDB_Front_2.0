import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { MatchingNumberOfFilesTest } from '../../types/testPageTypes'

export interface State {
  firstTest: MatchingNumberOfFilesTest
}

const initialState: State = {
  firstTest: {
    foldersInConfig: 0,
    excessiveFolders__Config_DB: [],
    excessiveFolders__Config_Disk: [],
    foldersInDBFiles: 0,
    excessiveFolders__DB_Config: [],
    excessiveFolders__DB_Disk: [],
    foldersInDirectory: 0,
    excessiveFolders__Disk_Config: [],
    excessiveFolders__Disk_DB: [],
    filesInDB: 0,
    excessiveFiles__DB_Disk: [],
    filesInDirectory: 0,
    excessiveFiles__Disk_DB: [],
    progress: 0,
    pid: 0,
  },
}

const testsSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {
    testsReducerSetNumberOfFiles(state, action: PayloadAction<MatchingNumberOfFilesTest>) {
      state.firstTest = action.payload
    },
    testsReducerRefreshFirstTestPid(state) {
      state.firstTest.pid = 0
    },
  },
})

export const {
  testsReducerSetNumberOfFiles,
  testsReducerRefreshFirstTestPid,
} = testsSlice.actions

export const testsSliceReducer = testsSlice.reducer
