import { mainApi } from '../../../../api/api'
import { errorMessage } from '../../../../app/common/notifications'
import { upload } from '../../../selectors'
import type { AppThunk } from '../../../store/types'
import { ExistedFile } from '../../../types'
import { updateUploadingFilesArr } from '../uploadSlice'

export const fetchDuplicates = (names: string[]): AppThunk => async (dispatch, getState) => {
  await mainApi
    .checkDuplicates(names)
    .then(({ data }) => {
      const { uploadingFiles } = upload(getState())
      const updatedUploadingFiles = uploadingFiles.map(file => {
        const existedFilesArr: ExistedFile[] | undefined = data[file.name]
        return { ...file, existedFilesArr: existedFilesArr || file.existedFilesArr }
      })
      dispatch(updateUploadingFilesArr(updatedUploadingFiles))
    })
    .catch(error => {
      errorMessage(error, 'Error when getting files duplicates: ')
    })
}
