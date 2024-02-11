import { mainApi } from '../../../../api/api'
import { errorMessage } from '../../../../app/common/notifications'
import type { AppThunk } from '../../../store/types'
import { updateFullExifFile } from '../mainPageSlice'

export const fetchFullExif = (tempPathArr: string[]): AppThunk => async (dispatch):Promise<void> => {
  await mainApi
    .getKeywordsFromPhoto(tempPathArr)
    .then(({ data }) => {
      dispatch(updateFullExifFile(data))
    })
    .catch(error => {
      errorMessage(error, 'Error when getting Exif: ')
    })
}
