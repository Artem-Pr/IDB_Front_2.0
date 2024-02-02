import { omit } from 'ramda'

import { testApi } from 'src/api/api'
import { errorMessage } from 'src/app/common/notifications'
import type { AppThunk } from 'src/redux/store/types'
import type { QueryResponse } from 'src/redux/types'
import type { MatchingVideoFilesTest } from 'src/redux/types/testPageTypes'

import { setVideoFiles } from '../testsSlice'

export const fetchVideoFileTests = (pid?: number): AppThunk => dispatch => {
  testApi
    .matchVideoFiles(Number(pid) || 0)
    .then(({ data }) => {
      data.success
            && dispatch(setVideoFiles(omit<MatchingVideoFilesTest, keyof QueryResponse>(['error', 'success'], data)))
      data.error
        ? errorMessage(new Error(data.error), 'Test for matching video files: Failure', 0)
        : data.progress !== 100 && setTimeout(() => dispatch(fetchVideoFileTests(data.pid)), 500)
    })
    .catch(error => errorMessage(error, 'Error when getting video files: '))
}
