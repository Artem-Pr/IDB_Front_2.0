/* eslint functional/immutable-data: 0 */
import { createSlice, current } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { AppThunk } from '../store/store'
import { mainApi } from '../../api/api'
import { errorMessage, successMessage } from '../../app/common/notifications'

interface State {
  globalLoader: boolean
  isFullSizePreview: boolean
  savePreview: boolean
  unusedKeywords: string[]
  imagePreviewSlideLimits: {
    min: number
    max: number
  }
}

export const initialState: State = {
  globalLoader: false,
  isFullSizePreview: false,
  savePreview: true,
  unusedKeywords: [],
  imagePreviewSlideLimits: {
    min: 20,
    max: 300,
  },
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setGlobalLoader(state, action: PayloadAction<boolean>) {
      state.globalLoader = action.payload
    },
    setSavePreview(state, action: PayloadAction<boolean>) {
      state.savePreview = action.payload
    },
    setIsFullSizePreview(state, action: PayloadAction<boolean>) {
      state.isFullSizePreview = action.payload
    },
    setMinImagePreviewSlideLimit(state, action: PayloadAction<number>) {
      state.imagePreviewSlideLimits.min = action.payload
    },
    setMaxImagePreviewSlideLimit(state, action: PayloadAction<number>) {
      state.imagePreviewSlideLimits.max = action.payload
    },
    setUnusedKeywords(state, action: PayloadAction<string[]>) {
      state.unusedKeywords = action.payload
    },
    deleteUnusedKeywordFromState(state, action: PayloadAction<string>) {
      state.unusedKeywords = current(state).unusedKeywords.filter(keyword => keyword !== action.payload)
    },
  },
})

export const {
  setGlobalLoader,
  setSavePreview,
  setIsFullSizePreview,
  setMaxImagePreviewSlideLimit,
  setMinImagePreviewSlideLimit,
  setUnusedKeywords,
  deleteUnusedKeywordFromState,
} = settingsSlice.actions

export default settingsSlice.reducer

export const fetchUnusedKeywordsList = (): AppThunk => async dispatch => {
  mainApi
    .getUnusedKeywordsList()
    .then(({ data }) => {
      dispatch(setUnusedKeywords(data))
    })
    .catch(error => errorMessage(error, 'Error when getting unused keywords list: '))
}

export const deleteUnusedKeyword =
  (keyword: string): AppThunk =>
  dispatch => {
    mainApi
      .removeKeyword(keyword)
      .then(() => {
        dispatch(deleteUnusedKeywordFromState(keyword))
        successMessage('The unused keyword has been deleted')
      })
      .catch(error => errorMessage(error, 'Error when removing unused keyword: '))
  }
