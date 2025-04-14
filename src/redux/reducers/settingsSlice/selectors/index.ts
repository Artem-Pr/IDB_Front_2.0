import type { RootState } from 'src/redux/store/types'

export const getSettingsReducerImagePreviewSlideLimits = (state: RootState) => (
  state.settingsSliceReducer.imagePreviewSlideLimits
)
export const getSettingsReducerIsVideoPreviewMuted = (state: RootState) => state.settingsSliceReducer.isVideoPreviewMuted
export const getSettingsReducerIsNewUploader = (state: RootState) => state.settingsSliceReducer.isNewUploader
export const getSettingsReducerUnusedKeywords = (state: RootState) => state.settingsSliceReducer.unusedKeywords
