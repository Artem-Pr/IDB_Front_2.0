import type { HttpRequest, HttpResponse } from 'tus-js-client/lib'

import type { Defined } from 'src/redux/types'

import type { TusOpt } from './uppyTypes'

export interface UppyAuthentication {
  /**
   * Get the current access token
   */
  getAccessToken(): string | null

  /**
   * Set authorization header for requests
   */
  setAuthorizationHeader(token: string): void

  /**
   * Get the current authorization header
   */
  getAuthorizationHeader(): string | undefined

  /**
   * Handle before request - typically to set auth headers
   */
  onBeforeRequest(req: HttpRequest): void

  /**
   * Handle response after request - typically for token refresh
   */
  onAfterResponse(req: HttpRequest, res: HttpResponse): Promise<void>

  /**
   * Determine if request should be retried
   */
  onShouldRetry: Defined<TusOpt['onShouldRetry']>

  /**
   * Check if authentication is properly initialized
   */
  isInitialized(): boolean
} 