import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Paths } from 'src/routes/paths'

export const DEFAULT_PREVIEW_SIZE = 150

export interface State {
  asideMenuWidth: number
  currentPage: Paths | null
  fitContain: boolean
  isDuplicatesChecking: boolean
  isLoading: boolean
  isTimesDifferenceApplied: boolean
  previewSize: number
  scrollUpWhenUpdating: boolean
  triggerScrollUp: boolean
  user: {
    email: string | undefined
    id: string | undefined
    name: string | undefined
    roles: string[]
  }
  auth: {
    accessToken: string
    expiration: number | undefined
    permissions: string[]
    refreshToken: string
  }
}

const initialState: State = {
  asideMenuWidth: 400,
  currentPage: null,
  fitContain: false,
  isDuplicatesChecking: false,
  isLoading: false,
  isTimesDifferenceApplied: false,
  previewSize: DEFAULT_PREVIEW_SIZE,
  scrollUpWhenUpdating: true,
  triggerScrollUp: false,
  user: {
    email: undefined,
    id: undefined,
    name: undefined,
    roles: [],
  },
  auth: {
    accessToken: '',
    expiration: undefined,
    permissions: [],
    refreshToken: '',
  },
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    sessionReducerSetAccessToken(state, action: PayloadAction<string>) {
      state.auth.accessToken = action.payload
    },
    sessionReducerRemoveAccessToken(state) {
      state.auth.accessToken = ''
    },
    sessionReducerSetRefreshToken(state, action: PayloadAction<string>) {
      state.auth.refreshToken = action.payload
    },
    sessionReducerSetExpiration(state, action: PayloadAction<number | undefined>) {
      state.auth.expiration = action.payload
    },
    sessionReducerRemoveRefreshToken(state) {
      state.auth.refreshToken = ''
    },
    sessionReducerSetPermissions(state, action: PayloadAction<string[]>) {
      state.auth.permissions = action.payload
    },
    sessionReducerRemovePermissions(state) {
      state.auth.permissions = []
    },
    sessionReducerRefreshPreviewSize(state) {
      state.previewSize = DEFAULT_PREVIEW_SIZE
    },
    sessionReducerSetAsideMenuWidth(state, action: PayloadAction<number>) {
      state.asideMenuWidth = action.payload
    },
    sessionReducerSetCurrentPage(state, action: PayloadAction<Paths | null>) {
      state.currentPage = action.payload
    },
    sessionReducerSetFitContain(state, action: PayloadAction<boolean>) {
      state.fitContain = action.payload
    },
    sessionReducerSetIsDuplicatesChecking(state, action: PayloadAction<boolean>) {
      state.isDuplicatesChecking = action.payload
    },
    sessionReducerSetIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    sessionReducerSetIsTimeDifferenceApplied(state, action: PayloadAction<boolean>) {
      state.isTimesDifferenceApplied = action.payload
    },
    sessionReducerSetPreviewSize(state, action: PayloadAction<number>) {
      state.previewSize = action.payload
    },
    sessionReducerSetScrollUpWhenUpdating(state, action: PayloadAction<boolean>) {
      state.scrollUpWhenUpdating = action.payload
    },
    sessionReducerSetTriggerScrollUp(state, action: PayloadAction<boolean>) {
      state.triggerScrollUp = action.payload
    },
    sessionReducerSetUserId(state, action: PayloadAction<string | undefined>) {
      state.user.id = action.payload
    },
    sessionReducerSetUserEmail(state, action: PayloadAction<string | undefined>) {
      state.user.email = action.payload
    },
    sessionReducerSetUserName(state, action: PayloadAction<string | undefined>) {
      state.user.name = action.payload
    }
  },
})

export const {
  sessionReducerRefreshPreviewSize,
  sessionReducerRemoveAccessToken,
  sessionReducerRemovePermissions,
  sessionReducerRemoveRefreshToken,
  sessionReducerSetAccessToken,
  sessionReducerSetAsideMenuWidth,
  sessionReducerSetCurrentPage,
  sessionReducerSetExpiration,
  sessionReducerSetFitContain,
  sessionReducerSetIsDuplicatesChecking,
  sessionReducerSetIsLoading,
  sessionReducerSetIsTimeDifferenceApplied,
  sessionReducerSetPermissions,
  sessionReducerSetPreviewSize,
  sessionReducerSetRefreshToken,
  sessionReducerSetScrollUpWhenUpdating,
  sessionReducerSetTriggerScrollUp,
  sessionReducerSetUserEmail,
  sessionReducerSetUserId,
  sessionReducerSetUserName,
} = sessionSlice.actions

export const sessionSliceReducer = sessionSlice.reducer
