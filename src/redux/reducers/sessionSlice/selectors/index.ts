import { createSelector } from 'reselect'

import { PagePaths } from 'src/common/constants'
import type { RootState } from 'src/redux/store/types'

export const getSessionReducerAsideMenuWidth = (state: RootState) => state.sessionSliceReducer.asideMenuWidth
export const getSessionReducerCurrentPage = (state: RootState) => state.sessionSliceReducer.currentPage
export const getSessionReducerFitContain = (state: RootState) => state.sessionSliceReducer.fitContain
export const getSessionReducerIsDuplicatesChecking = (state: RootState) => state.sessionSliceReducer.isDuplicatesChecking
export const getSessionReducerIsLoading = (state: RootState) => state.sessionSliceReducer.isLoading
export const getSessionReducerIsTimesDifferenceApplied = (state: RootState) => (
  state.sessionSliceReducer.isTimesDifferenceApplied
)
export const getSessionReducerPreviewSize = (state: RootState) => state.sessionSliceReducer.previewSize
export const getSessionReducerScrollUpWhenUpdating = (state: RootState) => state.sessionSliceReducer.scrollUpWhenUpdating
export const getSessionReducerTriggerScrollUp = (state: RootState) => state.sessionSliceReducer.triggerScrollUp

export const getSessionReducerIsCurrentPage = createSelector(
  getSessionReducerCurrentPage,
  currentPageName => ({
    isMainPage: currentPageName === PagePaths.MAIN,
    isUploadPage: currentPageName === PagePaths.UPLOAD,
    isLoginPage: currentPageName === PagePaths.LOGIN,
  }),
)
