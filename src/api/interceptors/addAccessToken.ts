import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

import { getSessionReducerAccessToken } from 'src/redux/reducers/sessionSlice/selectors'
import type { ReduxStore } from 'src/redux/store/types'

import { RequestUrl } from '../requests/api-requests-url-list'

export const addAccessToken = (
  config: InternalAxiosRequestConfig<AxiosRequestConfig<any>>,
  currentStore: ReduxStore,
): InternalAxiosRequestConfig<AxiosRequestConfig<any>> => {
  const accessToken = getSessionReducerAccessToken(currentStore.getState())
  const isNotRefreshTokenRequest = config.url !== RequestUrl.REFRESH_TOKENS

  if (isNotRefreshTokenRequest && accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`)

    return config
  }

  return config
}
