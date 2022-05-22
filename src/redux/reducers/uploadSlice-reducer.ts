/* eslint functional/immutable-data: 0 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { compose, curry, keys, reduce } from 'ramda'

import { AppThunk } from '../store/store'
import { mainApi } from '../../api/api'
import { errorMessage } from '../../app/common/notifications'
import { ExifFilesList, FullExifObj, LoadingStatus, UploadingObject } from '../types'
import { getUpdatedExifFieldsObj, updateFilesArrItemByField } from '../../app/common/utils'
import { sortByField } from '../../app/common/utils/utils'

interface FullExifPayload {
  tempPath: string
  fullExifObj: FullExifObj
}

interface State {
  uploadingFiles: UploadingObject[]
  fullExifFilesList: ExifFilesList
  selectedList: number[]
  openMenus: string[]
  isExifLoading: boolean
  uploadingStatus: LoadingStatus
}

const initialState: State = {
  uploadingFiles: [],
  fullExifFilesList: {},
  selectedList: [],
  openMenus: ['folders'],
  isExifLoading: false,
  uploadingStatus: 'empty',
}

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    updateUploadingFilesArr(state, action: PayloadAction<UploadingObject[]>) {
      state.uploadingFiles = action.payload
    },
    addFullExifFile(state, action: PayloadAction<FullExifPayload>) {
      const { tempPath, fullExifObj } = action.payload
      state.fullExifFilesList[tempPath] = fullExifObj
    },
    updateFullExifFile(state, action: PayloadAction<ExifFilesList>) {
      state.fullExifFilesList = { ...state.fullExifFilesList, ...action.payload }
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
      state.fullExifFilesList = {}
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isExifLoading = action.payload
    },
    setUploadingStatus(state, action: PayloadAction<LoadingStatus>) {
      state.uploadingStatus = action.payload
    },
  },
})

export const {
  updateUploadingFilesArr,
  addFullExifFile,
  updateFullExifFile,
  addToSelectedList,
  removeFromSelectedList,
  clearSelectedList,
  selectAll,
  updateOpenMenus,
  removeFromOpenMenus,
  clearUploadingState,
  setLoading,
  setUploadingStatus,
} = uploadSlice.actions

export default uploadSlice.reducer

const addUploadingFile =
  (uploadingFile: UploadingObject): AppThunk =>
  (dispatch, getState) => {
    const { uploadingFiles } = getState().uploadReducer
    const updatedUploadingFiles = sortByField<UploadingObject>('name')([...uploadingFiles, uploadingFile])
    dispatch(updateUploadingFilesArr(updatedUploadingFiles))
  }

export const uploadFiles =
  (filesArr: UploadingObject[], folderPath: string): AppThunk =>
  dispatch => {
    mainApi
      .sendPhotos(filesArr, folderPath)
      .then(({ data: { success, error } }) => {
        success && dispatch(setUploadingStatus('success'))
        error && dispatch(setUploadingStatus('error')) && errorMessage(new Error(error), 'Upload files error', 0)
      })
      .catch(error => {
        dispatch(setUploadingStatus('error'))
        console.error('Error when getting Preview: ' + error)
      })
  }

export const fetchPhotosPreview =
  (file: any): AppThunk =>
  dispatch => {
    const { lastModified: changeDate, name, size, type } = file
    mainApi
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
      .catch(error => errorMessage(error, 'Error when getting Preview: '))
  }

export const fetchFullExif =
  (tempPathArr: string[]): AppThunk =>
  async (dispatch, getState) => {
    await mainApi
      .getKeywordsFromPhoto(tempPathArr)
      .then(({ data }) => {
        dispatch(updateFullExifFile(data))

        const { uploadingFiles, fullExifFilesList } = getState().uploadReducer
        const getUpdatingObj = curry(getUpdatedExifFieldsObj)(fullExifFilesList)

        const loadExifToUploadingFiles = (acc: UploadingObject[], tempPath: string): UploadingObject[] => {
          const loadUpdatingObjToFilesArr = curry(updateFilesArrItemByField)('tempPath')(acc)
          return compose(loadUpdatingObjToFilesArr, getUpdatingObj)(tempPath)
        }

        const getUploadingFiles = (tempPathArr: string[]) => {
          return reduce<string, UploadingObject[]>(loadExifToUploadingFiles, uploadingFiles, tempPathArr)
        }
        const uploadingFilesArr = compose(getUploadingFiles, keys)(data)
        dispatch(updateUploadingFilesArr(uploadingFilesArr))
      })
      .catch(error => {
        errorMessage(error, 'Error when getting Exif: ')
      })
  }

export const removeFileFromUploadState = (): AppThunk => (dispatch, getState) => {
  const { uploadingFiles, selectedList } = getState().uploadReducer
  const filteredUploadingFiles = uploadingFiles.filter((_, idx) => !selectedList.includes(idx))
  dispatch(updateUploadingFilesArr(filteredUploadingFiles))
  dispatch(clearSelectedList())
}
