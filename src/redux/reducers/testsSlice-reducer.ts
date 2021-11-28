/* eslint functional/immutable-data: 0 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { omit } from 'ramda'

import { MatchingNumberOfFilesTest, MatchingVideoFilesTest } from '../types/testPageTypes'
import { AppThunk } from '../store/store'
import { testApi } from '../../api/api'
import { errorMessage } from '../../app/common/notifications'
import { QueryResponse } from '../types'

interface State {
  firstTest: MatchingNumberOfFilesTest
  secondTest: MatchingVideoFilesTest
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
    refreshFirstTestPid(state) {
      state.firstTest.pid = 0
    },
    refreshSecondTestPid(state) {
      state.secondTest.pid = 0
    },
  },
})

export const { setNumberOfFiles, refreshFirstTestPid, refreshSecondTestPid, setVideoFiles } = testsSlice.actions

export default testsSlice.reducer

export const fetchFileTests =
  (pid?: number): AppThunk =>
  dispatch => {
    testApi
      .matchNumberOfFiles(Number(pid) || 0)
      .then(({ data }) => {
        console.log('data.pid', data.pid)
        data.success &&
          dispatch(setNumberOfFiles(omit<MatchingNumberOfFilesTest, keyof QueryResponse>(['error', 'success'], data)))
        data.error
          ? errorMessage(new Error(data.error), 'Test for matching the number of files: Failure', 0)
          : data.progress !== 100 && setTimeout(() => dispatch(fetchFileTests(data.pid)), 500)
      })
      .catch(error => errorMessage(error, 'Error when getting number of files: '))
  }

export const fetchVideoFileTests =
  (pid?: number): AppThunk =>
  dispatch => {
    testApi
      .matchVideoFiles(Number(pid) || 0)
      .then(({ data }) => {
        console.log('data.pid', data.pid)
        data.success &&
          dispatch(setVideoFiles(omit<MatchingVideoFilesTest, keyof QueryResponse>(['error', 'success'], data)))
        data.error
          ? errorMessage(new Error(data.error), 'Test for matching video files: Failure', 0)
          : data.progress !== 100 && setTimeout(() => dispatch(fetchVideoFileTests(data.pid)), 500)
      })
      .catch(error => errorMessage(error, 'Error when getting video files: '))
  }
