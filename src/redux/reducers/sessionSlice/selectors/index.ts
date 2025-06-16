import { createSelector } from 'reselect'

import type { RootState } from 'src/redux/store/types'
import { Paths } from 'src/routes/paths'

export const getSessionReducerAuth = (state: RootState) => state.sessionSliceReducer.auth
export const getSessionReducerAccessToken = (state: RootState) => state.sessionSliceReducer.auth.accessToken
export const getSessionReducerRefreshToken = (state: RootState) => state.sessionSliceReducer.auth.refreshToken
export const getSessionReducerPermissions = (state: RootState) => state.sessionSliceReducer.auth.permissions
export const getSessionReducerExpiration = (state: RootState) => state.sessionSliceReducer.auth.expiration
export const getSessionReducerUser = (state: RootState) => state.sessionSliceReducer.user
export const getSessionReducerUserEmail = (state: RootState) => state.sessionSliceReducer.user.email
export const getSessionReducerUserId = (state: RootState) => state.sessionSliceReducer.user.id
export const getSessionReducerUserName = (state: RootState) => state.sessionSliceReducer.user.name
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
    isMainPage: currentPageName === Paths.MAIN,
    isUploadPage: currentPageName === Paths.UPLOAD,
    isLoginPage: currentPageName === Paths.LOGIN,
  }),
)
