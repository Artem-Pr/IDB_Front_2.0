import type { RcFile } from 'antd/es/upload'

import { mainApi } from 'src/api/api'
import type { Media } from 'src/api/models/media'
import { MediaInstance } from 'src/api/models/media'
import { errorMessage } from 'src/app/common/notifications'
import imagePlaceholderFailedUploading from 'src/assets/svg-icons-html/image-placeholder-failed-upload3.svg'
import type { AppThunk } from 'src/redux/store/types'

import { decreaseCountOfPreviewLoading } from '../uploadSlice'

import { updateUploadingFile } from './updateUploadingFile'

export const fetchPhotosPreview = (file: RcFile): AppThunk => async dispatch => {
  await mainApi
    .savePhotoInTempPool(file)
    .then(({ data }) => {
      dispatch(updateUploadingFile(data.properties, file))
    })
    .catch(error => {
      errorMessage(error, 'Error when getting Preview: ')
      dispatch(updateUploadingFile(new MediaInstance({
        id: file.name,
        originalName: file.name as Media['originalName'],
        mimetype: file.type as Media['mimetype'],
        staticPreview: imagePlaceholderFailedUploading,
        size: file.size,
      }).properties, file))
    })
    .finally(() => dispatch(decreaseCountOfPreviewLoading()))
}
