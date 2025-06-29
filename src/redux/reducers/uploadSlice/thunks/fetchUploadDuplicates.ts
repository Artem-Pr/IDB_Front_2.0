import type { Media } from 'src/api/models/media'
import { mainApi } from 'src/api/requests/api-requests'
import type { DuplicateFile } from 'src/api/types/types'
import { errorMessage } from 'src/app/common/notifications'
import type { AppThunk } from 'src/redux/store/types'

import { uploadReducerSetFilesArr } from '..'
import { getUploadReducerFilesArr } from '../selectors'

export const fetchUploadDuplicates = (
  originalNameList: Media['originalName'][],
): AppThunk => async (dispatch, getState) => {
  await mainApi
    .checkDuplicates(originalNameList)
    .then(({ data }) => {
      const uploadingFilesArr = getUploadReducerFilesArr(getState())
      const updatedUploadingFiles: Media[] = uploadingFilesArr.map(file => {
        const existedFilesArr = data[file.originalName] as DuplicateFile[] | undefined

        if (existedFilesArr) {
          return { ...file, duplicates: existedFilesArr }
        }
        return file
      })
      dispatch(uploadReducerSetFilesArr(updatedUploadingFiles))
    })
    .catch(error => {
      errorMessage(error, 'Error when getting files duplicates: ')
    })
}
