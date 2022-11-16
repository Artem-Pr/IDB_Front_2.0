import { AppDispatch } from './store'
import {
  setIsFullSizePreview,
  setMaxImagePreviewSlideLimit,
  setMinImagePreviewSlideLimit,
} from '../reducers/settingsSlice-reducer'
import { localStorageAPI } from '../../app/common/utils/localStorageAPI'

export const setDefaultStore = (dispatch: AppDispatch) => {
  dispatch(setIsFullSizePreview(localStorageAPI.fullSizePreview))
  dispatch(setMaxImagePreviewSlideLimit(localStorageAPI.maxImagePreviewLimit))
  dispatch(setMinImagePreviewSlideLimit(localStorageAPI.minImagePreviewLimit))
}
