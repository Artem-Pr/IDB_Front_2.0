/* eslint-disable functional/immutable-data */
import { createListenerMiddleware } from '@reduxjs/toolkit'

import {
  setIsFullSizePreview,
  setMaxImagePreviewSlideLimit,
  setMinImagePreviewSlideLimit,
} from '../../reducers/settingsSlice-reducer'
import { localStorageAPI } from '../../../app/common/utils/localStorageAPI'

export const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
  actionCreator: setIsFullSizePreview,
  effect: action => {
    localStorageAPI.fullSizePreview = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: setMaxImagePreviewSlideLimit,
  effect: action => {
    localStorageAPI.maxImagePreviewLimit = action.payload
  },
})

listenerMiddleware.startListening({
  actionCreator: setMinImagePreviewSlideLimit,
  effect: action => {
    localStorageAPI.minImagePreviewLimit = action.payload
  },
})

export const settingsMiddleware = listenerMiddleware.middleware
