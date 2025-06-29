import { mainApi } from 'src/api/requests/api-requests'
import { successMessage, errorMessage } from 'src/app/common/notifications'
import type { AppThunk } from 'src/redux/store/types'

import { settingsReducerDeleteUnusedKeyword } from '..'

export const deleteUnusedKeyword = (keyword: string): AppThunk => dispatch => {
  mainApi
    .removeKeyword(keyword)
    .then(() => {
      dispatch(settingsReducerDeleteUnusedKeyword(keyword))
      successMessage('The unused keyword has been deleted')
    })
    .catch(error => errorMessage(error, 'Error when removing unused keyword: '))
}
