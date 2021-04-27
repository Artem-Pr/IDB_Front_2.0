/* eslint functional/immutable-data: 0 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AppThunk } from '../store/store'
import api from '../../api/api'
import { errorMessage } from '../../app/common/notifications'
import { UploadingObject } from '../types'

interface State {
  uploadingFiles: UploadingObject[]
}

const initialState: State = {
  uploadingFiles: [],
}

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    addUploadingFile(state, action: PayloadAction<UploadingObject>) {
      state.uploadingFiles.push(action.payload)
    },
  },
})

export const { addUploadingFile } = uploadSlice.actions

export default uploadSlice.reducer

export const fetchPhotosPreview = (file: any): AppThunk => dispatch => {
  const { lastModified: changeDate, name, size, type } = file
  api
    .sendPhoto(file)
    .then(({ data }) => {
      const { preview, tempPath } = data
      const uploadingFile: UploadingObject = {
        changeDate,
        name,
        size,
        type,
        preview,
        tempPath,
        originalDate: '-',
        keywords: null,
        megapixels: '',
      }
      dispatch(addUploadingFile(uploadingFile))
    })
    .catch(error => errorMessage(error, 'Ошибка при получении Превью: '))
}
