/* eslint functional/immutable-data: 0 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AppThunk } from '../store/store'
import api from '../../api/api'
import { errorMessage } from '../../app/common/notifications'
import { UploadingObject } from '../types'

interface EditGalleryItem {
  isEditOne: boolean
  isEditMany: boolean
}

interface State {
  uploadingFiles: UploadingObject[]
  selectedList: number[]
  edit: EditGalleryItem
}

const initialState: State = {
  uploadingFiles: [],
  selectedList: [],
  edit: {
    isEditOne: false,
    isEditMany: false,
  },
}

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    addUploadingFile(state, action: PayloadAction<UploadingObject>) {
      state.uploadingFiles.push(action.payload)
    },
    addToSelectedList(state, action: PayloadAction<number>) {
      const set = new Set(state.selectedList)
      set.add(action.payload)
      state.selectedList = Array.from(set)
    },
    removeFromSelectedList(state, action: PayloadAction<number>) {
      const set = new Set(state.selectedList)
      set.delete(action.payload)
      state.selectedList = Array.from(set)
    },
    clearSelectedList(state) {
      state.selectedList = []
    },
    clearUploadingState(state) {
      state.uploadingFiles = []
      state.selectedList = []
    },
    setIsEditOne(state, action: PayloadAction<boolean>) {
      state.edit.isEditOne = action.payload
    },
    setIsEditMany(state, action: PayloadAction<boolean>) {
      state.edit.isEditMany = action.payload
    },
  },
})

export const {
  addUploadingFile,
  addToSelectedList,
  clearSelectedList,
  clearUploadingState,
  removeFromSelectedList,
} = uploadSlice.actions

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
