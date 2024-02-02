import { mainApi } from 'src/api/api'
import { errorMessage } from 'src/app/common/notifications'
import type { AppThunk } from 'src/redux/store/types'

import { setUnusedKeywords } from '../settingsSlice'

export const fetchUnusedKeywordsList = (): AppThunk => async dispatch => {
  mainApi
    .getUnusedKeywordsList()
    .then(({ data }) => {
      dispatch(setUnusedKeywords(data))
    })
    .catch(error => errorMessage(error, 'Error when getting unused keywords list: '))
}
