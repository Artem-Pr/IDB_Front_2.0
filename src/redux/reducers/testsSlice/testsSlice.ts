import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { MatchingNumberOfFilesTest, MatchingVideoFilesTest, RebuildPathsConfigTest } from '../../types/testPageTypes'

export interface State {
  firstTest: MatchingNumberOfFilesTest
  secondTest: MatchingVideoFilesTest
  thirdTest: RebuildPathsConfigTest
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
  secondTest: {
    videoOnDisk: 0,
    excessiveVideo__Disk_DB: [],
    excessiveVideo__Disk_DiskThumbnails: [],
    videoInDB: 0,
    excessiveVideo__DB_Disk: [],
    excessiveVideo__DB_DBThumbnails: [],
    videoThumbnailsOnDisk: 0,
    excessiveVideo__DiskThumbnails_Disk: [],
    excessiveVideo__DiskThumbnails_DBThumbnails: [],
    videoThumbnailsInDB: 0,
    excessiveVideo__DBThumbnails_DiskThumbnails: [],
    excessiveVideo__DBThumbnails_DB: [],
    progress: 0,
    pid: 0,
  },
  thirdTest: {
    progress: 0,
  },
}

const testsSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {
    setNumberOfFiles(state, action: PayloadAction<MatchingNumberOfFilesTest>) {
      state.firstTest = action.payload
    },
    setVideoFiles(state, action: PayloadAction<MatchingVideoFilesTest>) {
      state.secondTest = action.payload
    },
    setThirdTestProgress(state, action: PayloadAction<number>) {
      state.thirdTest.progress = action.payload
    },
    refreshFirstTestPid(state) {
      state.firstTest.pid = 0
    },
    refreshSecondTestPid(state) {
      state.secondTest.pid = 0
    },
  },
})

export const {
  setNumberOfFiles,
  refreshFirstTestPid,
  refreshSecondTestPid,
  setVideoFiles,
  setThirdTestProgress,
} = testsSlice.actions

export const testsSliceReducer = testsSlice.reducer
