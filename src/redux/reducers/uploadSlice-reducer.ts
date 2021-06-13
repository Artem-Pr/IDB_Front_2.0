/* eslint functional/immutable-data: 0 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { compose, curry } from 'ramda'

import { AppThunk } from '../store/store'
import api from '../../api/api'
import { errorMessage } from '../../app/common/notifications'
import { ExifFilesList, FullExifObj, UploadingObject } from '../types'
import { getUpdatedExifFieldsObj, updateFilesArrItemByField } from '../../app/common/utils'

interface FullExifPayload {
  tempPath: string
  fullExifObj: FullExifObj
}

interface State {
  uploadingFiles: UploadingObject[]
  fullExifFilesList: ExifFilesList
  selectedList: number[]
  openMenus: string[]
}

const initialState: State = {
  uploadingFiles: [],
  fullExifFilesList: {},
  selectedList: [],
  openMenus: ['folders'],
}

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    addUploadingFile(state, action: PayloadAction<UploadingObject>) {
      state.uploadingFiles.push(action.payload)
    },
    updateUploadingFilesArr(state, action: PayloadAction<UploadingObject[]>) {
      state.uploadingFiles = action.payload
    },
    addFullExifFile(state, action: PayloadAction<FullExifPayload>) {
      const { tempPath, fullExifObj } = action.payload
      state.fullExifFilesList[tempPath] = fullExifObj
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
    selectAll(state) {
      state.selectedList = state.uploadingFiles.map((_, i) => i)
    },
    updateOpenMenus(state, action: PayloadAction<string[]>) {
      state.openMenus = action.payload
    },
    removeFromOpenMenus(state, action: PayloadAction<string>) {
      const set = new Set(state.openMenus)
      set.delete(action.payload)
      state.openMenus = Array.from(set)
    },
    clearUploadingState(state) {
      state.uploadingFiles = []
      state.selectedList = []
    },
  },
})

export const {
  addUploadingFile,
  updateUploadingFilesArr,
  addFullExifFile,
  addToSelectedList,
  removeFromSelectedList,
  clearSelectedList,
  selectAll,
  updateOpenMenus,
  removeFromOpenMenus,
  clearUploadingState,
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

export const fetchFullExif = (tempPath: string): AppThunk => (dispatch, getState) => {
  api
    .getKeywordsFromPhoto(tempPath)
    .then(({ data }) => {
      dispatch(addFullExifFile({ tempPath, fullExifObj: data }))

      const { uploadingFiles, fullExifFilesList } = getState().uploadReducer
      const getUpdatingObj = curry(getUpdatedExifFieldsObj)(fullExifFilesList)
      const getUpdatedFilesArr = curry(updateFilesArrItemByField)('tempPath', uploadingFiles)
      const updateUploadingFiles = compose(updateUploadingFilesArr, getUpdatedFilesArr, getUpdatingObj)(tempPath)

      dispatch(updateUploadingFiles)
    })
    .catch(error => errorMessage(error, 'Ошибка при получении данных Exif: '))
}
