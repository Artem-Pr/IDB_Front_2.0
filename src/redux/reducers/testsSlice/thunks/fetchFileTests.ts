import { omit } from 'ramda'

import { testApi } from 'src/api/api'
import { errorMessage } from 'src/app/common/notifications'
import type { AppThunk } from 'src/redux/store/types'
import type { QueryResponse } from 'src/redux/types'
import type { MatchingNumberOfFilesTest } from 'src/redux/types/testPageTypes'

import { setNumberOfFiles } from '../testsSlice'

export const fetchFileTests = (pid?: number): AppThunk => dispatch => {
  testApi
    .matchNumberOfFiles(Number(pid) || 0)
    .then(({ data }) => {
      data.success
            && dispatch(setNumberOfFiles(omit<MatchingNumberOfFilesTest, keyof QueryResponse>(['error', 'success'], data)))
      data.error
        ? errorMessage(new Error(data.error), 'Test for matching the number of files: Failure', 0)
        : data.progress !== 100 && setTimeout(() => dispatch(fetchFileTests(data.pid)), 500)
    })
    .catch(error => errorMessage(error, 'Error when getting number of files: '))
}
