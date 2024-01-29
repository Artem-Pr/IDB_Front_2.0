import type { AppThunk } from '../../../store/store'
import { mainApi } from '../../../../api/api'
import type { UploadingObject } from '../../../types'
import { errorMessage } from '../../../../app/common/notifications'
import { decreaseCountOfPreviewLoading } from '../uploadSlice'
import { defaultTimeStamp } from '../../../../app/common/utils/date/dateFormats'
import { isVideo } from '../../../../app/common/utils/utils'
import { updateUploadingFile } from './updateUploadingFile'

export const fetchPhotosPreview =
  (file: any): AppThunk =>
  async dispatch => {
    const { lastModified: changeDate, name, size, type } = file
    await mainApi
      .sendPhoto(file)
      .then(({ data }) => {
        const { preview, tempPath, fullSizeJpg, fullSizeJpgPath, DBFullPathFullSize, DBFullPath, existedFilesArr } =
          data
        const uploadingFile: UploadingObject = {
          DBFullPath,
          DBFullPathFullSize,
          changeDate,
          description: '',
          existedFilesArr,
          fullSizeJpgPath: fullSizeJpg,
          keywords: null,
          megapixels: '',
          name,
          originalDate: '-',
          originalPath: fullSizeJpgPath,
          preview,
          rating: 0,
          size,
          tempPath,
          type,
          ...(isVideo(type) && { timeStamp: defaultTimeStamp }),
        }
        dispatch(updateUploadingFile(uploadingFile))
      })
      .catch(error => errorMessage(error, 'Error when getting Preview: '))
      .finally(() => dispatch(decreaseCountOfPreviewLoading()))
  }
