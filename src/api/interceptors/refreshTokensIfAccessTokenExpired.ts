import {  HttpStatusCode } from 'axios'
import type { AxiosError, AxiosResponse } from 'axios'

import type { ReduxStore } from 'src/redux/store/types'

import { RequestUrl } from '../requests/api-requests-url-list'

import { refreshTokens } from './helpers'
import type { RequestConfigWithIsRefreshTokenInfo } from './types'

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
      return refreshTokens(axiosRequestConfig, currentStore, error)
    }
  } {
    return Promise.reject(error)
  }
}
