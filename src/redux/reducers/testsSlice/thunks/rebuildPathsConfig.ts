import { testApi } from 'src/api/api'
import { errorMessage } from 'src/app/common/notifications'
import type { AppThunk } from 'src/redux/store/types'

import { setThirdTestProgress } from '../testsSlice'

export const rebuildPathsConfig = (): AppThunk => dispatch => {
  testApi
    .rebuildFoldersConfig()
    .then(({ data }) => {
      data.success && dispatch(setThirdTestProgress(100))
      data.error && errorMessage(new Error(data.error), 'Rebuild paths config: Failure', 0)
    })
    .catch(error => errorMessage(error, 'Error when rebuild paths config: '))
}
