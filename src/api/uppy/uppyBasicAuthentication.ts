import { HttpStatusCode } from 'axios'
import type { HttpRequest, HttpResponse } from 'tus-js-client/lib'

import type { Defined } from 'src/redux/types'

import type { UppyAuthentication } from './uppyAuthenticationInterface'
import type { TusOpt } from './uppyTypes'

export class UppyBasicAuthentication implements UppyAuthentication {
  private _accessToken: string | null = null
  private _authorizationHeader: string | undefined

  constructor(accessToken?: string) {
    if (accessToken) {
      this._accessToken = accessToken
    }
  }

  isInitialized(): boolean {
    return Boolean(this._accessToken)
  }

  getAccessToken(): string | null {
    return this._accessToken
  }

  setAccessToken(token: string): void {
    this._accessToken = token
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

  onShouldRetry: Defined<TusOpt['onShouldRetry']> = (err, _retryAttempt, _options, next) => {
    const errorStatus = err?.originalResponse?.getStatus()
    
    if (errorStatus === HttpStatusCode.Unauthorized) {
      return true
    }
    next(err)
    return true
  }

  async onAfterResponse(_req: HttpRequest, res: HttpResponse): Promise<void> {
    const errorStatus = res?.getStatus()
    
    if (errorStatus === HttpStatusCode.Unauthorized) {
      console.warn('Unauthorized response received. You may need to implement token refresh logic.')
    }
  }
} 