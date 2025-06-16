import type { AxiosError, AxiosResponse } from 'axios'

import { APIInstance } from 'src/api/api-instance'
import { authApi } from 'src/api/requests/api-requests'
import { RequestUrl } from 'src/api/requests/api-requests-url-list'
import { getSessionReducerRefreshToken } from 'src/redux/reducers/sessionSlice/selectors'
import { logout, setAllTokens } from 'src/redux/reducers/sessionSlice/thunks'
import type { ReduxStore } from 'src/redux/store/types'

import { RequestConfigWithIsRefreshTokenInfo } from '../types'

// Single promise that will be shared across all concurrent refresh attempts
let refreshPromise: Promise<boolean> | null = null

const handleRefreshResult = async (
  config: RequestConfigWithIsRefreshTokenInfo,
  success: boolean,
  error: AxiosError,
): Promise<AxiosResponse> => {
  if (!success) {
    return Promise.reject()
  }

  config.isTokensRefreshed = true

  if (config.url !== RequestUrl.TUS_UPLOAD) {
    return APIInstance(config)
  }

  return error.response as AxiosResponse
}

export const refreshTokens = async (
  config: RequestConfigWithIsRefreshTokenInfo,
  currentStore: ReduxStore,
  error: AxiosError,
): Promise<AxiosResponse> => {
  const { dispatch, getState } = currentStore
  const refreshToken = getSessionReducerRefreshToken(getState())

  if (!refreshToken) {
    return Promise.reject()
  }

  // If there's already a refresh in progress, wait for it
  if (refreshPromise) {
    const success = await refreshPromise
    return handleRefreshResult(config, success, error)
  }

  // Start new refresh process
  refreshPromise = new Promise(async resolve => {
    try {
      const response = await authApi.refreshTokens(refreshToken)
      
      if (!response) {
        dispatch(logout())
        resolve(false)
        return
      }

      dispatch(setAllTokens(response))
      resolve(true)
    } catch (error) {
      console.error("Token refresh failed:", error)
      dispatch(logout())
      resolve(false)
    } finally {
      // Clear the promise after a short delay to prevent race conditions
      setTimeout(() => {
        refreshPromise = null
      }, 100)
    }
  })

  const success = await refreshPromise
  return handleRefreshResult(config, success, error)
}
