import { mainApi } from 'src/api/api'
import { errorMessage } from 'src/app/common/notifications'
import type { AppThunk } from 'src/redux/store/types'

import { setKeywordsList } from '../foldersSlice'

export const fetchKeywordsList = (): AppThunk => dispatch => {
  mainApi
    .getKeywordsList()
    .then(({ data }) => data.length && dispatch(setKeywordsList(data)))
    .catch(error => errorMessage(error, 'Error when getting Keywords List: '))
}
