import { mainApi } from 'src/api/api'
import { successMessage, errorMessage } from 'src/app/common/notifications'
import type { AppThunk } from 'src/redux/store/types'

import { deleteUnusedKeywordFromState } from '../settingsSlice'

export const deleteUnusedKeyword = (keyword: string): AppThunk => dispatch => {
  mainApi
    .removeKeyword(keyword)
    .then(() => {
      dispatch(deleteUnusedKeywordFromState(keyword))
      successMessage('The unused keyword has been deleted')
    })
    .catch(error => errorMessage(error, 'Error when removing unused keyword: '))
}
