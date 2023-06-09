import type { AppThunk } from '../../../store/store'
import { mainApi } from '../../../../api/api'
import type { UploadingObject } from '../../../types'
import { errorMessage } from '../../../../app/common/notifications'
import { decreaseCountOfPreviewLoading } from '../uploadSlice'
import { addUploadingFile } from './addUploadingFile'
import { defaultTimeStamp } from '../../../../app/common/utils/date/dateFormats'
import { isVideo } from '../../../../app/common/utils/utils'

export const fetchPhotosPreview =
  (file: any): AppThunk =>
  async dispatch => {
    const { lastModified: changeDate, name, size, type } = file
    await mainApi
      .sendPhoto(file)
      .then(({ data }) => {
        const { preview, tempPath, fullSizeJpg, fullSizeJpgPath, DBFullPathFullSize, DBFullPath } = data
        const uploadingFile: UploadingObject = {
          changeDate,
          name,
          size,
          type,
          fullSizeJpgPath: fullSizeJpg,
          DBFullPathFullSize,
          DBFullPath,
          preview,
          tempPath,
          originalPath: fullSizeJpgPath,
          originalDate: '-',
          keywords: null,
          megapixels: '',
          rating: 0,
          description: '',
          ...(isVideo(type) && { timeStamp: defaultTimeStamp }),
        }
        dispatch(addUploadingFile(uploadingFile))
      })
      .catch(error => errorMessage(error, 'Error when getting Preview: '))
      .finally(() => dispatch(decreaseCountOfPreviewLoading()))
  }
