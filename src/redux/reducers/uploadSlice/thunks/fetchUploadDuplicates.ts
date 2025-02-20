import { mainApi } from 'src/api/api'
import type { Media } from 'src/api/models/media'
import type { DuplicateFile } from 'src/api/types/types'
import { errorMessage } from 'src/app/common/notifications'
import { uploadingFiles } from 'src/redux/selectors'
import type { AppThunk } from 'src/redux/store/types'

import { updateUploadingFilesArr } from '../uploadSlice'

export const fetchUploadDuplicates = (
  originalNameList: Media['originalName'][],
): AppThunk => async (dispatch, getState) => {
  await mainApi
    .checkDuplicates(originalNameList)
    .then(({ data }) => {
      const uploadingFilesArr = uploadingFiles(getState())
      const updatedUploadingFiles: Media[] = uploadingFilesArr.map(file => {
        const existedFilesArr = data[file.originalName] as DuplicateFile[] | undefined

        if (existedFilesArr) {
          return { ...file, duplicates: existedFilesArr }
        }
        return file
      })
      dispatch(updateUploadingFilesArr(updatedUploadingFiles))
    })
    .catch(error => {
      errorMessage(error, 'Error when getting files duplicates: ')
    })
}
