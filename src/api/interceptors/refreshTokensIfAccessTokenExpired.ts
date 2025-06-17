import {  HttpStatusCode } from 'axios'
import type { AxiosError, AxiosResponse } from 'axios'

import type { ReduxStore } from 'src/redux/store/types'

import { RequestUrl } from '../requests/api-requests-url-list'

import { refreshTokens } from './helpers'
import type { RequestConfigWithIsRefreshTokenInfo, AuthenticationFailureError } from './types'

const isAuthenticationFailureError = (error: any): error is AuthenticationFailureError => {
  return error?.isAuthFailure === true
}

export const refreshTokensIfAccessTokenExpired = async (
  error: AxiosError,
  currentStore: ReduxStore,
): Promise<AxiosResponse> => {
  const axiosRequestConfig: RequestConfigWithIsRefreshTokenInfo | undefined = error.config

  if (!axiosRequestConfig) {
    return Promise.reject(error)
  }

  const isNotLoginRequest = (axiosRequestConfig.url !== RequestUrl.LOGIN)
  const isNotRefreshTokensRequest = (axiosRequestConfig.url !== RequestUrl.REFRESH_TOKENS)
  const unAuthenticated = (error.response?.status === HttpStatusCode.Unauthorized)
  const isNotLoginError = (
    isNotLoginRequest
        && isNotRefreshTokensRequest
        && error.response
  )
  const isAccessTokenError = (unAuthenticated && !axiosRequestConfig.isTokensRefreshed)

  if (isNotLoginError) {
    if (isAccessTokenError) {
      try {
        return await refreshTokens(axiosRequestConfig, currentStore, error)
      } catch (refreshError) {
        // If it's an AuthenticationFailureError, reject with the auth error
        // This will be caught by the .catch() block and handled by our global errorMessage function
        if (isAuthenticationFailureError(refreshError)) {
          return Promise.reject(refreshError)
        }
        // Re-throw other types of errors
        throw refreshError
      }
    }
  }
  
  return Promise.reject(error)
}
