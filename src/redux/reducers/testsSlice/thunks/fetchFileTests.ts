import { testApi } from 'src/api/requests/api-requests'
import { errorMessage } from 'src/app/common/notifications'
import type { AppThunk } from 'src/redux/store/types'

import { testsReducerSetNumberOfFiles } from '..'

const TIMEOUT_BETWEEN_REQUESTS = 500

export const fetchFileTests = (pid?: number): AppThunk => dispatch => {
  testApi
    .matchNumberOfFiles(Number(pid) || 0)
    .then(({ data }) => {
      dispatch(testsReducerSetNumberOfFiles(data))
      data.progress !== 100 && setTimeout(() => dispatch(fetchFileTests(data.pid)), TIMEOUT_BETWEEN_REQUESTS)
    })
    .catch(error => {
      console.error(error)
      errorMessage(new Error(error), 'Test for matching the number of files: Failure', 0)
    })
}
