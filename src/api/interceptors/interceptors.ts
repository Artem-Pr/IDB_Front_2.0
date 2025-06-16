import type { AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

import type { ReduxStore } from 'src/redux/store/types'

import { APIInstance } from '../api-instance'

import { resetAbortController, setAbortController } from './abortRequests'
import { addAccessToken } from './addAccessToken'
import { refreshTokensIfAccessTokenExpired } from './refreshTokensIfAccessTokenExpired'

export const initAxiosInterceptors = (currentStore: ReduxStore) => {
  const setAccessToken = (config: InternalAxiosRequestConfig<AxiosRequestConfig>) => addAccessToken(config, currentStore)
  const handleResponse = (config: AxiosResponse) => config
  const handleResponseError = (error: AxiosError) => (
    refreshTokensIfAccessTokenExpired(error, currentStore)
  )

  APIInstance.interceptors.request.use(setAccessToken)
  APIInstance.interceptors.request.use(setAbortController)

  APIInstance.interceptors.response.use(handleResponse, handleResponseError)
  APIInstance.interceptors.response.use(resetAbortController)
}
