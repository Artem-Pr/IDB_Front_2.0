import type { RcFile } from 'antd/es/upload'

import type { Media } from 'src/api/models/media'
import { getISOStringWithUTC } from 'src/app/common/utils/date'

import { uploadReducerSetFilesArr } from '..'
import type { AppThunk } from '../../../store/types'
import { sessionReducerSetIsLoading } from '../../sessionSlice'
import { getUploadReducerFilesArr } from '../selectors'

export const updateUploadingFile = (uploadingFile: Media, fileBlob: RcFile): AppThunk => (dispatch, getState) => {
  const uploadingFiles = getUploadReducerFilesArr(getState())
  const updatedUploadingFiles = uploadingFiles.map(
    file => (file.originalName === uploadingFile.originalName
      ? {
        ...uploadingFile,
        changeDate: getISOStringWithUTC(fileBlob.lastModified),
      }
      : file),
  )
  dispatch(uploadReducerSetFilesArr(updatedUploadingFiles))

  const isLastFile = updatedUploadingFiles.every(({ staticPreview }) => Boolean(staticPreview))
  isLastFile && dispatch(sessionReducerSetIsLoading(false))
}
