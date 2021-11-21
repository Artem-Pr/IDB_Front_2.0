/* eslint functional/immutable-data: 0 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { omit } from 'ramda'

import { TestType } from '../types/testPageTypes'
import { AppThunk } from '../store/store'
import { testApi } from '../../api/api'
import { errorMessage } from '../../app/common/notifications'
import { QueryResponse } from '../types'

interface State {
  firstTest: TestType
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
    setNumberOfFiles(state, action: PayloadAction<TestType>) {
      state.firstTest = action.payload
    },
    refreshPid(state) {
      state.firstTest.pid = 0
    },
  },
})

export const { setNumberOfFiles, refreshPid } = testsSlice.actions

export default testsSlice.reducer

export const fetchPathsList =
  (pid?: number): AppThunk =>
  dispatch => {
    testApi
      .matchNumberOfFiles(Number(pid) || 0)
      .then(({ data }) => {
        console.log('data.pid', data.pid)
        data.success && dispatch(setNumberOfFiles(omit<TestType, keyof QueryResponse>(['error', 'success'], data)))
        data.error
          ? errorMessage(new Error(data.error), 'Test for matching the number of files: Failure', 0)
          : data.progress !== 100 && setTimeout(() => dispatch(fetchPathsList(data.pid)), 500)
      })
      .catch(error => errorMessage(error, 'Error when getting Paths: '))
  }
