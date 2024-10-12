import { mainApi } from 'src/api/api'
import type { Media } from 'src/api/models/media'
import type { DuplicateFile } from 'src/api/types/types'
import { errorMessage } from 'src/app/common/notifications'
import { upload } from 'src/redux/selectors'
import type { AppThunk } from 'src/redux/store/types'

import { updateUploadingFilesArr } from '../uploadSlice'

export const fetchDuplicates = (originalNameList: Media['originalName'][]): AppThunk => async (dispatch, getState) => {
  await mainApi
    .checkDuplicates(originalNameList)
    .then(({ data }) => {
      const { uploadingFiles } = upload(getState())
      const updatedUploadingFiles: Media[] = uploadingFiles.map(file => {
        const existedFilesArr: DuplicateFile[] | undefined = data[file.originalName]
        return { ...file, duplicates: existedFilesArr || file.duplicates }
      })
      dispatch(updateUploadingFilesArr(updatedUploadingFiles))
    })
    .catch(error => {
      errorMessage(error, 'Error when getting files duplicates: ')
    })
}
