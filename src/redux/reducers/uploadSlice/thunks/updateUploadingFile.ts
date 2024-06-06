import type { RcFile } from 'antd/es/upload'

import type { Media } from 'src/api/models/media'
import { getISOStringWithUTC } from 'src/app/common/utils/date'

import { upload } from '../../../selectors'
import type { AppThunk } from '../../../store/types'
import { setIsLoading } from '../../sessionSlice/sessionSlice'
import { updateUploadingFilesArr } from '../uploadSlice'

export const updateUploadingFile = (uploadingFile: Media, fileBlob: RcFile): AppThunk => (dispatch, getState) => {
  const { uploadingFiles } = upload(getState())
  const updatedUploadingFiles = uploadingFiles.map(
    file => (file.originalName === uploadingFile.originalName
      ? {
        ...uploadingFile,
        changeDate: getISOStringWithUTC(fileBlob.lastModified),
      }
      : file),
  )
  dispatch(updateUploadingFilesArr(updatedUploadingFiles))

  const isLastFile = updatedUploadingFiles.every(({ staticPreview }) => Boolean(staticPreview))
  isLastFile && dispatch(setIsLoading(false))
}
