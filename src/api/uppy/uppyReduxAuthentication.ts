import type { InternalAxiosRequestConfig } from 'axios'
import { AxiosError, HttpStatusCode } from 'axios'
import type { HttpRequest, HttpResponse } from 'tus-js-client/lib'

import { getSessionReducerAccessToken } from 'src/redux/reducers/sessionSlice/selectors'
import type { ReduxStore } from 'src/redux/store/types'
import type { Defined } from 'src/redux/types'

import { refreshTokensIfAccessTokenExpired } from '../interceptors/refreshTokensIfAccessTokenExpired'
import { RequestUrl } from '../requests/api-requests-url-list'

import type { UppyAuthentication } from './uppyAuthenticationInterface'
import type { TusOpt } from './uppyTypes'

export class UppyReduxAuthentication implements UppyAuthentication {
  private _reduxStore: ReduxStore | undefined = undefined
  private _authorizationHeader: string | undefined

  constructor(reduxStore?: ReduxStore) {
    if (reduxStore) {
      this._reduxStore = reduxStore
    }
  }

  isInitialized(): boolean {
    return Boolean(this._reduxStore)
  }

  get reduxStore(): ReduxStore {
    if (!this.isInitialized()) {
      throw new Error('Redux store is not initialized')
    }
    return this._reduxStore as ReduxStore
  }

  setReduxStore(store: ReduxStore): void {
    this._reduxStore = store
  }

  getAccessToken(): string | null {
    if (!this.isInitialized()) {
      return null
    }
    return getSessionReducerAccessToken(this.reduxStore.getState())
  }

  setAuthorizationHeader(token: string): void {
    this._authorizationHeader = `Bearer ${token}`
  }

  getAuthorizationHeader(): string | undefined {
    const token = this.getAccessToken()
    if (token) {
      this.setAuthorizationHeader(token)
    }
    return this._authorizationHeader
  }

  onBeforeRequest = (req: HttpRequest): void => {
    const authHeader = this.getAuthorizationHeader()
    if (authHeader) {
      req.setHeader('Authorization', authHeader)
    }
  }

  private async refreshTokens(res: HttpResponse): Promise<void> {
    const axiosConfig = { url: RequestUrl.TUS_UPLOAD } as InternalAxiosRequestConfig
    const axiosError = new AxiosError()
    axiosError.config = axiosConfig
    axiosError.response = {
      data: res.getBody(),
      status: res.getStatus(),
      statusText: HttpStatusCode[res.getStatus()],
      headers: {},
      config: axiosConfig,
    }

    try {
      await refreshTokensIfAccessTokenExpired(axiosError, this.reduxStore)
      const newToken = this.getAccessToken()
      if (newToken) {
        this.setAuthorizationHeader(newToken)
      }
    } catch (refreshError) {
      throw refreshError
    }
  }

  onShouldRetry: Defined<TusOpt['onShouldRetry']> = (err, _retryAttempt, _options, next) => {
    const errorStatus = err?.originalResponse?.getStatus()
    
    if (errorStatus === HttpStatusCode.Unauthorized) {
      return true
    }
    return next(err)
  }

  async onAfterResponse(_req: HttpRequest, res: HttpResponse): Promise<void> {
    const errorStatus = res?.getStatus()
    
    if (errorStatus === HttpStatusCode.Unauthorized) {
      try {
        await this.refreshTokens(res)
      } catch (error) {
        console.error('Token refresh failed:', error)
        throw error
      }
    }
  }


} 